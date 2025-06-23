import type { Metadata, ResolvingMetadata } from "next";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { categories } from "@/lib/data";
import { LayoutGrid } from "lucide-react";
import { notFound } from "next/navigation";
import type { BlogPost } from "@/types";
import { unstable_noStore as noStore } from "next/cache";
import type React from "react";
import { SectionTitle } from "@/components/common/SectionTitle";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:9002";

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

async function fetchPostsByCategory(categorySlug: string): Promise<BlogPost[]> {
  noStore();
  try {
    const res = await fetch(
      `${SITE_URL}/api/posts?categorySlug=${categorySlug}`,
      {
        cache: "no-store",
      },
    );
    if (!res.ok) {
      console.error(
        `Failed to fetch posts for category ${categorySlug}: ${res.status} ${await res.text()}`,
      );
      return [];
    }
    const data = (await res.json()) as { posts: BlogPost[] };
    return data.posts || [];
  } catch (error) {
    console.error(
      `Error fetching posts for category ${categorySlug} from API:`,
      error,
    );
    return [];
  }
}

export async function generateMetadata(
  { params }: CategoryPageProps,
  _parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = params;
  const category = categories.find((cat) => cat.slug === slug);
  const canonicalUrl = `${SITE_URL}/category/${slug}`;

  if (!category) {
    return {
      title: "Category Not Found",
      description: "The category you are looking for could not be found.",
    };
  }

  const title = `${category.name.replace(/-/g, " ")} News & Analysis`;
  const description = `Latest news, articles, and analysis in the ${category.name.toLowerCase()} category on MarketPulse. Stay updated with ${category.name.toLowerCase()} insights.`;

  return {
    title: title,
    description: description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: title,
      description: description,
      url: canonicalUrl,
      type: "website",
      images: [
        {
          url: `${SITE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [`${SITE_URL}/twitter-image.png`],
    },
  };
}

export async function generateStaticParams() {
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export default async function CategoryPage({
  params: { slug },
}: CategoryPageProps) {
  const category = categories.find((cat) => cat.slug === slug);

  if (!category) {
    notFound();
  }

  const postsInCategory = await fetchPostsByCategory(slug);

  return (
    <div className="container py-6 md:py-10 px-4 sm:px-6 lg:px-8">
      <SectionTitle
        title={category.name.replace(/-/g, " ")}
        icon={LayoutGrid}
        titleClassName="capitalize"
      />
      {postsInCategory.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {postsInCategory.map((post, index) => (
            <BlogPostCard
              key={post._id || post.id || index.toString()}
              post={post}
              orientation="vertical"
            />
          ))}
        </div>
      ) : (
        <p className="text-base sm:text-lg text-muted-foreground">
          There are no posts in the &quot;{category.name}&quot; category at the
          moment. Please check back later.
        </p>
      )}
    </div>
  );
}
