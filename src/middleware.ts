
import { NextResponse, type NextRequest } from 'next/server';
import { jwtVerify } from 'jose'; // Using jose for JWT verification in Edge runtime

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('JWT_SECRET is not defined in environment variables for middleware.');
  // Potentially throw an error or handle differently if needed in strict environments
}

async function verifyToken(token: string) {
  if (!JWT_SECRET) return null;
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload as { userId: string; email: string; role: string; iat: number; exp: number };
  } catch (error) {
    console.error('JWT Verification Error in Middleware:', error);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define public paths that don't require authentication
  const publicPaths = ['/login', '/api/auth/login', '/api/auth/signup']; // Add other public paths if any

  // Allow access to static files and Next.js internals without auth check
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.startsWith('/favicon.ico') || // Common static assets
    publicPaths.some(p => pathname.startsWith(p))
  ) {
    return NextResponse.next();
  }
  
  const authTokenCookie = request.cookies.get('marketpulse_auth_token');

  if (pathname.startsWith('/admin')) {
    if (!authTokenCookie?.value) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname); // Optional: redirect back after login
      return NextResponse.redirect(loginUrl);
    }

    const decodedToken = await verifyToken(authTokenCookie.value);
    if (!decodedToken || decodedToken.role !== 'admin') {
      // Clear potentially invalid/tampered cookie
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.set('marketpulse_auth_token', '', { maxAge: -1, path: '/' });
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
     * - api (API routes, _except_ /api/auth which we might want to protect selectively or handle in API logic)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * This ensures admin routes are checked, and other API routes can manage their own auth.
     */
    '/((?!api/posts|api/admin|favicon.ico|_next/image|_next/static).*)',
    '/admin/:path*', // Explicitly include admin paths for checking
  ],
};
