import type { Metadata } from "next";
import TermsOfServiceClientContent from "@/components/legal/TermsOfServiceClientContent"; 

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:9002";

export const metadata: Metadata = {
  title: "Terms of Service | MarketPulse",
  description:
    "Read the MarketPulse Terms of Service. Understand the rules and guidelines for using our financial news and analysis platform.",
  alternates: {
    canonical: `${SITE_URL}/terms-of-service`,
  },
  openGraph: {
    title: "Terms of Service | MarketPulse",
    description:
      "Understand the rules and guidelines for using the MarketPulse platform.",
    url: `${SITE_URL}/terms-of-service`,
    type: "website",
    images: [
      {
        url: `${SITE_URL}/og-image.png`, 
        width: 1200,
        height: 630,
        alt: "MarketPulse Terms of Service",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service | MarketPulse",
    description:
      "Understand the rules and guidelines for using the MarketPulse platform.",
    images: [`${SITE_URL}/twitter-image.png`],
  },
};

export default function TermsOfServicePage() {
  return <TermsOfServiceClientContent />;
}
