import Image from "next/image";
import type { AdConfig } from "@/types";
import { cn } from "@/lib/utils";
import { AreaChart, Megaphone } from "lucide-react"; // Added Megaphone
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

  // Determine final dimensions for the Image component
  const finalImageWidth = !isNaN(numericWidth as number) ? numericWidth : 300;
  const finalImageHeight = !isNaN(numericHeight as number)
    ? numericHeight
    : 250;

  // Determine style dimensions for the container div
  // If width/height are specific pixel values, use them. If percentage, use as is.
  // If undefined, let Tailwind/CSS handle it or use a sensible default.
  const styleWidth =
    typeof width === "string"
      ? width // Use string like '100%' or '728px' directly
      : finalImageWidth
        ? `${finalImageWidth}px`
        : "100%"; // Default to 100% if not specified

  const styleHeight =
    typeof height === "string"
      ? height // Use string like '100%' or '90px' directly
      : finalImageHeight
        ? `${finalImageHeight}px`
        : type === "image" || type === "tradingview-widget"
          ? "auto" // For images/widgets, height might be intrinsic or set
          : "90px"; // Default height for generic placeholders

  if (type === "image" && src) {
    return (
      <div
        className={cn(
          "bg-muted/30 dark:bg-muted/50 flex items-center justify-center overflow-hidden rounded-md shadow-sm mx-auto",
          className,
        )}
        style={{
          width: styleWidth,
          height: styleHeight,
          maxWidth: "100%",
        }}
      >
        <Image
          src={src}
          alt={altText || "Advertisement"}
          width={finalImageWidth as number}
          height={finalImageHeight as number}
          className="object-contain max-w-full max-h-full"
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
          maxWidth: "100%",
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
          "bg-card border border-border flex flex-col items-center justify-center text-xs sm:text-sm text-muted-foreground p-4 sm:p-6 rounded-lg shadow-md mx-auto", // Added sm:p-6
          className,
        )}
        style={{
          width: styleWidth,
          height: styleHeight, // Use calculated styleHeight
          maxWidth: "100%",
        }}
      >
        <AreaChart className="w-12 h-12 sm:w-16 sm:h-16 text-primary mb-2 sm:mb-3" />{" "}
        {/* Adjusted icon size and margin */}
        <p className="font-semibold text-foreground text-sm sm:text-base text-center">
          {" "}
          {/* Added text-center */}
          TradingView Market Chart
        </p>
        {tradingViewWidgetConfig.symbol && (
          <p className="text-xs mt-1">
            Symbol: {tradingViewWidgetConfig.symbol}
          </p>
        )}
        <p className="text-xs mt-2 text-center">
          {" "}
          {/* Added text-center */}
          (Live interactive chart will be embedded here)
        </p>
      </div>
    );
  }

  // Fallback placeholder for unspecified types or missing required fields
  return (
    <div
      className={cn(
        "bg-muted/40 dark:bg-muted/60 border border-dashed border-border flex flex-col items-center justify-center text-muted-foreground p-4 rounded-md shadow-sm mx-auto",
        className,
      )}
      style={{
        width: styleWidth, // Use 100% if not specified in config
        height: styleHeight, // Default to 90px if not specified
        maxWidth: "100%",
      }}
    >
      <Megaphone className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground/70 mb-2" />
      <p className="text-xs sm:text-sm font-medium text-center">
        Advertisement Space
      </p>
      <p className="text-xs text-center">Content will appear here.</p>
    </div>
  );
}
