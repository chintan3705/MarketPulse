import type { Metadata } from "next";
import { Activity } from "lucide-react";

export const metadata: Metadata = {
  title: "Stock Market Overview & Trends",
  description:
    "Get a comprehensive overview of current stock market trends, data, and performance indicators. Insights into Nifty, Sensex, global markets, and commodities.",
  alternates: {
    canonical: "/markets",
  },
  openGraph: {
    title: "Stock Market Overview & Trends | MarketPulse",
    description:
      "Comprehensive overview of current stock market trends, data, and performance indicators.",
    url: "/markets",
  },
};

const SectionTitle = ({
  title,
  icon: Icon,
}: {
  title: string;
  icon?: React.ElementType;
}) => (
  <div className="flex items-center gap-2 mb-6">
    {Icon && <Icon className="h-7 w-7 text-primary" />}
    <h1 className="font-headline text-2xl sm:text-3xl font-bold">{title}</h1>
  </div>
);

export default function MarketsPage() {
  return (
    <div
      className="container py-8 md:py-12 animate-slide-in"
      style={{ animationDelay: "0.1s", animationFillMode: "backwards" }}
    >
      <SectionTitle title="Market Overview" icon={Activity} />
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
}
