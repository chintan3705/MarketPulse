import { NextResponse, type NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import UserModel from "@/models/User";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { cookies } from "next/headers";

const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d"; // Default to 1 day

if (!JWT_SECRET) {
  console.error(
    "❌ FATAL: JWT_SECRET is not defined in /api/auth/login/route.ts. Ensure it's in your .env file and the server is restarted.",
  );
  // This throw will halt server startup or cause 500 if it's dynamically loaded later in some environments
  throw new Error("Server configuration error: JWT_SECRET is missing.");
}

export async function POST(request: NextRequest) {
  console.log("✅ [API Login] Received POST request.");
  try {
    console.log("  [API Login] Attempting to connect to DB...");
    await connectDB();
    console.log("  [API Login] DB Connected. Parsing request body...");
    const body = await request.json();
    console.log("  [API Login] Request body parsed:", body);

    const validationResult = LoginSchema.safeParse(body);
    if (!validationResult.success) {
      console.warn(
        "  [API Login] Input validation failed:",
        validationResult.error.format(),
      );
      return NextResponse.json(
        { message: "Invalid input.", errors: validationResult.error.format() },
        { status: 400 },
      );
    }
    console.log("  [API Login] Input validated.");

    const { email, password } = validationResult.data;
    console.log(`  [API Login] Attempting to find user: ${email}`);

    const user = await UserModel.findOne({ email }).select("+password");
    if (!user) {
      console.warn(`  [API Login] User not found: ${email}`);
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 },
      );
    }
    console.log(`  [API Login] User found: ${email}, Role: ${user.role}`);

    if (!user.password) {
      console.error(
        `  [API Login] User ${email} found but has no password hash in DB.`,
      );
      return NextResponse.json(
        { message: "Authentication error. Critical: User record incomplete." },
        { status: 500 },
      );
    }

    console.log(`  [API Login] Comparing password for user: ${email}`);
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      console.warn(`  [API Login] Password mismatch for user: ${email}`);
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 },
      );
    }
    console.log(`  [API Login] Password matched for user: ${email}`);

    if (user.role !== "admin") {
      console.warn(
        `  [API Login] Non-admin user login attempt: ${email}, Role: ${user.role}`,
      );
      return NextResponse.json(
        { message: "Access denied. Only admin users can log in here." },
        { status: 403 }, // Forbidden
      );
    }
    console.log(`  [API Login] Admin user verified: ${email}`);

    const tokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };
    console.log("  [API Login] Token payload created:", tokenPayload);
    console.log(
      "  [API Login] JWT_SECRET used for signing (length check):",
      JWT_SECRET?.length || 0,
    );

    const token = jwt.sign(tokenPayload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
    console.log("  [API Login] JWT signed successfully.");

    const cookieStore = cookies();
    console.log("  [API Login] Setting auth cookie...");

    let maxAgeSeconds;
    const unit = JWT_EXPIRES_IN.slice(-1);
    const value = parseInt(JWT_EXPIRES_IN.slice(0, -1), 10);

    if (isNaN(value)) {
      maxAgeSeconds = 24 * 60 * 60; // Default to 1 day if parsing fails
      console.warn(
        `  [API Login] Invalid JWT_EXPIRES_IN format: "${JWT_EXPIRES_IN}". Defaulting cookie maxAge to 1 day.`,
      );
    } else {
      switch (unit) {
        case "s":
          maxAgeSeconds = value;
          break;
        case "m":
          maxAgeSeconds = value * 60;
          break;
        case "h":
          maxAgeSeconds = value * 60 * 60;
          break;
        case "d":
          maxAgeSeconds = value * 24 * 60 * 60;
          break;
        default:
          maxAgeSeconds = 24 * 60 * 60; // Default for unrecognized unit
          console.warn(
            `  [API Login] Unrecognized unit in JWT_EXPIRES_IN: "${unit}". Defaulting cookie maxAge to 1 day.`,
          );
      }
    }

    cookieStore.set("marketpulse_auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: maxAgeSeconds,
    });
    console.log(
      "  [API Login] Auth cookie set. Max-Age (seconds):",
      maxAgeSeconds,
    );

    const userResponse = {
      _id: user._id,
      email: user.email,
      role: user.role,
    };

    console.log("✅ [API Login] Login successful. Sending response.");
    return NextResponse.json(
      { message: "Login successful.", user: userResponse },
      { status: 200 },
    );
  } catch (error) {
    console.error("❌ [API Login] Error in POST handler:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred during login.";
    return NextResponse.json(
      { message: "Login failed due to a server error.", error: errorMessage },
      { status: 500 },
    );
  }
}
