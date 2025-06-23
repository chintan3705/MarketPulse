import React, { Suspense } from "react";
import LoginForm from "./LoginForm";
import { Loader2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin Login",
    description: "Access the admin dashboard for MarketPulse.",
    robots: {
        index: false,
        follow: false,
    }
};

function LoginPageLoadingFallback() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="mt-4 text-muted-foreground">Loading Login...</p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageLoadingFallback />}>
      <LoginForm />
    </Suspense>
  );
}
