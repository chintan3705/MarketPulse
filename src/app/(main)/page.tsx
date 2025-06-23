import { AdSlot } from "@/components/ads/AdSlot";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { TrendingHeadlineCard } from "@/components/blog/TrendingHeadlineCard";
import { SectionTitle } from "@/components/common/SectionTitle";
import { HeroSection } from "@/components/home/HeroSection";
import { HomeCategoryTabs } from "@/components/home/HomeCategoryTabs";
import { MarketLensSection } from "@/components/home/MarketLensSection";
import { PopularReadsSection } from "@/components/home/PopularReadsSection";
import { TrendingTagsSection } from "@/components/home/TrendingTagsSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adSlots, trendingHeadlines } from "@/lib/data";
import type { BlogPost } from "@/types";
import { ArrowRight, Newspaper, Zap } from "lucide-react";
import type { Metadata, ResolvingMetadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import type React from "react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:9002";

export async function generateMetadata(
  _props: unknown,
  _parent: ResolvingMetadata,
): Promise<Metadata> {
  const canonicalUrl = SITE_URL;

  return {
    title: "MarketPulse – Your Daily Lens on the Share Market",
    description:
      "Get the latest share market news, stock analysis, IPO updates, and financial insights. MarketPulse helps you stay informed and invest wisely.",
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: "MarketPulse – Your Daily Lens on the Share Market",
      description:
        "Get the latest share market news, stock analysis, IPO updates, and financial insights.",
      url: canonicalUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: "MarketPulse – Your Daily Lens on the Share Market",
      description:
        "Get the latest share market news, stock analysis, IPO updates, and financial insights.",
    },
  };
}

interface HomepageSectionTitleProps {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  viewAllLink?: string;
}

const HomepageSectionTitle: React.FC<HomepageSectionTitleProps> = ({
  title,
  icon,
  viewAllLink,
}) => (
  <div className="flex items-center justify-between mb-4 md:mb-6">
    <SectionTitle
      title={title}
      icon={icon}
      as="h2"
      titleClassName="text-xl sm:text-2xl md:text-3xl"
    />
    {viewAllLink && (
      <Button
        variant="link"
        asChild
        className="text-primary hover:underline text-sm md:text-base px-1"
      >
        <Link href={viewAllLink}>
          <span className="inline-flex items-center">
            View All <ArrowRight className="ml-1 h-3.5 w-3.5 md:h-4 md:w-4" />
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
    <div>
      <HeroSection />
      <MarketLensSection />
      <HomeCategoryTabs />
      {topBannerAd && (
        <section className="py-4 md:py-6 bg-muted/30 dark:bg-muted/40">
          <div className="container">
            <AdSlot config={topBannerAd} />
          </div>
        </section>
      )}
      <div className="container py-6 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
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
              <section
                aria-labelledby="latest-posts-title"
                className="mt-6 md:mt-8"
              >
                <HomepageSectionTitle
                  title="Latest Insights"
                  icon={Newspaper}
                  viewAllLink="/news"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
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

          <aside className="lg:col-span-1 space-y-6 md:space-y-8">
            <section aria-labelledby="trending-headlines-title">
              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                    <CardTitle
                      id="trending-headlines-title"
                      className="font-headline text-lg sm:text-xl"
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
                className="sticky top-20"
              >
                <AdSlot config={sidebarAd} />
              </section>
            )}
          </aside>
        </div>

        {tradingViewAd && (
          <section className="mt-8 md:mt-12" aria-label="TradingView Chart">
            <SectionTitle
              title="Market Spotlight"
              as="h2"
              titleClassName="text-xl sm:text-2xl md:text-3xl text-center"
              className="text-center"
            />
            <AdSlot config={tradingViewAd} />
          </section>
        )}

        <section className="mt-8 md:mt-12">
          <TrendingTagsSection posts={latestBlogPosts} />
        </section>

        <section className="mt-8 md:mt-12">
          <PopularReadsSection posts={latestBlogPosts.slice(0, 3)} />
        </section>

        {inlineAd1 && (
          <section className="mt-8 md:mt-12" aria-label="Advertisement">
            <AdSlot config={inlineAd1} />
          </section>
        )}

        {moreNewsPosts.length > 0 && (
          <section className="mt-8 md:mt-12" aria-labelledby="more-posts-title">
            <HomepageSectionTitle
              title="More News & Analysis"
              viewAllLink="/news/all"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
