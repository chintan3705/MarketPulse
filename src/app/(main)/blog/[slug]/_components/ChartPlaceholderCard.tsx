import { BarChartHorizontalBig } from "lucide-react";
import type { BlogPost } from "@/types";

interface ChartPlaceholderCardProps {
  chartType: BlogPost["chartType"];
  chartDescription: string;
  detailedInformation: BlogPost["detailedInformation"];
  chartDataJson: BlogPost["chartDataJson"];
}

export function ChartPlaceholderCard({
  chartType,
  chartDescription,
  detailedInformation,
  chartDataJson,
}: ChartPlaceholderCardProps) {
  // This component is a Server Component by default as it doesn't use client hooks
  return (
    <div className="my-6 p-4 border border-dashed border-border rounded-md bg-muted/50 dark:bg-muted/30">
      <div className="flex items-center text-muted-foreground mb-2">
        <BarChartHorizontalBig size={18} className="mr-2" />
        <h4 className="font-semibold text-base">Chart Information</h4>
      </div>
      <p className="text-sm">
        A {chartType || "chart"} visualizing "{chartDescription}" would be
        displayed here.
      </p>
      {detailedInformation && (
        <p className="text-xs mt-1 text-muted-foreground/80">
          Context: {detailedInformation.substring(0, 150)}...
        </p>
      )}
      <div className="mt-2 text-xs text-muted-foreground/70">
        <p>
          <em>(Developer Note: Implement chart rendering using:</em>
        </p>
        <ul className="list-disc list-inside ml-4">
          <li>
            <em>Type: {chartType || "Not specified"}</em>
          </li>
          <li>
            <em>Data: {chartDataJson ? "Available" : "Not provided"}</em>
          </li>
        </ul>
        <em>)</em>
      </div>
    </div>
  );
}
