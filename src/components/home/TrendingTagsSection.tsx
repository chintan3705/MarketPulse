
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Flame } from "lucide-react";
import type { BlogPost } from "@/types";
import type React from "react";
import { SectionTitle } from "../common/SectionTitle";

interface TrendingTagsSectionProps {
  posts: BlogPost[];
}

export const TrendingTagsSection: React.FC<TrendingTagsSectionProps> = ({
  posts,
}) => {
  const sectionPadding = "py-6 md:py-10";
  const containerPadding = "container px-4 sm:px-6 lg:px-8";

  if (!posts || posts.length === 0) {
    return (
      <section className={sectionPadding}>
        <div className={containerPadding}>
          <SectionTitle
            title="Trending Tags"
            icon={Flame}
            as="h2"
            titleClassName="text-xl sm:text-2xl md:text-3xl"
          />
          <p className="text-muted-foreground text-sm sm:text-base">
            No trending tags to display at the moment.
          </p>
        </div>
      </section>
    );
  }

  const allTags: string[] = posts.flatMap((post) => post.tags);
  const tagCounts: { [key: string]: number } = {};
  allTags.forEach((tag: string) => {
    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
  });

  const trendingTags: string[] = Object.entries(tagCounts)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, 10) // Show up to 10 tags
    .map(([tag]) => tag);

  if (trendingTags.length === 0) {
    return (
      <section className={sectionPadding}>
        <div className={containerPadding}>
          <SectionTitle
            title="Trending Tags"
            icon={Flame}
            as="h2"
            titleClassName="text-xl sm:text-2xl md:text-3xl"
          />
          <p className="text-muted-foreground text-sm sm:text-base">
            No trending tags to display at the moment.
          </p>
        </div>
      </section>
    );
  }

  const createTagSlug = (tag: string): string =>
    tag.toLowerCase().replace(/\s+/g, "-");

  return (
    <section className={sectionPadding}>
      <div className={containerPadding}>
        <SectionTitle
          title="Trending Tags"
          icon={Flame}
          as="h2"
          titleClassName="text-xl sm:text-2xl md:text-3xl"
        />
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {trendingTags.map((tag: string) => (
            <Link key={tag} href={`/tags/${createTagSlug(tag)}`}>
              <Badge
                variant="secondary"
                className="text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-2 rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-200 ease-in-out transform hover:scale-105 shadow-sm hover:shadow-md"
              >
                # {tag}
              </Badge>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
