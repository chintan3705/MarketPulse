
import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose"; // Using jose for JWT verification in Edge runtime

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error(
    "JWT_SECRET is not defined in environment variables for middleware.",
  );
}

// Helper to verify JWT
async function verifyToken(token: string) {
  if (!JWT_SECRET) return null;
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload as {
      userId: string;
      email: string;
      role: string;
      iat: number;
      exp: number;
    };
  } catch (error) {
    console.error("JWT Verification Error in Middleware:", error);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    const authTokenCookie = request.cookies.get("marketpulse_auth_token");

    // If no token, redirect to login, preserving the intended destination
    if (!authTokenCookie?.value) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // If token exists, verify it
    const decodedToken = await verifyToken(authTokenCookie.value);

    // If token is invalid or user is not an admin, redirect to login
    if (!decodedToken || decodedToken.role !== "admin") {
      const loginUrl = new URL("/login", request.url);
      const response = NextResponse.redirect(loginUrl);
      // Clear the invalid cookie
      response.cookies.set("marketpulse_auth_token", "", {
        maxAge: -1,
        path: "/",
      });
      return response;
    }
  }

  // If all checks pass, continue to the requested page
  return NextResponse.next();
}

// Specify paths for the middleware to run on.
// We only need to protect the /admin routes.
export const config = {
  matcher: "/admin/:path*",
};
