
import { NextResponse, type NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import UserModel from '@/models/User';
import { z } from 'zod';

const SignupSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long.' }),
  role: z.enum(['admin', 'user']).optional(),
});

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const validationResult = SignupSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { message: 'Invalid input.', errors: validationResult.error.format() },
        { status: 400 },
      );
    }

    const { email, password, role } = validationResult.data;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists with this email.' },
        { status: 409 }, // Conflict
      );
    }
    
    // For simplicity, first admin user created gets admin role, otherwise default to user
    // In a real app, role assignment should be more secure.
    const userCount = await UserModel.countDocuments();
    const assignedRole = role || (userCount === 0 ? 'admin' : 'user');


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
      { message: 'User created successfully.', user: userResponse },
      { status: 201 },
    );
  } catch (error) {
    console.error('Signup API Error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred.';
    return NextResponse.json(
      { message: 'Error creating user.', error: errorMessage },
      { status: 500 },
    );
  }
}
