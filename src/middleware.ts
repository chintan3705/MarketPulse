import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose"; // Using jose for JWT verification in Edge runtime
import { locales, defaultLocale } from "./i18n-config";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error(
    "JWT_SECRET is not defined in environment variables for middleware.",
  );
}

// Helper to get locale from request headers
function getLocale(request: NextRequest): string {
  const negotiatorHeaders: { [key: string]: string | string[] | undefined } = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();

  try {
    return matchLocale(languages, locales, defaultLocale);
  } catch (e) {
    // Fallback to default locale if matching fails
    return defaultLocale;
  }
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
  const pathname = request.nextUrl.pathname;

  // --- 1. Locale Detection and Redirection ---
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );

  // Skip i18n logic for API routes and static files
  if (
    !pathname.startsWith("/api") &&
    !pathname.startsWith("/_next") &&
    !pathname.includes(".") &&
    pathnameIsMissingLocale
  ) {
    const locale = getLocale(request);
    // Redirect to the same path but with the detected locale prefix
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
  }

  // --- 2. Authentication and Authorization ---
  const currentLocale = pathname.split("/")[1];

  // Only apply auth check to admin routes
  if (
    locales.includes(currentLocale) &&
    pathname.startsWith(`/${currentLocale}/admin`)
  ) {
    const authTokenCookie = request.cookies.get("marketpulse_auth_token");

    if (!authTokenCookie?.value) {
      const loginUrl = new URL(`/${currentLocale}/login`, request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const decodedToken = await verifyToken(authTokenCookie.value);
    if (!decodedToken || decodedToken.role !== "admin") {
      const loginUrl = new URL(`/${currentLocale}/login`, request.url);
      const response = NextResponse.redirect(loginUrl);
      // Clear the invalid cookie
      response.cookies.set("marketpulse_auth_token", "", {
        maxAge: -1,
        path: "/",
      });
      return response;
    }
  }

  return NextResponse.next();
}

// Specify paths for the middleware to run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * This avoids running the middleware on most static assets and all API routes.
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
