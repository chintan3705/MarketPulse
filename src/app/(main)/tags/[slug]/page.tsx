
import type { Metadata, ResolvingMetadata } from 'next';
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { latestBlogPosts } from "@/lib/data";
import { Tag } from "lucide-react"; 
import { notFound } from "next/navigation";

// Define a base URL for your site. Replace with your actual domain.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.marketpulse.example.com';

// ISR: Revalidate every 24 hours (86400 seconds)
export const revalidate = 86400;

interface TagPageProps {
  params: {
    slug: string; // e.g., "stock-market"
  };
}

export async function generateMetadata(
  { params }: TagPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug;
  const tagName = slug.replace(/-/g, ' '); // For display and description
  
  // Check if any posts exist for this tag to decide if it's a valid tag page for metadata
  const postsWithTag = latestBlogPosts.filter(post => 
    post.tags.some(tag => tag.toLowerCase().replace(/\s+/g, '-') === slug)
  );

  if (postsWithTag.length === 0) {
    return {
      title: 'Tag Not Found', // Or handle as a 404 higher up if preferred
    };
  }
  
  const title = `Articles tagged with "${tagName}"`;
  const description = `Explore all articles, news, and analysis tagged with "${tagName}" on MarketPulse. Stay informed about ${tagName}.`;

  return {
    title: title,
    description: description,
    keywords: [tagName, ...postsWithTag.flatMap(p => p.tags).filter((t, i, arr) => arr.indexOf(t) === i && t.toLowerCase().replace(/\s+/g, '-') !== slug)], // Add related tags as keywords
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


// Helper function to generate slugs for tags for generateStaticParams
const generateTagSlugs = () => {
  const allTags = new Set<string>();
  latestBlogPosts.forEach(post => {
    post.tags.forEach(tag => {
      allTags.add(tag.toLowerCase().replace(/\s+/g, '-'));
    });
  });
  return Array.from(allTags).map(slug => ({ slug }));
};


export async function generateStaticParams() {
  return generateTagSlugs();
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = params;
  
  const tagName = slug.replace(/-/g, ' ');

  const postsWithTag = latestBlogPosts.filter(post => 
    post.tags.some(tag => tag.toLowerCase().replace(/\s+/g, '-') === slug)
  );
  
  // While generateStaticParams covers existing tags, this check is good for robustness
  // or if a user navigates to a tag slug that might have become empty.
  // For this example, if postsWithTag is empty, the page will show a "no posts" message.
  // A notFound() could be used if you prefer a 404 for empty tag pages.

  return (
    <div className="container py-8 md:py-12 animate-slide-in" style={{animationDelay: '0.1s', animationFillMode: 'backwards'}}>
      <SectionTitle title={tagName} icon={Tag} />
      {postsWithTag.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {postsWithTag.map((post) => (
            <BlogPostCard key={post.id} post={post} orientation="vertical" />
          ))}
        </div>
      ) : (
        <p className="text-lg text-muted-foreground">
          There are no posts tagged with "{tagName}" at the moment. Please check back later.
        </p>
      )}
    </div>
  );
}
