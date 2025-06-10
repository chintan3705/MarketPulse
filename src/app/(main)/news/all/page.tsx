import type { Metadata } from "next";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { Newspaper } from "lucide-react";
import type { BlogPost } from "@/types";
import { unstable_noStore as noStore } from "next/cache";
import type React from "react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:9002";

export const metadata: Metadata = {
  title: "All News & Analysis",
  description:
    "Browse all news articles and in-depth analysis from MarketPulse. Stay updated with the latest financial insights and market trends.",
  alternates: {
    canonical: `${SITE_URL}/news/all`,
  },
  openGraph: {
    title: "All News & Analysis | MarketPulse",
    description:
      "Browse all news articles and in-depth analysis from MarketPulse.",
    url: `${SITE_URL}/news/all`,
    type: "website",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "All News from MarketPulse",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "All News & Analysis | MarketPulse",
    description:
      "Browse all news articles and in-depth analysis from MarketPulse.",
    images: [`${SITE_URL}/twitter-image.png`],
  },
};

interface SectionTitleProps {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title, icon: Icon }) => (
  <div className="flex items-center gap-2 mb-6">
    {Icon && <Icon className="h-7 w-7 text-primary" />}
    <h1 className="font-headline text-2xl sm:text-3xl font-bold">{title}</h1>
  </div>
);

async function fetchAllPosts(): Promise<BlogPost[]> {
  noStore();
  try {
    const res = await fetch(`${SITE_URL}/api/posts`, { cache: "no-store" });
    if (!res.ok) {
      console.error(
        `Failed to fetch all posts: ${res.status} ${await res.text()}`,
      );
      return [];
    }
    const data = (await res.json()) as { posts: BlogPost[] };
    return data.posts || [];
  } catch (error) {
    console.error("Error fetching all posts from API:", error);
    return [];
  }
}

export default async function AllNewsPage() {
  const allPosts = await fetchAllPosts();

  return (
    <div
      className="container py-8 md:py-12 animate-slide-in"
      style={{ animationDelay: "0.1s", animationFillMode: "backwards" }}
    >
      <SectionTitle title="All News & Analysis" icon={Newspaper} />
      {allPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allPosts.map((post, index) => (
            <BlogPostCard
              key={post._id || post.id || index.toString()}
              post={post}
              orientation="vertical"
            />
          ))}
        </div>
      ) : (
        <p className="text-lg text-muted-foreground">
          No news articles available at the moment. Please use the admin panel
          to generate new content.
        </p>
      )}
    </div>
  );
}
