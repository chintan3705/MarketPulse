
import Image from "next/image";
import type { AdConfig } from "@/types";
import { cn } from "@/lib/utils";
import { AreaChart } from "lucide-react";
import React from "react"; // Import React for useEffect

interface AdSlotProps {
  config: AdConfig;
}

export function AdSlot({ config }: AdSlotProps) {
  const {
    type,
    src,
    altText,
    width,
    height,
    className,
    tradingViewWidgetConfig,
    imageAiHint,
  } = config;

  const numericWidth = typeof width === "string" ? parseInt(width, 10) : width;
  const numericHeight =
    typeof height === "string" ? parseInt(height, 10) : height;

  // Fallback dimensions if parsing fails or not provided
  const finalWidth = !isNaN(numericWidth as number) ? numericWidth : 300;
  const finalHeight = !isNaN(numericHeight as number) ? numericHeight : 250;

  if (type === "image" && src) {
    return (
      <div
        className={cn(
          "bg-muted/50 flex items-center justify-center overflow-hidden rounded-md shadow",
          className,
        )}
        style={{
          width: typeof width === "string" ? width : `${width}px`,
          height: typeof height === "string" ? height : `${height}px`,
        }}
      >
        <Image
          src={src}
          alt={altText || "Advertisement"}
          width={finalWidth as number}
          height={finalHeight as number}
          className="object-contain"
          data-ai-hint={imageAiHint || "advertisement"}
        />
      </div>
    );
  }

  if (type === "script") {
    // Script based ads usually require direct DOM manipulation or a library.
    // This placeholder simulates where the ad would load.
    return (
      <div
        className={cn(
          "bg-muted/50 flex items-center justify-center text-sm text-muted-foreground p-4 rounded-md shadow",
          className,
        )}
        style={{
          width: typeof width === "string" ? width : `${width}px`,
          height: typeof height === "string" ? height : `${height}px`,
        }}
      >
        Ad Slot (Script Based) - {config.id}
      </div>
    );
  }

  if (type === "tradingview-widget" && tradingViewWidgetConfig) {
    // For actual TradingView widget, you'd use their embedding script.
    // This is a styled placeholder.
    return (
      <div
        className={cn(
          "bg-card border border-border flex flex-col items-center justify-center text-sm text-muted-foreground p-4 rounded-lg shadow-lg",
          className,
        )}
        style={{
          width: typeof width === "string" ? width : `${width}px`,
          height: typeof height === "string" ? height : `${height}px`,
        }}
      >
        <AreaChart className="w-16 h-16 text-primary mb-2" />
        <p className="font-semibold text-foreground">TradingView Chart</p>
        <p className="text-xs">
          Symbol: {tradingViewWidgetConfig.symbol || "N/A"}
        </p>
        <p className="text-xs mt-2">(Live chart will be embedded here)</p>
      </div>
    );
  }

  // Default fallback placeholder
  return (
    <div
      className={cn(
        "bg-muted/50 flex items-center justify-center text-sm text-muted-foreground p-4 rounded-md shadow",
        className,
      )}
      style={{ width: "100%", height: 90 }}
    >
      Advertisement Placeholder
    </div>
  );
}
