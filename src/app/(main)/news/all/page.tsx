
import type { Metadata } from 'next';
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { latestBlogPosts } from "@/lib/data";
import { Newspaper } from "lucide-react";

export const metadata: Metadata = {
  title: 'All News & Analysis',
  description: 'Browse all news articles and in-depth analysis from MarketPulse. Stay updated with the latest financial insights and market trends.',
  alternates: {
    canonical: '/news/all',
  },
  openGraph: {
    title: 'All News & Analysis | MarketPulse',
    description: 'Browse all news articles and in-depth analysis from MarketPulse.',
    url: '/news/all',
  },
};


const SectionTitle = ({ title, icon: Icon }: { title: string; icon?: React.ElementType; }) => (
  <div className="flex items-center gap-2 mb-6">
    {Icon && <Icon className="h-7 w-7 text-primary" />}
    <h1 className="font-headline text-2xl sm:text-3xl font-bold">{title}</h1>
  </div>
);

export default function AllNewsPage() {
  return (
    <div className="container py-8 md:py-12 animate-slide-in" style={{animationDelay: '0.1s', animationFillMode: 'backwards'}}>
      <SectionTitle title="All News & Analysis" icon={Newspaper} />
      {latestBlogPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestBlogPosts.map((post) => (
            <BlogPostCard key={post.id} post={post} orientation="vertical" />
          ))}
        </div>
      ) : (
        <p className="text-lg text-muted-foreground">No news articles available at the moment. Please check back later.</p>
      )}
    </div>
  );
}
