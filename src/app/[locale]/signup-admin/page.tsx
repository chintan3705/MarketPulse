
import React, { Suspense } from "react";
import SignupAdminForm from "./SignupAdminForm";
import { Loader2 } from "lucide-react";
import { locales } from "@/i18n-config";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
    title: "Create Admin Account",
    description: "Create an initial admin account for MarketPulse.",
    robots: {
        index: false,
        follow: false,
    }
};

function SignupPageLoadingFallback() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="mt-4 text-muted-foreground">Loading Signup Form...</p>
    </div>
  );
}

export default function SignupAdminPage() {
  return (
    <Suspense fallback={<SignupPageLoadingFallback />}>
      <SignupAdminForm />
    </Suspense>
  );
}
