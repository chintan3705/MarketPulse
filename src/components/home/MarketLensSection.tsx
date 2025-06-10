"use client";

import React, { useEffect, useState } from "react";
import type { TrendingHeadline } from "@/types";
import {
  getMarketLensDigest,
  type MarketLensDigestOutput,
  type MarketLensDigestInput,
} from "@/ai/flows/market-lens-digest-flow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trendingHeadlines as mockHeadlinesData } from "@/lib/data";
import {
  TrendingUp,
  TrendingDown,
  MinusCircle,
  ExternalLink,
  AlertTriangle,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const TrendIcon = ({
  sentiment,
  trendIcon,
}: {
  sentiment: string;
  trendIcon?: "up" | "down";
}) => {
  const iconSize = "h-4 w-4 sm:h-5 sm:w-5";
  if (trendIcon === "up" || sentiment === "Bullish") {
    return (
      <TrendingUp
        className={`${iconSize} text-gain mr-1.5 sm:mr-2 flex-shrink-0`}
      />
    );
  }
  if (trendIcon === "down" || sentiment === "Bearish") {
    return (
      <TrendingDown
        className={`${iconSize} text-loss mr-1.5 sm:mr-2 flex-shrink-0`}
      />
    );
  }
  return (
    <MinusCircle
      className={`${iconSize} text-muted-foreground mr-1.5 sm:mr-2 flex-shrink-0`}
    />
  );
};

export function MarketLensSection() {
  const [digest, setDigest] = useState<MarketLensDigestOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDigest() {
      setIsLoading(true);
      setError(null);
      try {
        const headlinesToProcess: TrendingHeadline[] = mockHeadlinesData
          .slice(0, 3)
          .map((h: TrendingHeadline) => ({ ...h }));

        const marketLensInputHeadlines: MarketLensDigestInput["headlines"] =
          headlinesToProcess.map((h) => ({
            id: h.id,
            title: h.title,
            source: h.source,
            url: h.url,
            publishedAt: h.publishedAt,
            isGain: h.isGain,
          }));

        const result = await getMarketLensDigest({
          headlines: marketLensInputHeadlines,
          region: "Global",
        });
        setDigest(result);
      } catch (err) {
        const catchedError = err as Error;
        console.error("Error fetching market lens digest:", catchedError);
        setError(catchedError.message || "Failed to load market insights.");
      } finally {
        setIsLoading(false);
      }
    }
    void fetchDigest();
  }, []);

  return (
    <section className="py-6 md:py-10">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-4 md:mb-6">
          <Eye className="h-6 w-6 md:h-7 md:w-7 text-primary" />
          <h2 className="font-headline text-xl sm:text-2xl md:text-3xl font-bold">
            Today&apos;s Market Lens
          </h2>
        </div>

        {isLoading && (
          <div className="space-y-4 md:space-y-6">
            <Card className="glass-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-md sm:text-lg text-primary">
                  <Skeleton className="h-5 w-3/4" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {[1, 2, 3].map((item) => (
                <Card
                  key={item}
                  className="glass-card flex flex-col p-3 sm:p-4"
                >
                  <CardHeader className="p-0 mb-1.5 sm:mb-2">
                    <div className="flex items-start mb-1 sm:mb-1.5">
                      <Skeleton className="h-5 w-5 mr-2 rounded-full" />
                      <div className="flex-grow space-y-1">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-4/5" />
                      </div>
                      <Skeleton className="h-3 w-3 sm:h-4 sm:w-4 ml-2 flex-shrink-0" />
                    </div>
                    <div className="space-y-1 text-xs">
                      <Skeleton className="h-3 w-1/2" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 flex-grow space-y-1.5 text-xs sm:text-sm">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {error && !isLoading && (
          <Card className="border-destructive bg-destructive/10">
            <CardContent className="p-4 sm:p-6 flex items-center">
              <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-destructive mr-3 sm:mr-4" />
              <div>
                <h3 className="font-semibold text-sm sm:text-base text-destructive-foreground">
                  Could not load Market Lens
                </h3>
                <p className="text-xs sm:text-sm text-destructive-foreground/80">
                  {error}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {!isLoading && !error && digest && (
          <div className="space-y-4 md:space-y-6">
            <Card className="glass-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-md sm:text-lg text-primary">
                  Overall Market Sentiment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm sm:text-base text-foreground">
                  {digest.overallMarketSentiment}
                </p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {digest.digestedHeadlines.map((item) => (
                <Card
                  key={item.originalId || item.title}
                  className="glass-card flex flex-col p-3 sm:p-4"
                >
                  <CardHeader className="p-0 mb-1.5 sm:mb-2">
                    <div className="flex items-start mb-1 sm:mb-1.5">
                      <TrendIcon
                        sentiment={item.sentiment}
                        trendIcon={item.trendIcon}
                      />
                      <CardTitle className="text-sm sm:text-base font-headline leading-snug flex-grow">
                        <Link
                          href={item.originalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary transition-colors line-clamp-3"
                        >
                          {item.title}
                        </Link>
                      </CardTitle>
                      <Link
                        href={item.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Read full article"
                      >
                        <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground hover:text-primary transition-colors ml-2 flex-shrink-0" />
                      </Link>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {item.source} -{" "}
                      <time dateTime={item.publishedAt}>
                        {new Date(item.publishedAt).toLocaleDateString()}
                      </time>
                    </p>
                  </CardHeader>
                  <CardContent className="p-0 flex-grow">
                    <p className="text-xs sm:text-sm text-foreground/90 line-clamp-3">
                      {item.aiSummary}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        <div className="mt-8 md:mt-12 p-4 sm:p-6 rounded-lg border border-dashed border-border text-center">
          <h3 className="font-headline text-md sm:text-lg font-semibold text-muted-foreground">
            My Watchlist
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground mt-2">
            Select your favorite sectors or stocks to get a personalized feed.
            (Feature coming soon!)
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3 sm:mt-4 text-xs sm:text-sm"
            disabled
          >
            Configure Watchlist
          </Button>
        </div>
      </div>
    </section>
  );
}
