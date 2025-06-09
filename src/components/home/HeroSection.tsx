
'use client';

import { useState, useEffect } from 'react';
import type { ElementType } from 'react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TrendingUp, TrendingDown, Newspaper, Globe, Landmark, Loader2, AlertTriangle } from "lucide-react";
import { cn } from '@/lib/utils';

interface MarketTickerData {
  id: string;
  name: string;
  value: string;
  change: string;
  changePercent: string;
  isPositive: boolean;
  region?: string;
  icon?: ElementType;
}

// Initial static data / fallback data
const initialStaticData: MarketTickerData[] = [
  { id: "NIFTY50", name: "NIFTY 50", value: "23,450.75", change: "+120.25", changePercent: "+0.51%", isPositive: true, region: "India", icon: Landmark },
  { id: "SENSEX", name: "SENSEX", value: "78,050.90", change: "-50.10", changePercent: "-0.06%", isPositive: false, region: "India", icon: Landmark },
  { id: "NASDAQ", name: "NASDAQ", value: "17,688.88", change: "+21.32", changePercent: "+0.12%", isPositive: true, region: "US", icon: Globe },
  { id: "FTSE100", name: "FTSE 100", value: "8,237.72", change: "-10.50", changePercent: "-0.13%", isPositive: false, region: "UK", icon: Globe },
];

// This is a MOCK function. Replace with your actual API call.
// It demonstrates how you might transform data from a hypothetical API.
const transformApiData = (apiResponse: any[]): MarketTickerData[] => {
  // Example: Assuming apiResponse is an array of objects like { symbol: 'NIFTY50', price: 23500, change: 50 ... }
  // This is highly dependent on the actual API structure.
  // For this example, we'll just return a slightly modified version of initialStaticData
  // to show the update mechanism.
  return initialStaticData.map(item => ({
    ...item,
    value: (parseFloat(item.value.replace(/,/g, '')) + (Math.random() * 100 - 50)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    change: (Math.random() * 50 - 25).toFixed(2),
    isPositive: Math.random() > 0.5,
  })).slice(0, 4); // Ensure we only take 4 items for display consistency
};


const MarketTickerItem = ({ name, value, change, changePercent, isPositive, region, icon: Icon }: MarketTickerData) => (
  <div className="text-center md:text-left p-3 bg-card/50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex-1 min-w-[150px] md:min-w-[180px]">
    <div className="flex items-center justify-center md:justify-start mb-1">
      {Icon && <Icon size={16} className="mr-2 text-primary flex-shrink-0" />}
      <p className="text-sm text-muted-foreground truncate" title={name}>{name}</p>
    </div>
    <p className="text-xl md:text-2xl font-bold text-foreground">{value}</p>
    <div className={cn("flex items-center justify-center md:justify-start text-sm", isPositive ? 'text-gain' : 'text-loss')}>
      {isPositive ? <TrendingUp size={16} className="mr-1 flex-shrink-0" /> : <TrendingDown size={16} className="mr-1 flex-shrink-0" />}
      <span className="truncate">{change} ({changePercent})</span>
    </div>
    {region && <p className="text-xs text-muted-foreground mt-1">{region}</p>}
  </div>
);

export function HeroSection() {
  const [marketData, setMarketData] = useState<MarketTickerData[]>(initialStaticData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    // setLoading(true); // Optionally set loading true for each refresh
    setError(null);
    try {
      // IMPORTANT: Replace this URL with your actual financial data API endpoint
      const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=4'); // Placeholder API
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const dataFromApi = await response.json();

      // *** You will need to adapt this transformation based on your chosen API's response structure ***
      // For this example, transformApiData returns a modified version of initialStaticData
      const formattedData = transformApiData(dataFromApi);
      setMarketData(formattedData);

    } catch (err) {
      console.error("Failed to fetch market data:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      // Fallback to initial static data in case of error so UI doesn't break
      setMarketData(initialStaticData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Initial fetch

    const intervalId = setInterval(() => {
      fetchData(); // Refresh data every 15 seconds
    }, 15000); // 15 seconds interval

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-background to-muted/30">
      <div className="container text-center">
        <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-4 animate-slide-in" style={{animationDelay: '0.2s'}}>
          MarketPulse
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 animate-slide-in" style={{animationDelay: '0.3s'}}>
          Your Daily Lens on the Share Market. Timely updates, financial insights, and stock analysis to empower your investment decisions.
        </p>
        
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-4xl mx-auto mb-10 animate-slide-in" style={{animationDelay: '0.4s', minHeight: '100px'}}>
          {loading ? (
            <div className="col-span-full flex flex-col justify-center items-center min-h-[100px]">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
              <span className="mt-2 text-muted-foreground">Loading market data...</span>
            </div>
          ) : error ? (
            <div className="col-span-full flex flex-col justify-center items-center min-h-[100px] p-4 bg-destructive/10 border border-destructive rounded-md">
              <AlertTriangle className="h-8 w-8 text-destructive mb-2" />
              <p className="text-sm text-destructive-foreground font-semibold">Failed to load market data</p>
              <p className="text-xs text-destructive-foreground/80">{error}. Displaying static data.</p>
            </div>
          ) : (
            marketData.map((item) => (
              <MarketTickerItem key={item.id} {...item} />
            ))
          )}
        </div>
        
        {!loading && error && ( // Show static data below error message if fetch failed
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-4xl mx-auto mb-10 animate-slide-in" style={{animationDelay: '0.4s'}}>
            {initialStaticData.map((item) => (
              <MarketTickerItem key={item.id} {...item} />
            ))}
          </div>
        )}
        
        <div className="animate-slide-in" style={{animationDelay: '0.5s'}}>
          <Button size="lg" asChild className="shadow-lg hover:shadow-primary/30 transition-shadow">
            <Link href="/news">
              <Newspaper className="mr-2 h-5 w-5" />
              Explore Latest News
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
