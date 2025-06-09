
import type { Metadata } from 'next';
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { TrendingHeadlineCard } from "@/components/blog/TrendingHeadlineCard";
import { AdSlot } from "@/components/ads/AdSlot";
import { latestBlogPosts, trendingHeadlines, adSlots, categories } from "@/lib/data";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Newspaper, Zap } from "lucide-react";
import { HeroSection } from '@/components/home/HeroSection';
import { HomeCategoryTabs } from '@/components/home/HomeCategoryTabs';
import { TrendingTagsSection } from '@/components/home/TrendingTagsSection';
import { PopularReadsSection } from '@/components/home/PopularReadsSection';


export const metadata: Metadata = {
  title: 'MarketPulse – Your Daily Lens on the Share Market',
  description: 'Get the latest share market news, stock analysis, IPO updates, and financial insights. MarketPulse helps you stay informed and invest wisely.',
  openGraph: {
    title: 'MarketPulse – Your Daily Lens on the Share Market',
    description: 'Get the latest share market news, stock analysis, IPO updates, and financial insights.',
  },
  twitter: {
    title: 'MarketPulse – Your Daily Lens on the Share Market',
    description: 'Get the latest share market news, stock analysis, IPO updates, and financial insights.',
  }
};

const SectionTitle = ({ title, icon: Icon, viewAllLink }: { title: string; icon?: React.ElementType; viewAllLink?: string }) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-2">
      {Icon && <Icon className="h-7 w-7 text-primary" />}
      <h2 className="font-headline text-3xl font-bold">{title}</h2>
    </div>
    {viewAllLink && (
      <Button variant="link" asChild className="text-primary hover:underline">
        <Link href={viewAllLink}>
          <span className="inline-flex items-center"> {/* Wrapped children of Link in a span */}
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </span>
        </Link>
      </Button>
    )}
  </div>
);


export default function HomePage() {
  const featuredPost = latestBlogPosts[0];
  const otherPosts = latestBlogPosts.slice(1, 3); 
  const tradingViewAd = adSlots.find(ad => ad.id === 'tradingview-chart-example');

  return (
    <div className="animate-slide-in" style={{animationDelay: '0.1s', animationFillMode: 'backwards'}}>
      <HeroSection />
      
      <HomeCategoryTabs />

      {/* Top Banner Ad - Can be moved or kept based on design preference */}
      {adSlots.find(ad => ad.id === 'top-banner') && (
        <section className="py-6 bg-muted/30">
          <div className="container">
            <AdSlot config={adSlots.find(ad => ad.id === 'top-banner')!} />
          </div>
        </section>
      )}

      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {featuredPost && (
              <section aria-labelledby="featured-post-title">
                 <h2 id="featured-post-title" className="sr-only">Featured Post</h2>
                <BlogPostCard post={featuredPost} orientation="vertical" className="shadow-lg" />
              </section>
            )}
            
            {otherPosts.length > 0 && (
              <section aria-labelledby="latest-posts-title" className="mt-10">
                <SectionTitle title="Latest Insights" icon={Newspaper} viewAllLink="/news" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {otherPosts.map((post) => (
                    <BlogPostCard key={post.id} post={post} orientation="vertical"/>
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
                    <CardTitle id="trending-headlines-title" className="font-headline text-2xl">Trending Now</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {trendingHeadlines.slice(0, 5).map((headline) => (
                    <TrendingHeadlineCard key={headline.id} headline={headline} />
                  ))}
                </CardContent>
              </Card>
            </section>

            {adSlots.find(ad => ad.id === 'sidebar-ad') && (
              <section aria-label="Sidebar Advertisement" className="sticky top-28">
                <AdSlot config={adSlots.find(ad => ad.id === 'sidebar-ad')!} />
              </section>
            )}
          </aside>
        </div>

        {tradingViewAd && (
          <section className="mt-8 md:mt-12" aria-label="TradingView Chart">
             <h2 className="font-headline text-2xl md:text-3xl font-bold text-center mb-6">Market Spotlight</h2>
            <AdSlot config={tradingViewAd} />
          </section>
        )}
        
        <TrendingTagsSection />
        
        <PopularReadsSection />


        {adSlots.find(ad => ad.id === 'inline-ad-1') && (
          <section className="mt-8 md:mt-12" aria-label="Advertisement">
            <AdSlot config={adSlots.find(ad => ad.id === 'inline-ad-1')!} />
          </section>
        )}

        {latestBlogPosts.length > 3 && (
          <section className="mt-8 md:mt-12" aria-labelledby="more-posts-title">
            <SectionTitle title="More News & Analysis" viewAllLink="/news/all"/>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestBlogPosts.slice(3, latestBlogPosts.length > 6 ? 6 : latestBlogPosts.length).map((post) => ( // Show next 3 or fewer
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
