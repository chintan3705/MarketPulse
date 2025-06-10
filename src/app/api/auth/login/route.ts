
import { NextResponse, type NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import UserModel from '@/models/User';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { cookies } from 'next/headers';

const LoginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables.');
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const validationResult = LoginSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { message: 'Invalid input.', errors: validationResult.error.format() },
        { status: 400 },
      );
    }

    const { email, password } = validationResult.data;

    const user = await UserModel.findOne({ email }).select('+password');
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password.' },
        { status: 401 },
      );
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return NextResponse.json(
        { message: 'Invalid email or password.' },
        { status: 401 },
      );
    }

    if (user.role !== 'admin') {
       return NextResponse.json(
        { message: 'Access denied. Not an admin user.' },
        { status: 403 }, // Forbidden
      );
    }

    const tokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    const cookieStore = cookies();
    cookieStore.set('marketpulse_auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: JWT_EXPIRES_IN === '1d' ? 24 * 60 * 60 : 7 * 24 * 60 * 60, // 1 day or 7 days in seconds
    });
    
    // Do not return password
    const userResponse = {
      _id: user._id,
      email: user.email,
      role: user.role,
    };

    return NextResponse.json(
      { message: 'Login successful.', user: userResponse },
      { status: 200 },
    );
  } catch (error) {
    console.error('Login API Error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred.';
    return NextResponse.json(
      { message: 'Error during login.', error: errorMessage },
      { status: 500 },
    );
  }
}
