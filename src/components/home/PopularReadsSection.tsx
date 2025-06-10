import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { Star } from "lucide-react";
import type { BlogPost } from "@/types";
import type React from "react";

interface PopularReadsSectionProps {
  posts: BlogPost[];
}

export const PopularReadsSection: React.FC<PopularReadsSectionProps> = ({
  posts,
}) => {
  const sectionPadding = "py-6 md:py-10";
  const containerPadding = "container px-4 sm:px-6 lg:px-8";
  const titleClass = "font-headline text-xl sm:text-2xl md:text-3xl font-bold";
  const iconClass = "h-5 w-5 md:h-6 md:w-6 text-primary";

  if (!posts || posts.length === 0) {
    return (
      <section className={`${sectionPadding} bg-muted/20 dark:bg-muted/30`}>
        <div className={containerPadding}>
          <div className="flex items-center gap-2 mb-4 md:mb-6">
            <Star className={iconClass} />
            <h2 className={titleClass}>Popular Reads</h2>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base">
            No popular articles to display at the moment.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className={`${sectionPadding} bg-muted/20 dark:bg-muted/30`}>
      <div className={containerPadding}>
        <div className="flex items-center gap-2 mb-4 md:mb-6">
          <Star className={iconClass} />
          <h2 className={titleClass}>Popular Reads</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {posts.map((post) => (
            <BlogPostCard
              key={post._id || post.id}
              post={post}
              orientation="vertical"
              className="shadow-md hover:shadow-lg"
            />
          ))}
        </div>
      </div>
    </section>
  );
};
