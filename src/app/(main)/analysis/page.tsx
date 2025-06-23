import type { Metadata, ResolvingMetadata } from "next";
import { BarChart3 } from "lucide-react";
import type React from "react";
import { SectionTitle } from "@/components/common/SectionTitle";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:9002";

export async function generateMetadata(
  _props: unknown,
  _parent: ResolvingMetadata,
): Promise<Metadata> {
  const canonicalUrl = `${SITE_URL}/analysis`;

  return {
    title: "Market Analysis & Financial Insights",
    description:
      "In-depth market analysis, expert opinions, and detailed financial reports from MarketPulse. Guide your investment decisions with our comprehensive insights.",
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: "Market Analysis & Financial Insights | MarketPulse",
      description:
        "In-depth market analysis, expert opinions, and detailed financial reports from MarketPulse.",
      url: canonicalUrl,
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
}

const AnalysisPage: React.FC = () => {
  return (
    <div
      className="container py-8 md:py-12"
    >
      <SectionTitle
        title="Market Analysis"
        icon={BarChart3}
        titleClassName="text-2xl sm:text-3xl"
      />
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
};

export default AnalysisPage;
