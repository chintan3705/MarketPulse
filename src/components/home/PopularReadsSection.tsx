import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { Star } from "lucide-react";
import type { BlogPost } from "@/types";
import type React from "react";
import { SectionTitle } from "../common/SectionTitle";

interface PopularReadsSectionProps {
  posts: BlogPost[];
  locale: string;
}

export const PopularReadsSection: React.FC<PopularReadsSectionProps> = ({
  posts,
  locale,
}) => {
  const sectionPadding = "py-6 md:py-10";
  const containerPadding = "container px-4 sm:px-6 lg:px-8";

  if (!posts || posts.length === 0) {
    return (
      <section className={`${sectionPadding} bg-muted/20 dark:bg-muted/30`}>
        <div className={containerPadding}>
          <SectionTitle
            title="Popular Reads"
            icon={Star}
            as="h2"
            titleClassName="text-xl sm:text-2xl md:text-3xl"
          />
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
        <SectionTitle
          title="Popular Reads"
          icon={Star}
          as="h2"
          titleClassName="text-xl sm:text-2xl md:text-3xl"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {posts.map((post) => (
            <BlogPostCard
              key={post._id || post.id}
              post={post}
              orientation="vertical"
              className="shadow-md hover:shadow-lg"
              locale={locale}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
