import { Button } from "@/components/ui/button";
import { Newspaper } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24 lg:py-32 bg-gradient-to-br from-background to-muted/20 dark:to-muted/40">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://static.tradingview.com/static/bundles/aurora.d2a6947c3dcfb777c25f.webp"
          alt="Abstract financial background"
          fill
          className="object-cover object-center opacity-50 dark:opacity-70"
          priority
        />
        <div className="absolute inset-0 bg-background/50 dark:bg-background/70"></div>
      </div>
      {/* Animated background charts */}
      <div className="absolute inset-0 z-0 opacity-10 dark:opacity-5 pointer-events-none">
        <Image
          src="https://placehold.co/300x200.png"
          alt="Animated chart 1"
          width={300}
          height={200}
          className="absolute top-[10%] left-[5%] animate-float-slow rounded-lg shadow-lg"
          data-ai-hint="stock chart"
        />
        <Image
          src="https://placehold.co/250x150.png"
          alt="Animated chart 2"
          width={250}
          height={150}
          className="absolute top-[60%] left-[20%] animate-float-medium rounded-lg shadow-lg"
          data-ai-hint="stock chart"
          style={{ animationDelay: "2s" }}
        />
        <Image
          src="https://placehold.co/350x250.png"
          alt="Animated chart 3"
          width={350}
          height={250}
          className="absolute top-[25%] right-[10%] animate-float-fast rounded-lg shadow-lg"
          data-ai-hint="stock chart"
        />
        <Image
          src="https://placehold.co/200x300.png"
          alt="Animated chart 4"
          width={200}
          height={300}
          className="absolute bottom-[5%] right-[25%] animate-float-medium rounded-lg shadow-lg"
          data-ai-hint="stock chart"
          style={{ animationDelay: "3s" }}
        />
      </div>

      <div className="container relative z-10 text-center px-4 sm:px-6 lg:px-8">
        <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-4">
          MarketPulse
        </h1>
        <p className="text-md sm:text-lg md:text-xl text-foreground max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto mb-6 md:mb-8">
          Your Daily Lens on the Share Market. Timely updates, financial
          insights, and stock analysis to empower your investment decisions.
        </p>

        <div>
          <Button
            size="lg"
            asChild
            className="bg-primary/90 hover:bg-primary text-primary-foreground transition-all duration-300 text-sm sm:text-base px-6 sm:px-8 py-2.5 sm:py-3 shadow-lg hover:shadow-xl"
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
