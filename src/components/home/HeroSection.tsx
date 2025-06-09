import { Button } from "@/components/ui/button";
import { Newspaper } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-background to-muted/30">
      <div className="container text-center">
        <h1
          className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-4 animate-slide-in"
          style={{ animationDelay: "0.2s" }}
        >
          MarketPulse
        </h1>
        <p
          className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 animate-slide-in"
          style={{ animationDelay: "0.3s" }}
        >
          Your Daily Lens on the Share Market. Timely updates, financial
          insights, and stock analysis to empower your investment decisions.
        </p>

        <div className="animate-slide-in" style={{ animationDelay: "0.5s" }}>
          <Button
            size="lg"
            asChild
            className="shadow-lg hover:shadow-primary/30 transition-shadow"
          >
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
