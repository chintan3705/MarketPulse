import type { Metadata, ResolvingMetadata } from "next";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { categories } from "@/lib/data";
import { Rocket } from "lucide-react";
import type { BlogPost } from "@/types";
import type React from "react";
import { SectionTitle } from "@/components/common/SectionTitle";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:9002";

export async function generateMetadata(
  _props: unknown,
  _parent: ResolvingMetadata,
): Promise<Metadata> {
  const canonicalUrl = `${SITE_URL}/ipos`;

  return {
    title: "IPO News, Analysis & Upcoming IPOs",
    description:
      "Stay updated on the latest Initial Public Offerings (IPOs). Get IPO news, analysis, and information on upcoming IPOs with MarketPulse.",
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: "IPO News, Analysis & Upcoming IPOs | MarketPulse",
      description:
        "Stay updated on the latest Initial Public Offerings (IPOs) with MarketPulse.",
      url: canonicalUrl,
      type: "website",
      images: [
        {
          url: `${SITE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: "IPO News and Analysis by MarketPulse",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "IPO News, Analysis & Upcoming IPOs | MarketPulse",
      description:
        "Stay updated on the latest Initial Public Offerings (IPOs) with MarketPulse.",
      images: [`${SITE_URL}/twitter-image.png`],
    },
  };
}

async function fetchIpoPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${SITE_URL}/api/posts?categorySlug=ipos`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });
    if (!res.ok) {
      console.error(
        `Failed to fetch IPO posts: ${res.status} ${await res.text()}`,
      );
      return [];
    }
    const data = (await res.json()) as { posts: BlogPost[] };
    return data.posts || [];
  } catch (error) {
    console.error("Error fetching IPO posts from API:", error);
    return [];
  }
}

export default async function IPOsPage() {
  const ipoCategory = categories.find((cat) => cat.slug === "ipos");
  const ipoPosts = await fetchIpoPosts();

  return (
    <div className="container py-8 md:py-12">
      <SectionTitle
        title={ipoCategory?.name || "IPO Central"}
        icon={Rocket}
        titleClassName="text-2xl sm:text-3xl"
      />
      {ipoPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ipoPosts.map((post, index) => (
            <BlogPostCard
              key={post._id || post.id || index.toString()}
              post={post}
              orientation="vertical"
            />
          ))}
        </div>
      ) : (
        <p className="text-lg text-muted-foreground mb-6">
          No IPO news or listings available at the moment. Check back soon for
          the latest updates on upcoming Initial Public Offerings.
        </p>
      )}
      <div className="mt-8 p-6 bg-card rounded-lg shadow-md">
        <h2 className="font-headline text-xl sm:text-2xl font-semibold mb-2">
          IPO Calendar
        </h2>
        <p className="text-muted-foreground">
          Upcoming: A dedicated calendar to track upcoming IPOs, their opening
          and closing dates, and expected listing prices.
        </p>
      </div>
    </div>
  );
}
