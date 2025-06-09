import type { Metadata, ResolvingMetadata } from "next";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { Tag } from "lucide-react";
import type { BlogPost } from "@/types";
import { unstable_noStore as noStore } from "next/cache";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:9002";

interface TagPageProps {
  params: {
    slug: string;
  };
}

async function fetchPostsByTag(tagSlug: string): Promise<BlogPost[]> {
  noStore();
  try {
    const res = await fetch(`${SITE_URL}/api/posts?tagSlug=${tagSlug}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      console.error(
        `Failed to fetch posts for tag ${tagSlug}: ${res.status} ${await res.text()}`,
      );
      return [];
    }
    const data = (await res.json()) as { posts: BlogPost[] };
    return data.posts || [];
  } catch (error) {
    console.error(`Error fetching posts for tag ${tagSlug} from API:`, error);
    return [];
  }
}

export async function generateMetadata(
  { params }: TagPageProps,
  _parent: ResolvingMetadata,
): Promise<Metadata> {
  const slug = params.slug;
  const tagName = slug.replace(/-/g, " "); // Convert slug back to tag name for display

  const title = `Articles tagged with "${tagName}" | MarketPulse`;
  const description = `Explore all articles, news, and analysis tagged with "${tagName}" on MarketPulse. Stay informed about ${tagName}.`;

  return {
    title: title,
    description: description,
    keywords: [tagName], // Use the actual tag name as a keyword
    alternates: {
      canonical: `${SITE_URL}/tags/${slug}`,
    },
    openGraph: {
      title: title,
      description: description,
      url: `${SITE_URL}/tags/${slug}`,
      type: "website",
      images: [
        {
          url: `${SITE_URL}/og-image.png`, // Generic OG for tag pages
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
      images: [`${SITE_URL}/twitter-image.png`], // Generic Twitter image
    },
  };
}

const SectionTitle = ({
  title,
  icon: Icon,
}: {
  title: string;
  icon?: React.ElementType;
}) => (
  <div className="flex items-center gap-2 mb-6">
    {Icon && <Icon className="h-7 w-7 text-primary" />}
    <h1 className="font-headline text-2xl sm:text-3xl font-bold capitalize">
      Posts tagged: {title}
    </h1>
  </div>
);

export async function generateStaticParams() {
  // Dynamically render tag pages as fetching all possible tags might be extensive
  return [];
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = params;
  const tagName = slug.replace(/-/g, " ");
  const postsWithTag = await fetchPostsByTag(slug);

  return (
    <div
      className="container py-8 md:py-12 animate-slide-in"
      style={{ animationDelay: "0.1s", animationFillMode: "backwards" }}
    >
      <SectionTitle title={tagName} icon={Tag} />
      {postsWithTag.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {postsWithTag.map((post, index) => (
            <BlogPostCard
              key={post._id || post.id || index}
              post={post}
              orientation="vertical"
            />
          ))}
        </div>
      ) : (
        <p className="text-lg text-muted-foreground">
          There are no posts tagged with &quot;{tagName}&quot; at the moment.
          Please check back later.
        </p>
      )}
    </div>
  );
}
