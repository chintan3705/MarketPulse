"use client";

import React, { useEffect, useRef, memo, useState } from "react";
import type { TradingViewWidgetConfig } from "@/types";

const TradingViewWidget: React.FC<{
  widgetConfig: TradingViewWidgetConfig;
}> = ({ widgetConfig }) => {
  const container = useRef<HTMLDivElement>(null);
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light");

  // Effect to set the initial theme and listen for changes on the <html> element
  useEffect(() => {
    const getTheme = () => {
      return document.documentElement.classList.contains("dark")
        ? "dark"
        : "light";
    };

    setCurrentTheme(getTheme());

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          setCurrentTheme(getTheme());
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
    });

    return () => observer.disconnect();
  }, []);

  // Effect to create/update the widget when config or theme changes
  useEffect(() => {
    if (!container.current) return;

    // Clear previous widget to prevent duplicates during HMR or prop changes
    while (container.current.firstChild) {
      container.current.removeChild(container.current.firstChild);
    }

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;

    const widgetOptions = {
      autosize: true,
      symbol: widgetConfig.symbol || "NASDAQ:AAPL",
      interval: widgetConfig.interval || "D",
      timezone: "Etc/UTC",
      theme: currentTheme, // Use the reactive theme state
      style: "1",
      locale: "en",
      enable_publishing: false,
      allow_symbol_change: true,
      support_host: "https://www.tradingview.com",
    };

    script.innerHTML = JSON.stringify(widgetOptions);

    container.current.appendChild(script);
  }, [widgetConfig, currentTheme]); // Re-run effect if widgetConfig or theme changes

  return (
    <div className="tradingview-widget-container h-full w-full">
      <div ref={container} className="h-full w-full" />
    </div>
  );
};

export default memo(TradingViewWidget);
