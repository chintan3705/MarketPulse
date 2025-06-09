
import type { Metadata } from "next";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { Newspaper } from "lucide-react";
import type { BlogPost } from "@/types";
import { unstable_noStore as noStore } from "next/cache";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:9002";

export const metadata: Metadata = {
  title: "Latest Financial News & Market Updates",
  description:
    "Get the latest financial news, stock market updates, and expert analysis from MarketPulse. Your source for timely share market insights.",
  alternates: {
    canonical: `${SITE_URL}/news`,
  },
  openGraph: {
    title: "Latest Financial News & Market Updates | MarketPulse",
    description:
      "Get the latest financial news, stock market updates, and expert analysis from MarketPulse.",
    url: `${SITE_URL}/news`,
    type: "website",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "MarketPulse Latest News",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Latest Financial News & Market Updates | MarketPulse",
    description:
      "Get the latest financial news, stock market updates, and expert analysis from MarketPulse.",
    images: [`${SITE_URL}/twitter-image.png`],
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
  noStore();
  try {
    const res = await fetch(`${SITE_URL}/api/posts?limit=12`, {
      cache: "no-store",
    }); // Fetch recent 12 posts
    if (!res.ok) {
      console.error(
        `Failed to fetch posts: ${res.status} ${await res.text()}`,
      );
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
  const recentPosts: BlogPost[] = await fetchPosts();

  return (
    <div className="container py-8 md:py-12">
      <SectionTitle
        title="Latest News & Analysis"
        icon={Newspaper}
        description="Browse our collection of financial news, stock market updates, and expert analysis from our database."
      />

      {recentPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentPosts.map((post, index) => (
            <BlogPostCard
              key={post._id || post.id || index}
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
