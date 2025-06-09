import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { TrendingHeadlineCard } from "@/components/blog/TrendingHeadlineCard";
import { AdSlot } from "@/components/ads/AdSlot";
import { latestBlogPosts, trendingHeadlines, adSlots } from "@/lib/data"; // Mock data
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Newspaper, Zap } from "lucide-react";

// Helper component for section titles
const SectionTitle = ({ title, icon: Icon, viewAllLink }: { title: string; icon?: React.ElementType; viewAllLink?: string }) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-2">
      {Icon && <Icon className="h-7 w-7 text-primary" />}
      <h2 className="font-headline text-3xl font-bold">{title}</h2>
    </div>
    {viewAllLink && (
      <Button variant="link" asChild className="text-primary hover:underline">
        <Link href={viewAllLink}>
          View All <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </Button>
    )}
  </div>
);


export default function HomePage() {
  const featuredPost = latestBlogPosts[0];
  const otherPosts = latestBlogPosts.slice(1, 3); // Get next 2 posts

  return (
    <div className="animate-slide-in" style={{animationDelay: '0.1s', animationFillMode: 'backwards'}}>
      {/* Top Banner Ad */}
      {adSlots.find(ad => ad.id === 'top-banner') && (
        <section className="py-6 bg-muted/30">
          <div className="container">
            <AdSlot config={adSlots.find(ad => ad.id === 'top-banner')!} />
          </div>
        </section>
      )}

      {/* Main Content Area */}
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Featured Post and Other Posts */}
          <div className="lg:col-span-2 space-y-8">
            {/* Featured Post */}
            {featuredPost && (
              <section aria-labelledby="featured-post-title">
                 <h2 id="featured-post-title" className="sr-only">Featured Post</h2>
                <BlogPostCard post={featuredPost} orientation="vertical" className="shadow-lg" />
              </section>
            )}
            
            {/* Latest Posts Section */}
            {otherPosts.length > 0 && (
              <section aria-labelledby="latest-posts-title">
                <SectionTitle title="Latest Insights" icon={Newspaper} viewAllLink="/news" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {otherPosts.map((post) => (
                    <BlogPostCard key={post.id} post={post} orientation="vertical"/>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column: Trending Headlines and Sidebar Ad */}
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

            {/* Sidebar Ad */}
            {adSlots.find(ad => ad.id === 'sidebar-ad') && (
              <section aria-label="Sidebar Advertisement" className="sticky top-28"> {/* Sticky for sidebar ad */}
                <AdSlot config={adSlots.find(ad => ad.id === 'sidebar-ad')!} />
              </section>
            )}
          </aside>
        </div>

        {/* Inline Ad Section */}
        {adSlots.find(ad => ad.id === 'inline-ad-1') && (
          <section className="mt-8 md:mt-12" aria-label="Advertisement">
            <AdSlot config={adSlots.find(ad => ad.id === 'inline-ad-1')!} />
          </section>
        )}

        {/* More Posts Section (if any left) */}
        {latestBlogPosts.length > 3 && (
          <section className="mt-8 md:mt-12" aria-labelledby="more-posts-title">
            <SectionTitle title="More News & Analysis" viewAllLink="/news/all"/>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestBlogPosts.slice(3).map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
