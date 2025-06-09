
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { TrendingUp, TrendingDown, Newspaper } from "lucide-react";

const MarketTickerItem = ({ name, value, change, changePercent, isPositive }: { name: string; value: string; change: string; changePercent: string; isPositive: boolean; }) => (
  <div className="text-center md:text-left">
    <p className="text-sm text-muted-foreground">{name}</p>
    <p className="text-2xl font-bold text-foreground">{value}</p>
    <div className={`flex items-center justify-center md:justify-start text-sm ${isPositive ? 'text-gain' : 'text-loss'}`}>
      {isPositive ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
      <span>{change} ({changePercent})</span>
    </div>
  </div>
);

export function HeroSection() {
  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-background to-muted/30">
      <div className="container text-center">
        <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 animate-slide-in" style={{animationDelay: '0.2s'}}>
          MarketPulse
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-slide-in" style={{animationDelay: '0.3s'}}>
          Your Daily Lens on the Share Market. Timely updates, financial insights, and stock analysis to empower your investment decisions.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-10 animate-slide-in" style={{animationDelay: '0.4s'}}>
          <MarketTickerItem name="NIFTY 50" value="23,450.75" change="+120.25" changePercent="+0.51%" isPositive={true} />
          <MarketTickerItem name="SENSEX" value="78,050.90" change="-50.10" changePercent="-0.06%" isPositive={false} />
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

    