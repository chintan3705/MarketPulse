
import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(_request: NextRequest) {
  try {
    const cookieStore = cookies();
    cookieStore.set('marketpulse_auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: -1, // Expire the cookie
    });

    return NextResponse.json(
      { message: 'Logout successful.' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Logout API Error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred.';
    return NextResponse.json(
      { message: 'Error during logout.', error: errorMessage },
      { status: 500 },
    );
  }
}
