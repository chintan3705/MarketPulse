import type { Metadata } from "next";
import { BarChart3 } from "lucide-react";

export const metadata: Metadata = {
  title: "Market Analysis & Financial Insights",
  description:
    "In-depth market analysis, expert opinions, and detailed financial reports from MarketPulse. Guide your investment decisions with our comprehensive insights.",
  alternates: {
    canonical: "/analysis",
  },
  openGraph: {
    title: "Market Analysis & Financial Insights | MarketPulse",
    description:
      "In-depth market analysis, expert opinions, and detailed financial reports from MarketPulse.",
    url: "/analysis",
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
