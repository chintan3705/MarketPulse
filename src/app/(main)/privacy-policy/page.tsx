import type { Metadata } from "next";
import PrivacyPolicyClientContent from "@/components/legal/PrivacyPolicyClientContent"; 

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:9002";

export const metadata: Metadata = {
  title: "Privacy Policy | MarketPulse",
  description:
    "Read the MarketPulse Privacy Policy to understand how we collect, use, and protect your personal data when you use our financial news service.",
  alternates: {
    canonical: `${SITE_URL}/privacy-policy`,
  },
  openGraph: {
    title: "Privacy Policy | MarketPulse",
    description:
      "Understand how MarketPulse collects, uses, and protects your personal data.",
    url: `${SITE_URL}/privacy-policy`,
    type: "website",
    images: [
      {
        url: `${SITE_URL}/og-image.png`, 
        width: 1200,
        height: 630,
        alt: "MarketPulse Privacy Policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | MarketPulse",
    description:
      "Understand how MarketPulse collects, uses, and protects your personal data.",
    images: [`${SITE_URL}/twitter-image.png`],
  },
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClientContent />;
}
