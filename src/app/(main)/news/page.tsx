import type { Metadata, ResolvingMetadata } from "next";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { Newspaper } from "lucide-react";
import type { BlogPost } from "@/types";
import type React from "react";
import { SectionTitle } from "@/components/common/SectionTitle";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:9002";

export async function generateMetadata(
  _props: unknown,
  _parent: ResolvingMetadata,
): Promise<Metadata> {
  const canonicalUrl = `${SITE_URL}/news`;

  return {
    title: "Latest Financial News & Market Updates",
    description:
      "Get the latest financial news, stock market updates, and expert analysis from MarketPulse. Your source for timely share market insights.",
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: "Latest Financial News & Market Updates | MarketPulse",
      description:
        "Get the latest financial news, stock market updates, and expert analysis from MarketPulse.",
      url: canonicalUrl,
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
}

async function fetchPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${SITE_URL}/api/posts?limit=12`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });
    if (!res.ok) {
      console.error(`Failed to fetch posts: ${res.status} ${await res.text()}`);
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
    <div className="container py-6 md:py-10 px-4 sm:px-6 lg:px-8">
      <SectionTitle
        title="Latest News & Analysis"
        icon={Newspaper}
        description="Browse our collection of financial news, stock market updates, and expert analysis."
      />

      {recentPosts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {recentPosts.map((post, index) => (
            <BlogPostCard
              key={post._id || post.id || index.toString()}
              post={post}
              orientation="vertical"
            />
          ))}
        </div>
      ) : (
        <p className="text-base sm:text-lg text-muted-foreground">
          No news articles available at the moment. Please use the admin panel
          to generate and save new content.
        </p>
      )}
    </div>
  );
}
