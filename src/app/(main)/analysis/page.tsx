import type { Metadata } from "next";
import { BarChart3 } from "lucide-react";
import type React from "react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:9002";

export const metadata: Metadata = {
  title: "Market Analysis & Financial Insights",
  description:
    "In-depth market analysis, expert opinions, and detailed financial reports from MarketPulse. Guide your investment decisions with our comprehensive insights.",
  alternates: {
    canonical: `${SITE_URL}/analysis`,
  },
  openGraph: {
    title: "Market Analysis & Financial Insights | MarketPulse",
    description:
      "In-depth market analysis, expert opinions, and detailed financial reports from MarketPulse.",
    url: `${SITE_URL}/analysis`,
    type: "website",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Market Analysis by MarketPulse",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Market Analysis & Financial Insights | MarketPulse",
    description:
      "In-depth market analysis, expert opinions, and detailed financial reports from MarketPulse.",
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

export default function AnalysisPage() {
  return (
    <div
      className="container py-8 md:py-12 animate-slide-in"
      style={{ animationDelay: "0.1s", animationFillMode: "backwards" }}
    >
      <SectionTitle title="Market Analysis" icon={BarChart3} />
      <p className="text-lg text-muted-foreground">
        In-depth market analysis, expert opinions, and detailed reports will be
        featured here. Stay tuned for comprehensive insights to guide your
        investment decisions.
      </p>
      {/* Placeholder for future content, e.g., analysis articles or charts */}
      <div className="mt-8 space-y-4">
        <div className="p-6 bg-card rounded-lg shadow-md">
          <h2 className="font-headline text-xl font-semibold mb-2">
            Sector Deep Dives
          </h2>
          <p className="text-muted-foreground">
            Coming soon: Detailed analysis of key market sectors.
          </p>
        </div>
        <div className="p-6 bg-card rounded-lg shadow-md">
          <h2 className="font-headline text-xl font-semibold mb-2">
            Economic Outlook
          </h2>
          <p className="text-muted-foreground">
            Expert forecasts and commentary on economic trends.
          </p>
        </div>
      </div>
    </div>
  );
}
