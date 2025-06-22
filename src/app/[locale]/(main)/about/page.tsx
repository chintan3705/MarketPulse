import type { Metadata, ResolvingMetadata } from "next";
import { Info } from "lucide-react";
import type React from "react";
import { SectionTitle } from "@/components/common/SectionTitle";
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
  const canonicalUrl = `${SITE_URL}${locale === defaultLocale ? "" : "/" + locale}/about`;

  const alternatesLang: { [key: string]: string } = {};
  locales.forEach((altLocale) => {
    alternatesLang[altLocale] = `${SITE_URL}${altLocale === defaultLocale ? "" : "/" + altLocale}/about`;
  });

  return {
    title: "About MarketPulse",
    description:
      "Learn more about MarketPulse, our mission, and our dedication to providing timely financial insights and stock analysis to empower investors.",
    alternates: {
      canonical: canonicalUrl,
      languages: alternatesLang,
    },
    openGraph: {
      title: "About MarketPulse",
      description:
        "Learn more about MarketPulse, our mission, and our dedication to providing timely financial insights.",
      url: canonicalUrl,
      type: "website",
      images: [
        {
          url: `${SITE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: "MarketPulse - About Us",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "About MarketPulse",
      description:
        "Learn more about MarketPulse, our mission, and our dedication to providing timely financial insights.",
      images: [`${SITE_URL}/twitter-image.png`],
    },
  };
}

const AboutPage: React.FC = () => {
  return (
    <div
      className="container py-8 md:py-12"
    >
      <SectionTitle
        title="About MarketPulse"
        icon={Info}
        titleClassName="text-2xl sm:text-3xl"
      />
      <div className="prose prose-lg dark:prose-invert max-w-none space-y-4">
        <p>
          Welcome to MarketPulse, your daily lens on the share market. We are
          dedicated to providing timely updates, financial insights, and
          comprehensive stock analysis to help you navigate the complexities of
          the financial world.
        </p>
        <p>
          Our mission is to empower investors of all levels with accurate
          information and expert perspectives, enabling them to make informed
          decisions. Whether you&apos;re interested in the latest stock
          movements, IPO news, mutual fund performance, or broader economic
          trends, MarketPulse aims to be your go-to resource.
        </p>
        <p>
          Our team consists of experienced financial journalists, analysts, and
          market enthusiasts who are passionate about delivering high-quality
          content. We believe in clarity, accuracy, and relevance.
        </p>
        <p>Thank you for choosing MarketPulse. Stay informed, invest wisely.</p>
      </div>
    </div>
  );
};

export default AboutPage;
