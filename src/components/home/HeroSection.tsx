'use client';

import React, { useEffect } from 'react'; // Removed useState as it's handled by SWR
// import type { ElementType } from 'react'; // Not used
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  TrendingUp,
  TrendingDown,
  Newspaper,
  Loader2,
  AlertTriangle,
  Landmark,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface YahooFinanceMarketSummary {
  symbol: string;
  shortName?: string;
  regularMarketPrice: { raw: number; fmt: string };
  regularMarketChange: { raw: number; fmt: string };
  regularMarketChangePercent: { raw: number; fmt: string };
}

interface YahooFinanceApiResponse {
  marketSummaryAndSparkResponse: {
    result: YahooFinanceMarketSummary[] | null;
    error: { code: string; description: string } | null;
  };
}

interface MarketTickerData {
  id: string;
  name: string;
  value: string;
  change: string;
  changePercent: string;
  isPositive: boolean;
}

const TARGET_SYMBOLS = {
  NIFTY_50: '^NSEI',
  SENSEX: '^BSESN',
  BANKNIFTY: '^NSEBANK',
};

const API_URL = 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-summary?region=IN';
const RAPIDAPI_HOST = 'apidojo-yahoo-finance-v1.p.rapidapi.com';

const API_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY;

const fetcher = async (url: string): Promise<YahooFinanceApiResponse> => {
  if (!API_KEY) {
    console.error(
      'RapidAPI key is missing. Please set NEXT_PUBLIC_RAPIDAPI_KEY in your .env.local file.'
    );
    throw new Error('RapidAPI key is missing.');
  }
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'x-rapidapi-key': API_KEY,
      'x-rapidapi-host': RAPIDAPI_HOST,
    },
  });

  if (!res.ok) {
    const errorData = (await res.json().catch(() => ({ message: res.statusText }))) as {
      message: string;
    };
    throw new Error(`Failed to fetch data: ${res.status} ${errorData.message || res.statusText}`);
  }
  return res.json() as Promise<YahooFinanceApiResponse>;
};

const transformApiData = (apiData: YahooFinanceApiResponse): MarketTickerData[] => {
  if (!apiData?.marketSummaryAndSparkResponse?.result) {
    return [];
  }

  const results = apiData.marketSummaryAndSparkResponse.result;
  const transformed: MarketTickerData[] = [];

  const symbolMap: { [key: string]: string } = {
    [TARGET_SYMBOLS.NIFTY_50]: 'NIFTY 50',
    [TARGET_SYMBOLS.SENSEX]: 'SENSEX',
    [TARGET_SYMBOLS.BANKNIFTY]: 'BANKNIFTY',
  };

  for (const item of results) {
    if (item.symbol && symbolMap[item.symbol]) {
      const marketPrice = item.regularMarketPrice;
      const marketChange = item.regularMarketChange;
      const marketChangePercent = item.regularMarketChangePercent;

      if (marketPrice && marketChange && marketChangePercent) {
        transformed.push({
          id: item.symbol,
          name: item.shortName || symbolMap[item.symbol] || item.symbol,
          value: marketPrice.fmt || 'N/A',
          change: marketChange.fmt || 'N/A',
          changePercent: marketChangePercent.fmt || 'N/A',
          isPositive: marketChange.raw >= 0,
        });
      }
    }
  }
  return transformed;
};

const MarketTickerItem = ({ name, value, change, changePercent, isPositive }: MarketTickerData) => (
  <div className='text-center md:text-left p-3 bg-card/50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex-1 min-w-[150px] md:min-w-[180px]'>
    <div className='flex items-center justify-center md:justify-start mb-1'>
      <Landmark size={16} className='mr-2 text-primary flex-shrink-0 hidden md:inline' />
      <p className='text-sm text-muted-foreground truncate' title={name}>
        {name}
      </p>
    </div>
    <p className='text-xl md:text-2xl font-bold text-foreground'>{value}</p>
    <div
      className={cn(
        'flex items-center justify-center md:justify-start text-sm',
        isPositive ? 'text-gain' : 'text-loss'
      )}
    >
      {isPositive ? (
        <TrendingUp size={16} className='mr-1 flex-shrink-0' />
      ) : (
        <TrendingDown size={16} className='mr-1 flex-shrink-0' />
      )}
      <span className='truncate'>
        {change} ({changePercent})
      </span>
    </div>
  </div>
);

export function HeroSection() {
  const {
    data: apiData,
    error,
    isLoading,
  } = useSWR<YahooFinanceApiResponse, Error>(API_URL, fetcher, {
    refreshInterval: 30000, // 30 seconds
    dedupingInterval: 25000, // Avoid duplicate requests close together
    revalidateOnFocus: true,
  });

  const marketData = apiData ? transformApiData(apiData) : [];
  const initialLoad = isLoading && !apiData && !error;

  useEffect(() => {
    if (error) {
      console.error('SWR Fetch Error in HeroSection:', error.message);
    }
    if (
      apiData &&
      apiData.marketSummaryAndSparkResponse &&
      apiData.marketSummaryAndSparkResponse.error
    ) {
      console.error('Yahoo Finance API Error:', apiData.marketSummaryAndSparkResponse.error);
    }
  }, [apiData, error]);

  return (
    <section className='py-12 md:py-16 bg-gradient-to-br from-background to-muted/30'>
      <div className='container text-center'>
        <h1
          className='font-headline text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-4 animate-slide-in'
          style={{ animationDelay: '0.2s' }}
        >
          MarketPulse
        </h1>
        <p
          className='text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 animate-slide-in'
          style={{ animationDelay: '0.3s' }}
        >
          Your Daily Lens on the Share Market. Timely updates, financial insights, and stock
          analysis to empower your investment decisions.
        </p>

        <div
          className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 max-w-4xl mx-auto mb-10 animate-slide-in'
          style={{ animationDelay: '0.4s', minHeight: '100px' }}
        >
          {initialLoad && API_KEY ? ( // Only show loader if API_KEY is present
            <div className='col-span-full flex flex-col justify-center items-center min-h-[100px]'>
              <Loader2 className='h-10 w-10 text-primary animate-spin' />
              <span className='mt-2 text-muted-foreground'>Loading market data...</span>
            </div>
          ) : error ||
            (apiData &&
              apiData.marketSummaryAndSparkResponse &&
              apiData.marketSummaryAndSparkResponse.error) ? (
            <div className='col-span-full flex flex-col justify-center items-center min-h-[100px] p-4 bg-destructive/10 border border-destructive rounded-md'>
              <AlertTriangle className='h-8 w-8 text-destructive mb-2' />
              <p className='text-sm text-destructive-foreground font-semibold'>
                Failed to load market data
              </p>
              <p className='text-xs text-destructive-foreground/80'>
                {error?.message ||
                  apiData?.marketSummaryAndSparkResponse?.error?.description ||
                  'An unknown error occurred.'}
                {!API_KEY && ' NEXT_PUBLIC_RAPIDAPI_KEY is not set.'}
              </p>
            </div>
          ) : marketData.length > 0 ? (
            marketData.map((item) => <MarketTickerItem key={item.id} {...item} />)
          ) : (
            <div className='col-span-full flex flex-col justify-center items-center min-h-[100px]'>
              <AlertTriangle className='h-8 w-8 text-muted-foreground mb-2' />
              <p className='text-sm text-muted-foreground'>Market data currently unavailable.</p>
              {!API_KEY && (
                <p className='text-xs text-muted-foreground/80 mt-1'>
                  API key (NEXT_PUBLIC_RAPIDAPI_KEY) is not configured. Market data cannot be
                  fetched.
                </p>
              )}
            </div>
          )}
        </div>

        <div className='animate-slide-in' style={{ animationDelay: '0.5s' }}>
          <Button size='lg' asChild className='shadow-lg hover:shadow-primary/30 transition-shadow'>
            <Link href='/news'>
              <Newspaper className='mr-2 h-5 w-5' />
              Explore Latest News
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
