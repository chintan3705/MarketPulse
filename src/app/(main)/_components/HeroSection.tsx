
import { Button } from "@/components/ui/button";
import { Newspaper } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="py-10 md:py-16 lg:py-20 bg-gradient-to-br from-background to-muted/20 dark:to-muted/40">
      <div className="container text-center px-4 sm:px-6 lg:px-8">
        <h1
          className="font-headline text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-4 animate-slide-in"
          style={{ animationDelay: "0.2s" }}
        >
          MarketPulse
        </h1>
        <p
          className="text-md sm:text-lg md:text-xl text-muted-foreground max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto mb-6 md:mb-8 animate-slide-in"
          style={{ animationDelay: "0.3s" }}
        >
          Your Daily Lens on the Share Market. Timely updates, financial
          insights, and stock analysis to empower your investment decisions.
        </p>

        <div className="animate-slide-in" style={{ animationDelay: "0.5s" }}>
          <Button
            size="lg"
            asChild
            className="shadow-lg hover:shadow-primary/20 transition-shadow duration-300 text-sm sm:text-base px-6 sm:px-8 py-2.5 sm:py-3"
          >
            <Link href="/news">
              <Newspaper className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Explore Latest News
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
