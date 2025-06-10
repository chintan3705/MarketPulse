
// This file is no longer needed as we have a dedicated /signup-admin page.
// Keeping it temporarily to avoid breaking existing references, but it should be deleted.
// It will now redirect to the new page.
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const newSignupAdminUrl = new URL('/signup-admin', request.url);
  return NextResponse.redirect(newSignupAdminUrl);
}
