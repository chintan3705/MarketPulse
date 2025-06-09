
import type { Metadata, ResolvingMetadata } from 'next';
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { Tag } from "lucide-react"; 
// import { notFound } from "next/navigation"; // notFound might not be needed if we show "no posts"
import type { BlogPost } from '@/types';
import { unstable_noStore as noStore } from 'next/cache';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002';

interface TagPageProps {
  params: {
    slug: string; // e.g., "stock-market"
  };
}

async function fetchPostsByTag(tagSlug: string): Promise<BlogPost[]> {
  noStore();
  try {
    // The API needs to support fetching by tag slug
    const res = await fetch(`${SITE_URL}/api/posts?tagSlug=${tagSlug}`, { cache: 'no-store' });
    if (!res.ok) {
      console.error(`Failed to fetch posts for tag ${tagSlug}:`, res.status, await res.text());
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
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug;
  const tagName = slug.replace(/-/g, ' '); 
  
  const title = `Articles tagged with "${tagName}"`;
  const description = `Explore all articles, news, and analysis tagged with "${tagName}" on MarketPulse. Stay informed about ${tagName}.`;

  return {
    title: title,
    description: description,
    keywords: [tagName],
    alternates: {
      canonical: `/tags/${slug}`,
    },
    openGraph: {
      title: title,
      description: description,
      url: `${SITE_URL}/tags/${slug}`,
      type: 'website', 
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
    },
  };
}

const SectionTitle = ({ title, icon: Icon }: { title: string; icon?: React.ElementType; }) => (
  <div className="flex items-center gap-2 mb-6">
    {Icon && <Icon className="h-7 w-7 text-primary" />}
    <h1 className="font-headline text-2xl sm:text-3xl font-bold capitalize">Posts tagged: {title}</h1>
  </div>
);

export async function generateStaticParams() {
  return []; // All tag pages will be dynamically rendered
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = params;
  const tagName = slug.replace(/-/g, ' ');
  const postsWithTag = await fetchPostsByTag(slug);
  
  // if (postsWithTag.length === 0) {
    // notFound(); // Optionally call notFound if you prefer a 404 for tags with no posts
  // }

  return (
    <div className="container py-8 md:py-12 animate-slide-in" style={{animationDelay: '0.1s', animationFillMode: 'backwards'}}>
      <SectionTitle title={tagName} icon={Tag} />
      {postsWithTag.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {postsWithTag.map((post) => (
            <BlogPostCard key={post._id || post.id} post={post} orientation="vertical" />
          ))}
        </div>
      ) : (
        <p className="text-lg text-muted-foreground">
          There are no posts tagged with &quot;{tagName}&quot; at the moment. Please check back later.
        </p>
      )}
    </div>
  );
}
