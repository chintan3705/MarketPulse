import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Flame } from "lucide-react";
import type { BlogPost } from "@/types";

interface TrendingTagsSectionProps {
  posts: BlogPost[]; // Pass posts to derive tags
}

export function TrendingTagsSection({ posts }: TrendingTagsSectionProps) {
  if (!posts || posts.length === 0) {
    return (
      <section className="py-8 md:py-12">
        <div className="container">
          <div className="flex items-center gap-2 mb-6">
            <Flame className="h-6 w-6 text-primary" />
            <h2 className="font-headline text-2xl sm:text-3xl font-bold">
              Trending Tags
            </h2>
          </div>
          <p className="text-muted-foreground">
            No trending tags to display at the moment.
          </p>
        </div>
      </section>
    );
  }

  const allTags = posts.flatMap((post) => post.tags);
  const tagCounts: { [key: string]: number } = {};
  allTags.forEach((tag) => {
    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
  });

  const trendingTags = Object.entries(tagCounts)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, 8)
    .map(([tag]) => tag);

  if (trendingTags.length === 0) {
    return (
      <section className="py-8 md:py-12">
        <div className="container">
          <div className="flex items-center gap-2 mb-6">
            <Flame className="h-6 w-6 text-primary" />
            <h2 className="font-headline text-2xl sm:text-3xl font-bold">
              Trending Tags
            </h2>
          </div>
          <p className="text-muted-foreground">
            No trending tags to display at the moment.
          </p>
        </div>
      </section>
    );
  }

  const createTagSlug = (tag: string) => tag.toLowerCase().replace(/\s+/g, "-");

  return (
    <section className="py-8 md:py-12">
      <div className="container">
        <div className="flex items-center gap-2 mb-6">
          <Flame className="h-6 w-6 text-primary" />
          <h2 className="font-headline text-2xl sm:text-3xl font-bold">
            Trending Tags
          </h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {trendingTags.map((tag) => (
            <Link key={tag} href={`/tags/${createTagSlug(tag)}`}>
              <Badge
                variant="secondary"
                className="text-sm px-4 py-2 rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-200 ease-in-out transform hover:scale-105 shadow-sm hover:shadow-lg"
              >
                # {tag}
              </Badge>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
