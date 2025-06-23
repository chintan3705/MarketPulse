import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { BlogPost } from "@/types";
import {
  ArrowLeft,
  Bot,
  CalendarDays,
  Headphones,
  UserCircle,
} from "lucide-react";
import type { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChartPlaceholderCard,
  type ChartPlaceholderCardProps,
} from "./_components/ChartPlaceholderCard";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:9002";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

async function getPostData(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${SITE_URL}/api/posts/${slug}`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      console.error(
        `Failed to fetch post ${slug}: ${res.status} ${await res.text()}`,
      );
      return null;
    }
    const post = (await res.json()) as BlogPost;
    return post;
  } catch (error) {
    console.error(`Error fetching post ${slug} from API:`, error);
    return null;
  }
}

export async function generateMetadata(
  { params }: BlogPostPageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = params;
  const post = await getPostData(slug);
  const canonicalUrl = `${SITE_URL}/blog/${slug}`;

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The blog post you are looking for could not be found.",
    };
  }

  const previousImages = (await parent).openGraph?.images || [];
  const postOgImage = post.imageUrl
    ? [
        {
          url: post.imageUrl,
          alt: post.title,
          width: 1200,
          height: 630,
        },
      ]
    : previousImages;

  const siteName = "MarketPulse";
  const logoUrl = `${SITE_URL}/logo-schema.png`;

  const authorUrl =
    post.isAiGenerated || post.author === "MarketPulse AI"
      ? `${SITE_URL}/about`
      : `${SITE_URL}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    headline: post.title,
    description: post.summary.substring(0, 155),
    image: post.imageUrl ? [post.imageUrl] : [],
    author: {
      "@type": "Person",
      name: post.author,
      url: authorUrl,
    },
    publisher: {
      "@type": "Organization",
      name: siteName,
      logo: {
        "@type": "ImageObject",
        url: logoUrl,
        width: 600,
        height: 60,
      },
    },
    datePublished: new Date(post.publishedAt).toISOString(),
    dateModified: new Date(post.updatedAt).toISOString(),
  };

  return {
    title: post.title,
    description: post.summary.substring(0, 155),
    keywords: post.tags,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.title,
      description: post.summary,
      url: canonicalUrl,
      type: "article",
      publishedTime: new Date(post.publishedAt).toISOString(),
      modifiedTime: new Date(post.updatedAt).toISOString(),
      authors: [post.author],
      tags: post.tags,
      images: postOgImage,
      siteName: siteName,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
      images: postOgImage.map((img) => img.url),
    },
    other: {
      "application/ld+json": JSON.stringify(jsonLd),
    },
  };
}

export async function generateStaticParams() {
  return [];
}

const renderContentWithChartPlaceholders = (post: BlogPost) => {
  if (!post.content) return [{ type: "html" as const, content: post.summary }];

  const contentParts = post.content.split(/(\[CHART:\s*[^\]]+\])/g);
  const elements: Array<{
    type: "html" | "chart";
    content?: string;
    chartData?: ChartPlaceholderCardProps;
  }> = [];

  contentParts.forEach((part) => {
    const chartMatch = part.match(/\[CHART:\s*([^\]]+)\]/);
    if (chartMatch && post.chartDataJson) {
      // Only add if chartDataJson exists
      const chartDescription = chartMatch[1];
      elements.push({
        type: "chart",
        chartData: {
          chartType: post.chartType,
          chartDescription: chartDescription,
          detailedInformation: post.detailedInformation,
          chartDataJson: post.chartDataJson,
        },
      });
    } else if (part.trim() !== "") {
      elements.push({ type: "html", content: part });
    }
  });

  // If after processing, elements is empty (e.g. content was just "[CHART: ...]" but no data),
  // default to summary. Or if content was empty to begin with.
  if (elements.length === 0) {
    elements.push({ type: "html", content: post.summary });
  }

  return elements;
};

export default async function BlogPostPage({
  params: { slug },
}: BlogPostPageProps) {
  const post = await getPostData(slug);

  if (!post) {
    notFound();
  }

  const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const contentElements = renderContentWithChartPlaceholders(post);

  return (
    <div className="container py-6 md:py-10 px-4 sm:px-6 lg:px-8">
      <article className="max-w-3xl mx-auto">
        <header className="mb-6 md:mb-8">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <Button
              variant="outline"
              asChild
              size="sm"
              className="text-xs sm:text-sm transition-colors duration-200 ease-in-out"
            >
              <Link href="/news">
                <ArrowLeft size={14} className="mr-1.5" />
                Back to News
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled
              title="Listen to article (Feature coming soon)"
              className="text-xs sm:text-sm"
            >
              <Headphones size={14} className="mr-1.5" />
              Listen
            </Button>
          </div>
          <Link href={`/category/${post.category.slug}`}>
            <Badge
              variant="secondary"
              className="mb-2 inline-block hover:bg-primary/20 hover:text-primary transition-colors duration-200 ease-in-out text-xs px-2 py-0.5"
            >
              {post.category.name}
            </Badge>
          </Link>
          <h1 className="font-headline text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 leading-tight">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center text-xs sm:text-sm text-muted-foreground gap-x-3 sm:gap-x-4 gap-y-1">
            <div className="flex items-center gap-1">
              {post.isAiGenerated ? (
                <Bot size={14} className="text-primary" />
              ) : (
                <UserCircle size={14} />
              )}
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <CalendarDays size={14} />
              <time dateTime={post.publishedAt}>{formattedDate}</time>
            </div>
          </div>
        </header>

        {post.imageUrl && (
          <div className="relative aspect-video mb-6 md:mb-8 rounded-lg overflow-hidden shadow-lg">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 768px"
              className="object-cover"
              priority={true}
              data-ai-hint={post.imageAiHint || "financial news article"}
            />
          </div>
        )}

        <div className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none [&_h3]:font-headline [&_h3]:text-xl [&_h3]:sm:text-2xl [&_h3]:mb-2 [&_h3]:mt-6 [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:ml-5">
          {contentElements.map((element, index) => {
            if (element.type === "chart" && element.chartData) {
              return (
                <ChartPlaceholderCard key={index} {...element.chartData} />
              );
            }
            if (element.type === "html" && element.content) {
              // Ensure content is not undefined before passing to dangerouslySetInnerHTML
              return (
                <div
                  key={index}
                  dangerouslySetInnerHTML={{ __html: element.content || "" }}
                />
              );
            }
            return null;
          })}
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t">
            <h3 className="text-xs sm:text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
              Tags:
            </h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/tags/${tag.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <Badge
                    variant="outline"
                    className="text-xs px-2 py-0.5 transition-colors duration-200 ease-in-out"
                  >
                    # {tag}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
