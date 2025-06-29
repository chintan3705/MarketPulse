import type { Metadata, ResolvingMetadata } from "next";
import { Activity } from "lucide-react";
import type React from "react";
import { SectionTitle } from "@/components/common/SectionTitle";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:9002";

export async function generateMetadata(
  _props: unknown,
  _parent: ResolvingMetadata,
): Promise<Metadata> {
  const canonicalUrl = `${SITE_URL}/markets`;

  return {
    title: "Stock Market Overview & Trends",
    description:
      "Get a comprehensive overview of current stock market trends, data, and performance indicators. Insights into Nifty, Sensex, global markets, and commodities.",
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: "Stock Market Overview & Trends | MarketPulse",
      description:
        "Comprehensive overview of current stock market trends, data, and performance indicators.",
      url: canonicalUrl,
      type: "website",
      images: [
        {
          url: `${SITE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: "Stock Market Overview by MarketPulse",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Stock Market Overview & Trends | MarketPulse",
      description:
        "Comprehensive overview of current stock market trends, data, and performance indicators.",
      images: [`${SITE_URL}/twitter-image.png`],
    },
  };
}

const MarketsPage: React.FC = () => {
  return (
    <div className="container py-8 md:py-12">
      <SectionTitle
        title="Market Overview"
        icon={Activity}
        titleClassName="text-2xl sm:text-3xl"
      />
      <p className="text-lg text-muted-foreground mb-6">
        Get a comprehensive overview of current market trends, data, and
        performance indicators. This section will provide insights into various
        market segments.
      </p>
      {/* Placeholder for market charts, heatmaps, or data tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-card rounded-lg shadow-md">
          <h2 className="font-headline text-xl font-semibold mb-2">
            Indices Snapshot
          </h2>
          <p className="text-muted-foreground">
            Coming soon: Real-time data for Nifty, Sensex, and other key
            indices.
          </p>
        </div>
        <div className="p-6 bg-card rounded-lg shadow-md">
          <h2 className="font-headline text-xl font-semibold mb-2">
            Sector Performance
          </h2>
          <p className="text-muted-foreground">
            Coming soon: Visualizations of top gaining and losing sectors.
          </p>
        </div>
        <div className="p-6 bg-card rounded-lg shadow-md">
          <h2 className="font-headline text-xl font-semibold mb-2">
            Global Markets
          </h2>
          <p className="text-muted-foreground">
            Updates from major international stock exchanges.
          </p>
        </div>
        <div className="p-6 bg-card rounded-lg shadow-md">
          <h2 className="font-headline text-xl font-semibold mb-2">
            Commodities Watch
          </h2>
          <p className="text-muted-foreground">
            Tracking prices for gold, silver, oil, and more.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MarketsPage;
