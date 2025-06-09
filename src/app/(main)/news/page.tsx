
import type { Metadata } from 'next';
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { latestBlogPosts } from "@/lib/data";
import { Newspaper } from "lucide-react";
// AI generation related imports removed: RefreshCw, AlertTriangle, Loader2, generateMultipleBlogPosts, BlogPost type (if only for AI)

export const metadata: Metadata = {
  title: 'Latest Financial News & Market Updates',
  description: 'Get the latest financial news, stock market updates, and expert analysis from MarketPulse. Your source for timely share market insights.',
  alternates: {
    canonical: '/news',
  },
  openGraph: {
    title: 'Latest Financial News & Market Updates | MarketPulse',
    description: 'Get the latest financial news, stock market updates, and expert analysis from MarketPulse.',
    url: '/news',
  },
};

// Removed: export const revalidate = 0; - content is now from static data.ts

const SectionTitle = ({ title, icon: Icon, description }: { title: string; icon?: React.ElementType; description?: string; }) => (
  <div className="mb-8">
    <div className="flex items-center gap-2 mb-2">
      {Icon && <Icon className="h-7 w-7 text-primary" />}
      <h1 className="font-headline text-2xl sm:text-3xl font-bold">{title}</h1>
    </div>
    {description && <p className="text-muted-foreground">{description}</p>}
  </div>
);

export default async function NewsPage() {
  // AI post generation logic removed.
  // Directly use posts from data.ts
  const allPosts = latestBlogPosts;

  return (
    <div className="container py-8 md:py-12">
      <SectionTitle 
        title="Latest News & Analysis" 
        icon={Newspaper}
        description="Browse our collection of financial news, stock market updates, and expert analysis."
      />
      
      {allPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allPosts.map((post) => (
            <BlogPostCard key={post.id} post={post} orientation="vertical" />
          ))}
        </div>
      ) : (
        <p className="text-lg text-muted-foreground">No news articles available at the moment. Please check back later or use the admin panel to generate new content.</p>
      )}
    </div>
  );
}

    