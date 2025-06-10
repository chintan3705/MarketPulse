
import Image from "next/image";
import type { AdConfig } from "@/types";
import { cn } from "@/lib/utils";
import { AreaChart } from "lucide-react";
import React from "react";

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

  const finalWidth = !isNaN(numericWidth as number) ? numericWidth : 300;
  const finalHeight = !isNaN(numericHeight as number) ? numericHeight : 250;

  // Ensure width and height for style are strings with 'px' or '%'
  const styleWidth = typeof width === "string" ? width : (finalWidth ? `${finalWidth}px` : '100%');
  const styleHeight = typeof height === "string" ? height : (finalHeight ? `${finalHeight}px` : 'auto');

  if (type === "image" && src) {
    return (
      <div
        className={cn(
          "bg-muted/30 dark:bg-muted/50 flex items-center justify-center overflow-hidden rounded-md shadow-sm mx-auto", // Added mx-auto
          className,
        )}
        style={{
          width: styleWidth,
          height: styleHeight,
          maxWidth: '100%', // Ensure it does not overflow container
        }}
      >
        <Image
          src={src}
          alt={altText || "Advertisement"}
          width={finalWidth as number} // next/image width/height must be numbers if not fill
          height={finalHeight as number}
          className="object-contain max-w-full max-h-full" // Ensure image scales within its container
          data-ai-hint={imageAiHint || "advertisement"}
        />
      </div>
    );
  }

  if (type === "script") {
    return (
      <div
        className={cn(
          "bg-muted/30 dark:bg-muted/50 flex items-center justify-center text-xs sm:text-sm text-muted-foreground p-4 rounded-md shadow-sm mx-auto",
          className,
        )}
        style={{
          width: styleWidth,
          height: styleHeight,
          maxWidth: '100%',
        }}
      >
        Ad Slot (Script Based) - {config.id}
      </div>
    );
  }

  if (type === "tradingview-widget" && tradingViewWidgetConfig) {
    return (
      <div
        className={cn(
          "bg-card border border-border flex flex-col items-center justify-center text-xs sm:text-sm text-muted-foreground p-4 rounded-lg shadow-md mx-auto",
          className,
        )}
        style={{
          width: styleWidth,
          height: styleHeight,
          maxWidth: '100%',
        }}
      >
        <AreaChart className="w-12 h-12 sm:w-16 sm:w-16 text-primary mb-2" />
        <p className="font-semibold text-foreground text-sm sm:text-base">TradingView Chart</p>
        <p className="text-xs mt-1">
          Symbol: {tradingViewWidgetConfig.symbol || "N/A"}
        </p>
        <p className="text-xs mt-2">(Live chart will be embedded here)</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg-muted/30 dark:bg-muted/50 flex items-center justify-center text-xs sm:text-sm text-muted-foreground p-4 rounded-md shadow-sm mx-auto",
        className,
      )}
      style={{ width: "100%", height: styleHeight, maxHeight: '90px', maxWidth: '100%' }}
    >
      Advertisement Placeholder
    </div>
  );
}
