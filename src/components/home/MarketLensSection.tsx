'use client';

import React, { useEffect, useState } from 'react';
import type { TrendingHeadline } from '@/types';
import {
  getMarketLensDigest,
  type MarketLensDigestOutput,
  type MarketLensDigestInput,
} from '@/ai/flows/market-lens-digest-flow'; // MarketLensDigestInput made explicit
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { trendingHeadlines as mockHeadlinesData } from '@/lib/data'; // Renamed for clarity
import {
  TrendingUp,
  TrendingDown,
  MinusCircle,
  ExternalLink,
  // Loader2, // Unused import
  AlertTriangle,
  Eye,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const TrendIcon = ({
  sentiment,
  trendIcon,
}: {
  sentiment: string;
  trendIcon?: 'up' | 'down';
}) => {
  if (trendIcon === 'up' || sentiment === 'Bullish') {
    return <TrendingUp className="h-5 w-5 text-gain mr-2 flex-shrink-0" />;
  }
  if (trendIcon === 'down' || sentiment === 'Bearish') {
    return <TrendingDown className="h-5 w-5 text-loss mr-2 flex-shrink-0" />;
  }
  return (
    <MinusCircle className="h-5 w-5 text-muted-foreground mr-2 flex-shrink-0" />
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
        // Using top 3 mock headlines for the digest
        const headlinesToProcess: TrendingHeadline[] = // Use TrendingHeadline type for mock data
          mockHeadlinesData.slice(0, 3).map((h: TrendingHeadline) => ({ ...h }));

        // Adapt to MarketLensDigestInput["headlines"] which expects specific fields
        const marketLensInputHeadlines: MarketLensDigestInput['headlines'] =
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
          region: 'Global',
        });
        setDigest(result);
      } catch (err) {
        const catchedError = err as Error;
        console.error('Error fetching market lens digest:', catchedError);
        setError(catchedError.message || 'Failed to load market insights.');
      } finally {
        setIsLoading(false);
      }
    }
    void fetchDigest(); // Call async function
  }, []);

  return (
    <section className="py-8 md:py-12">
      <div className="container">
        <div className="flex items-center gap-2 mb-6">
          <Eye className="h-7 w-7 text-primary" />
          <h2 className="font-headline text-2xl sm:text-3xl font-bold">
            Today&apos;s Market Lens
          </h2>
        </div>

        {isLoading && (
          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl text-primary">
                  <Skeleton className="h-6 w-3/4" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <Card key={item} className="glass-card flex flex-col">
                  <CardHeader>
                    <div className="flex items-start mb-2">
                      <Skeleton className="h-5 w-5 mr-2 rounded-full" />{' '}
                      {/* TrendIcon skeleton */}
                      <div className="flex-grow space-y-1.5">
                        <Skeleton className="h-4 w-full" />{' '}
                        {/* Title skeleton line 1 */}
                        <Skeleton className="h-4 w-4/5" />{' '}
                        {/* Title skeleton line 2 */}
                      </div>
                      <Skeleton className="h-4 w-4 ml-2 flex-shrink-0" />{' '}
                      {/* ExternalLink skeleton */}
                    </div>
                    <div className="space-y-1 text-xs">
                      <Skeleton className="h-3 w-1/2" /> {/* Source skeleton */}
                      <Skeleton className="h-3 w-1/3" /> {/* Date skeleton */}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-2">
                    <Skeleton className="h-3 w-full" />{' '}
                    {/* Summary skeleton line 1 */}
                    <Skeleton className="h-3 w-full" />{' '}
                    {/* Summary skeleton line 2 */}
                    <Skeleton className="h-3 w-3/4" />{' '}
                    {/* Summary skeleton line 3 */}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {error && !isLoading && (
          <Card className="border-destructive bg-destructive/10">
            <CardContent className="p-6 flex items-center">
              <AlertTriangle className="h-8 w-8 text-destructive mr-4" />
              <div>
                <h3 className="font-semibold text-destructive-foreground">
                  Could not load Market Lens
                </h3>
                <p className="text-sm text-destructive-foreground/80">
                  {error}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {!isLoading && !error && digest && (
          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl text-primary">
                  Overall Market Sentiment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base sm:text-lg text-foreground">
                  {digest.overallMarketSentiment}
                </p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {digest.digestedHeadlines.map((item) => (
                <Card
                  key={item.originalId || item.title}
                  className="glass-card flex flex-col"
                >
                  <CardHeader>
                    <div className="flex items-start mb-2">
                      <TrendIcon
                        sentiment={item.sentiment}
                        trendIcon={item.trendIcon}
                      />
                      <CardTitle className="text-base sm:text-lg font-headline leading-tight flex-grow">
                        <Link
                          href={item.originalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary transition-colors"
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
                        <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors ml-2 flex-shrink-0" />
                      </Link>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Source: {item.source} -{' '}
                      <time dateTime={item.publishedAt}>
                        {new Date(item.publishedAt).toLocaleDateString()}
                      </time>
                    </p>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-foreground/90">
                      {item.aiSummary}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        {/* Placeholder for Watchlist Feature */}
        <div className="mt-12 p-6 rounded-lg border border-dashed border-border text-center">
          <h3 className="font-headline text-lg sm:text-xl font-semibold text-muted-foreground">
            My Watchlist
          </h3>
          <p className="text-sm text-muted-foreground mt-2">
            Select your favorite sectors or stocks to get a personalized feed.
            (Feature coming soon!)
          </p>
          <Button variant="outline" className="mt-4" disabled>
            Configure Watchlist
          </Button>
        </div>
      </div>
    </section>
  );
}
