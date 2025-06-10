import { NextResponse, type NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import UserModel from "@/models/User";
import { z } from "zod";

const SignupSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." }),
  role: z.enum(["admin", "user"]).optional(), // Role is optional from the request
});

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const validationResult = SignupSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { message: "Invalid input.", errors: validationResult.error.format() },
        { status: 400 },
      );
    }

    const { email, password, role } = validationResult.data;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists with this email." },
        { status: 409 }, // Conflict
      );
    }

    // Determine the role:
    // If 'admin' is explicitly passed (e.g., from the admin creation utility page), use 'admin'.
    // Otherwise, default to 'user'. This makes the API flexible.
    // For the specific /api/auth/signup-page, it will always send 'admin'.
    const assignedRole = role === "admin" ? "admin" : "user";

    // If this is the very first user being created in the system, and no role was specified,
    // consider making them an admin. This is a fallback, the /api/auth/signup-page should handle explicit admin creation.
    // However, with the `assignedRole` logic above, this specific block might become less critical
    // if the admin utility page always correctly sends `role: 'admin'`.
    // For now, keeping it simple: if the utility page sends 'admin', it's 'admin'.
    // If this API were used for general public signup, `assignedRole` would correctly default to 'user'.

    // const userCount = await UserModel.countDocuments();
    // const finalRole = role || (userCount === 0 ? 'admin' : 'user');
    // Using `assignedRole` from above is cleaner if utility page sends role:'admin'

    const newUser = new UserModel({
      email,
      password, // Hashing is handled by pre-save middleware in User model
      role: assignedRole,
    });

    await newUser.save();

    // Do NOT return the password
    const userResponse = {
      _id: newUser._id,
      email: newUser.email,
      role: newUser.role,
    };

    return NextResponse.json(
      {
        message: `User created successfully with role: ${assignedRole}.`,
        user: userResponse,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Signup API Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json(
      { message: "Error creating user.", error: errorMessage },
      { status: 500 },
    );
  }
}
