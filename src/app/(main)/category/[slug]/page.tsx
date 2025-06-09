import type { Metadata, ResolvingMetadata } from "next";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { categories } from "@/lib/data"; // Static categories for metadata and title
import { LayoutGrid } from "lucide-react";
import { notFound } from "next/navigation";
import type { BlogPost } from "@/types";
import { unstable_noStore as noStore } from "next/cache";

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
        `Failed to fetch posts for category ${categorySlug}:`,
        res.status,
        await res.text(),
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
  const slug = params.slug;
  const category = categories.find((cat) => cat.slug === slug);

  if (!category) {
    return {
      title: "Category Not Found",
    };
  }

  const title = `${category.name.replace(/-/g, " ")} News & Analysis`;
  const description = `Latest news, articles, and analysis in the ${category.name.toLowerCase()} category on MarketPulse. Stay updated with ${category.name.toLowerCase()} insights.`;

  return {
    title: title,
    description: description,
    alternates: {
      canonical: `/category/${category.slug}`,
    },
    openGraph: {
      title: title,
      description: description,
      url: `${SITE_URL}/category/${category.slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
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
      {title}
    </h1>
  </div>
);

export async function generateStaticParams() {
  // Static categories are used, so we can pre-render these pages
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params;
  const category = categories.find((cat) => cat.slug === slug);

  if (!category) {
    notFound();
  }

  const postsInCategory = await fetchPostsByCategory(slug);

  return (
    <div
      className="container py-8 md:py-12 animate-slide-in"
      style={{ animationDelay: "0.1s", animationFillMode: "backwards" }}
    >
      <SectionTitle
        title={category.name.replace(/-/g, " ")}
        icon={LayoutGrid}
      />
      {postsInCategory.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {postsInCategory.map((post) => (
            <BlogPostCard
              key={post._id || post.id}
              post={post}
              orientation="vertical"
            />
          ))}
        </div>
      ) : (
        <p className="text-lg text-muted-foreground">
          There are no posts in the &quot;{category.name}&quot; category at the
          moment. Please check back later.
        </p>
      )}
    </div>
  );
}
