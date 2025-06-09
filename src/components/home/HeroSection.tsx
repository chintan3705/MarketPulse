
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { TrendingUp, TrendingDown, Newspaper, Globe, Landmark } from "lucide-react";

const MarketTickerItem = ({ name, value, change, changePercent, isPositive, region, icon: Icon }: { name: string; value: string; change: string; changePercent: string; isPositive: boolean; region?: string; icon?: React.ElementType }) => (
  <div className="text-center md:text-left p-3 bg-card/50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex-1 min-w-[150px]">
    <div className="flex items-center justify-center md:justify-start mb-1">
      {Icon && <Icon size={16} className="mr-2 text-primary" />}
      <p className="text-sm text-muted-foreground truncate" title={name}>{name}</p>
    </div>
    <p className="text-xl md:text-2xl font-bold text-foreground">{value}</p>
    <div className={`flex items-center justify-center md:justify-start text-sm ${isPositive ? 'text-gain' : 'text-loss'}`}>
      {isPositive ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
      <span>{change} ({changePercent})</span>
    </div>
    {region && <p className="text-xs text-muted-foreground mt-1">{region}</p>}
  </div>
);

export function HeroSection() {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-background to-muted/30">
      <div className="container text-center">
        <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-4 animate-slide-in" style={{animationDelay: '0.2s'}}>
          MarketPulse
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 animate-slide-in" style={{animationDelay: '0.3s'}}>
          Your Daily Lens on the Share Market. Timely updates, financial insights, and stock analysis to empower your investment decisions.
        </p>
        
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-4xl mx-auto mb-10 animate-slide-in" style={{animationDelay: '0.4s'}}>
          <MarketTickerItem name="NIFTY 50" value="23,450.75" change="+120.25" changePercent="+0.51%" isPositive={true} region="India" icon={Landmark} />
          <MarketTickerItem name="SENSEX" value="78,050.90" change="-50.10" changePercent="-0.06%" isPositive={false} region="India" icon={Landmark} />
          <MarketTickerItem name="NASDAQ" value="17,688.88" change="+21.32" changePercent="+0.12%" isPositive={true} region="US" icon={Globe} />
          <MarketTickerItem name="FTSE 100" value="8,237.72" change="-10.50" changePercent="-0.13%" isPositive={false} region="UK" icon={Globe} />
        </div>
        
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
