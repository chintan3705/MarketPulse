import type { Metadata } from "next";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { Newspaper } from "lucide-react";
import type { BlogPost } from "@/types"; // Ensure BlogPost type is available
import { unstable_noStore as noStore } from "next/cache";

// NOTE: The SITE_URL should be configured in your environment variables.
// For this example, using a placeholder.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:9002";

export const metadata: Metadata = {
  title: "Latest Financial News & Market Updates",
  description:
    "Get the latest financial news, stock market updates, and expert analysis from MarketPulse. Your source for timely share market insights.",
  alternates: {
    canonical: "/news",
  },
  openGraph: {
    title: "Latest Financial News & Market Updates | MarketPulse",
    description:
      "Get the latest financial news, stock market updates, and expert analysis from MarketPulse.",
    url: "/news",
  },
};

const SectionTitle = ({
  title,
  icon: Icon,
  description,
}: {
  title: string;
  icon?: React.ElementType;
  description?: string;
}) => (
  <div className="mb-8">
    <div className="flex items-center gap-2 mb-2">
      {Icon && <Icon className="h-7 w-7 text-primary" />}
      <h1 className="font-headline text-2xl sm:text-3xl font-bold">{title}</h1>
    </div>
    {description && <p className="text-muted-foreground">{description}</p>}
  </div>
);

async function fetchPosts(): Promise<BlogPost[]> {
  noStore(); // Opt out of caching for this fetch
  try {
    const res = await fetch(`${SITE_URL}/api/posts`, { cache: "no-store" });
    if (!res.ok) {
      console.error("Failed to fetch posts:", res.status, await res.text());
      return [];
    }
    const data = (await res.json()) as { posts: BlogPost[] };
    return data.posts || [];
  } catch (error) {
    console.error("Error fetching posts from API:", error);
    return [];
  }
}

export default async function NewsPage() {
  const allPosts: BlogPost[] = await fetchPosts();

  return (
    <div className="container py-8 md:py-12">
      <SectionTitle
        title="Latest News & Analysis"
        icon={Newspaper}
        description="Browse our collection of financial news, stock market updates, and expert analysis from our database."
      />

      {allPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allPosts.map((post) => (
            <BlogPostCard
              key={post._id || post.id}
              post={post}
              orientation="vertical"
            />
          ))}
        </div>
      ) : (
        <p className="text-lg text-muted-foreground">
          No news articles available at the moment. Please use the admin panel
          to generate and save new content.
        </p>
      )}
    </div>
  );
}
