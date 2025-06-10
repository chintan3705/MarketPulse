
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserPlus, ShieldAlert } from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import Link from 'next/link';

const signupSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long.' }),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupAdminPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit: SubmitHandler<SignupFormValues> = async (data) => {
    setIsLoading(true);
    setApiError(null);
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, role: 'admin' }), // Explicitly set role to admin
      });

      const result = await response.json();

      if (!response.ok) {
        let errorMsg = result.message || 'Signup failed. Please try again.';
        if (result.errors) {
            if (result.errors.email) errorMsg += ` Email: ${result.errors.email._errors.join(', ')}`;
            if (result.errors.password) errorMsg += ` Password: ${result.errors.password._errors.join(', ')}`;
        }
        throw new Error(errorMsg);
      }

      toast({
        title: 'Admin Account Created',
        description: 'Your admin account has been successfully created. Please log in.',
      });
      router.push('/login'); // Redirect to login page after successful signup
    } catch (error) {
      const catchedError = error as Error;
      setApiError(catchedError.message);
      toast({
        title: 'Signup Failed',
        description: catchedError.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <div className="absolute top-6 left-6">
        <Logo iconSize="h-7 w-7" textSize="text-xl" />
      </div>
      <Card className="w-full max-w-sm shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold font-headline">Create Admin Account</CardTitle>
          <CardDescription>
            Enter details to create an initial admin user.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                {...register('email')}
                className={errors.email ? 'border-destructive' : ''}
                aria-invalid={errors.email ? "true" : "false"}
              />
              {errors.email && (
                <p className="text-xs text-destructive" role="alert">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="•••••••• (min. 6 characters)"
                {...register('password')}
                className={errors.password ? 'border-destructive' : ''}
                aria-invalid={errors.password ? "true" : "false"}
              />
              {errors.password && (
                <p className="text-xs text-destructive" role="alert">{errors.password.message}</p>
              )}
            </div>
            
            {apiError && (
              <div className="flex items-center gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive" role="alert">
                <ShieldAlert className="h-4 w-4 flex-shrink-0" />
                <span>{apiError}</span>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <UserPlus className="mr-2 h-4 w-4" />
              )}
              Create Admin
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center text-xs text-muted-foreground pt-4">
          <p>Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Login here
            </Link>
          </p>
           <p className="mt-2 text-center text-xs text-muted-foreground">
            Note: This page is for initial admin setup.
            <br /> It might be restricted in production environments.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
