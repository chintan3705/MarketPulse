
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { latestBlogPosts } from "@/lib/data";
import { Star } from "lucide-react";

export function PopularReadsSection() {
  // Simulate popular reads by taking a slice of latest posts
  const popularPosts = latestBlogPosts.slice(0, 3);

  if (popularPosts.length === 0) {
    return null;
  }

  return (
    <section className="py-8 md:py-12 bg-muted/30">
      <div className="container">
        <div className="flex items-center gap-2 mb-6">
          <Star className="h-6 w-6 text-primary" />
          <h2 className="font-headline text-2xl sm:text-3xl font-bold">Popular Reads</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularPosts.map(post => (
            <BlogPostCard key={post.id} post={post} orientation="vertical" className="shadow-lg hover:shadow-xl"/>
          ))}
        </div>
      </div>
    </section>
  );
}
