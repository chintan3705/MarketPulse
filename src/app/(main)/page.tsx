
import type { Metadata } from "next";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { TrendingHeadlineCard } from "@/components/blog/TrendingHeadlineCard";
import { AdSlot } from "@/components/ads/AdSlot";
import { trendingHeadlines, adSlots } from "@/lib/data";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Newspaper, Zap } from "lucide-react";
import { HeroSection } from "@/components/home/HeroSection";
import { HomeCategoryTabs } from "@/components/home/HomeCategoryTabs";
import { TrendingTagsSection } from "@/components/home/TrendingTagsSection";
import { PopularReadsSection } from "@/components/home/PopularReadsSection";
import { MarketLensSection } from "@/components/home/MarketLensSection";
import type { BlogPost } from "@/types";
import { unstable_noStore as noStore } from "next/cache";
import type React from "react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:9002";

export const metadata: Metadata = {
  title: "MarketPulse – Your Daily Lens on the Share Market",
  description:
    "Get the latest share market news, stock analysis, IPO updates, and financial insights. MarketPulse helps you stay informed and invest wisely.",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "MarketPulse – Your Daily Lens on the Share Market",
    description:
      "Get the latest share market news, stock analysis, IPO updates, and financial insights.",
    url: SITE_URL,
    type: "website",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "MarketPulse Homepage",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MarketPulse – Your Daily Lens on the Share Market",
    description:
      "Get the latest share market news, stock analysis, IPO updates, and financial insights.",
    images: [`${SITE_URL}/twitter-image.png`],
  },
};

interface SectionTitleProps {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  viewAllLink?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  icon: Icon,
  viewAllLink,
}) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-2">
      {Icon && <Icon className="h-7 w-7 text-primary" />}
      <h2 className="font-headline text-2xl sm:text-3xl font-bold">{title}</h2>
    </div>
    {viewAllLink && (
      <Button variant="link" asChild className="text-primary hover:underline">
        <Link href={viewAllLink}>
          <span className="inline-flex items-center">
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </span>
        </Link>
      </Button>
    )}
  </div>
);

async function fetchHomePagePosts(): Promise<BlogPost[]> {
  noStore();
  try {
    const res = await fetch(`${SITE_URL}/api/posts?limit=6`, {
      cache: "no-store",
    });
    if (!res.ok) {
      console.error(
        `Failed to fetch homepage posts: ${res.status} ${await res.text()}`,
      );
      return [];
    }
    const data = (await res.json()) as { posts: BlogPost[] };
    return data.posts || [];
  } catch (error) {
    console.error("Error fetching homepage posts from API:", error);
    return [];
  }
}

export default async function HomePage() {
  const latestBlogPosts = await fetchHomePagePosts();

  const featuredPost = latestBlogPosts[0];
  const otherPosts = latestBlogPosts.slice(1, 3);
  const moreNewsPosts = latestBlogPosts.slice(3, 6);
  const tradingViewAd = adSlots.find(
    (ad) => ad.id === "tradingview-chart-example",
  );
  const topBannerAd = adSlots.find((ad) => ad.id === "top-banner");
  const sidebarAd = adSlots.find((ad) => ad.id === "sidebar-ad");
  const inlineAd1 = adSlots.find((ad) => ad.id === "inline-ad-1");

  return (
    <div
      className="animate-slide-in"
      style={{ animationDelay: "0.1s", animationFillMode: "backwards" }}
    >
      <HeroSection />

      <MarketLensSection />

      <HomeCategoryTabs />

      {topBannerAd && (
        <section className="py-6 bg-muted/30">
          <div className="container">
            <AdSlot config={topBannerAd} />
          </div>
        </section>
      )}

      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {featuredPost && (
              <section aria-labelledby="featured-post-title">
                <h2 id="featured-post-title" className="sr-only">
                  Featured Post
                </h2>
                <BlogPostCard
                  post={featuredPost}
                  orientation="vertical"
                  className="shadow-lg"
                  priority={true}
                />
              </section>
            )}

            {otherPosts.length > 0 && (
              <section aria-labelledby="latest-posts-title" className="mt-10">
                <SectionTitle
                  title="Latest Insights"
                  icon={Newspaper}
                  viewAllLink="/news"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {otherPosts.map((post, index) => (
                    <BlogPostCard
                      key={post._id || post.id || index.toString()}
                      post={post}
                      orientation="vertical"
                    />
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="lg:col-span-1 space-y-8">
            <section aria-labelledby="trending-headlines-title">
              <Card className="shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Zap className="h-6 w-6 text-primary" />
                    <CardTitle
                      id="trending-headlines-title"
                      className="font-headline text-xl sm:text-2xl"
                    >
                      Trending Now
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {trendingHeadlines.slice(0, 5).map((headline) => (
                    <TrendingHeadlineCard
                      key={headline.id}
                      headline={headline}
                    />
                  ))}
                </CardContent>
              </Card>
            </section>

            {sidebarAd && (
              <section
                aria-label="Sidebar Advertisement"
                className="sticky top-28"
              >
                <AdSlot config={sidebarAd} />
              </section>
            )}
          </aside>
        </div>

        {tradingViewAd && (
          <section className="mt-8 md:mt-12" aria-label="TradingView Chart">
            <h2 className="font-headline text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6">
              Market Spotlight
            </h2>
            <AdSlot config={tradingViewAd} />
          </section>
        )}

        <section
          className="animate-slide-in"
          style={{ animationDelay: "0.5s", animationFillMode: "backwards" }}
        >
          <TrendingTagsSection posts={latestBlogPosts} />
        </section>

        <section
          className="animate-slide-in"
          style={{ animationDelay: "0.7s", animationFillMode: "backwards" }}
        >
          <PopularReadsSection posts={latestBlogPosts.slice(0, 3)} />
        </section>

        {inlineAd1 && (
          <section className="mt-8 md:mt-12" aria-label="Advertisement">
            <AdSlot config={inlineAd1} />
          </section>
        )}

        {moreNewsPosts.length > 0 && (
          <section
            className="mt-8 md:mt-12 animate-slide-in"
            style={{ animationDelay: "0.9s", animationFillMode: "backwards" }}
            aria-labelledby="more-posts-title"
          >
            <SectionTitle
              title="More News & Analysis"
              viewAllLink="/news/all"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {moreNewsPosts.map((post, index) => (
                <BlogPostCard
                  key={post._id || post.id || index.toString()}
                  post={post}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
