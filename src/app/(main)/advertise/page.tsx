import type { Metadata } from "next";
import { Megaphone } from "lucide-react";
import type React from "react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:9002";

export const metadata: Metadata = {
  title: "Advertise With MarketPulse",
  description:
    "Reach a highly engaged audience of investors and financial enthusiasts by advertising with MarketPulse. Explore our advertising solutions.",
  alternates: {
    canonical: `${SITE_URL}/advertise`,
  },
  openGraph: {
    title: "Advertise With MarketPulse",
    description:
      "Reach a highly engaged audience of investors and financial enthusiasts by advertising with MarketPulse.",
    url: `${SITE_URL}/advertise`,
    type: "website",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Advertise With MarketPulse",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Advertise With MarketPulse",
    description:
      "Reach a highly engaged audience of investors and financial enthusiasts by advertising with MarketPulse.",
    images: [`${SITE_URL}/twitter-image.png`],
  },
};

interface SectionTitleProps {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title, icon: Icon }) => (
  <div className="flex items-center gap-2 mb-6">
    {Icon && <Icon className="h-7 w-7 text-primary" />}
    <h1 className="font-headline text-2xl sm:text-3xl font-bold">{title}</h1>
  </div>
);

export default function AdvertisePage() {
  const linkClasses =
    "text-primary hover:text-primary/80 hover:underline transition-colors duration-200 ease-in-out";
  return (
    <div
      className="container py-8 md:py-12 animate-slide-in"
      style={{ animationDelay: "0.1s", animationFillMode: "backwards" }}
    >
      <SectionTitle title="Advertise With Us" icon={Megaphone} />
      <div className="prose prose-lg dark:prose-invert max-w-none space-y-4">
        <p>
          Reach a highly engaged audience of investors, financial enthusiasts,
          and market professionals by advertising with MarketPulse.
        </p>
        <p>
          We offer a variety of advertising solutions to help you connect with
          our readers, including:
        </p>
        <ul className="list-disc list-inside">
          <li>Banner Ads (various sizes and placements)</li>
          <li>Sponsored Content &amp; Articles</li>
          <li>Newsletter Sponsorships</li>
          <li>Custom Campaigns</li>
        </ul>
        <p>
          Our platform provides an excellent opportunity to showcase your brand,
          products, or services to individuals actively seeking financial
          information and investment opportunities.
        </p>
        <p>
          For more information on our advertising packages and to discuss your
          specific needs, please contact our advertising team at:{" "}
          <a href="mailto:ads@marketpulse.example.com" className={linkClasses}>
            ads@marketpulse.example.com
          </a>
          .
        </p>
        <p>We look forward to partnering with you!</p>
      </div>
    </div>
  );
}
