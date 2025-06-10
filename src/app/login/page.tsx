"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, LogIn, ShieldAlert } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import Link from "next/link";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    setIsLoading(true);
    setApiError(null);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Login failed. Please try again.");
      }

      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });

      const redirectUrl = searchParams.get("redirect") || "/admin";
      router.push(redirectUrl);
      router.refresh();
    } catch (error) {
      const catchedError = error as Error;
      setApiError(catchedError.message);
      toast({
        title: "Login Failed",
        description: catchedError.message,
        variant: "destructive",
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
          <CardTitle className="text-2xl font-bold font-headline">
            Admin Login
          </CardTitle>
          <CardDescription>
            Enter your credentials to access the admin panel.
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
                {...register("email")}
                className={errors.email ? "border-destructive" : ""}
                aria-invalid={errors.email ? "true" : "false"}
              />
              {errors.email && (
                <p className="text-xs text-destructive" role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                className={errors.password ? "border-destructive" : ""}
                aria-invalid={errors.password ? "true" : "false"}
              />
              {errors.password && (
                <p className="text-xs text-destructive" role="alert">
                  {errors.password.message}
                </p>
              )}
            </div>

            {apiError && (
              <div
                className="flex items-center gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive"
                role="alert"
              >
                <ShieldAlert className="h-4 w-4 flex-shrink-0" />
                <span>{apiError}</span>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LogIn className="mr-2 h-4 w-4" />
              )}
              Login
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center text-xs text-muted-foreground pt-4">
          <p>
            No account?{" "}
            <Link
              href="/signup-admin"
              className="font-medium text-primary hover:underline"
            >
              Create an admin account
            </Link>
          </p>
          <Link href="/" className="hover:text-primary hover:underline mt-3">
            Back to Main Site
          </Link>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            (Admin creation link might be restricted in production)
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
