import type { Metadata, ResolvingMetadata } from "next";
import TermsOfServiceClientContent from "./_components/TermsOfServiceClientContent";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:9002";

export async function generateMetadata(
  _props: unknown,
  _parent: ResolvingMetadata,
): Promise<Metadata> {
  const canonicalUrl = `${SITE_URL}/terms-of-service`;

  return {
    title: "Terms of Service | MarketPulse",
    description:
      "Read the terms of service for MarketPulse. Your use of our website is subject to these terms and conditions.",
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: "Terms of Service | MarketPulse",
      description:
        "Your use of our website is subject to these terms and conditions.",
      url: canonicalUrl,
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
        "Your use of our website is subject to these terms and conditions.",
      images: [`${SITE_URL}/twitter-image.png`],
    },
  };
}

export default function TermsOfServicePage() {
  return <TermsOfServiceClientContent />;
}
