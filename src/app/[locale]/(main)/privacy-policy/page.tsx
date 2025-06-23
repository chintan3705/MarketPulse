
import type { Metadata, ResolvingMetadata } from "next";
import PrivacyPolicyClientContent from "./_components/PrivacyPolicyClientContent";
import { isValidLocale, defaultLocale, locales } from "@/i18n-config";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:9002";

interface PageProps {
  params: { locale: string };
}

export async function generateMetadata(
  { params: { locale: localeString } }: PageProps,
  _parent: ResolvingMetadata,
): Promise<Metadata> {
  const locale = isValidLocale(localeString) ? localeString : defaultLocale;
  const canonicalUrl = `${SITE_URL}${locale === defaultLocale ? "" : "/" + locale}/privacy-policy`;

  const alternatesLang: { [key: string]: string } = {};
  locales.forEach((altLocale) => {
    alternatesLang[altLocale] = `${SITE_URL}${altLocale === defaultLocale ? "" : "/" + altLocale}/privacy-policy`;
  });

  return {
    title: "Privacy Policy | MarketPulse",
    description:
      "Read the privacy policy for MarketPulse. Understand how we collect, use, and protect your data when you use our financial news service.",
    alternates: {
      canonical: canonicalUrl,
      languages: alternatesLang,
    },
    openGraph: {
      title: "Privacy Policy | MarketPulse",
      description:
        "Understand how MarketPulse collects, uses, and protects your data.",
      url: canonicalUrl,
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
        "Understand how MarketPulse collects, uses, and protects your data.",
      images: [`${SITE_URL}/twitter-image.png`],
    },
  };
}

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClientContent />;
}
