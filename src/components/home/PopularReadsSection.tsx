
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { Star } from "lucide-react";
import type { BlogPost } from "@/types";

interface PopularReadsSectionProps {
  posts: BlogPost[];
}

export function PopularReadsSection({ posts }: PopularReadsSectionProps) {
  if (!posts || posts.length === 0) {
    return (
      <section className="py-8 md:py-12 bg-muted/30">
        <div className="container">
          <div className="flex items-center gap-2 mb-6">
            <Star className="h-6 w-6 text-primary" />
            <h2 className="font-headline text-2xl sm:text-3xl font-bold">Popular Reads</h2>
          </div>
          <p className="text-muted-foreground">No popular articles to display at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-12 bg-muted/30">
      <div className="container">
        <div className="flex items-center gap-2 mb-6">
          <Star className="h-6 w-6 text-primary" />
          <h2 className="font-headline text-2xl sm:text-3xl font-bold">Popular Reads</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <BlogPostCard key={post._id || post.id} post={post} orientation="vertical" className="shadow-lg hover:shadow-xl"/>
          ))}
        </div>
      </div>
    </section>
  );
}
