
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { latestBlogPosts } from "@/lib/data";
import { Tag } from "lucide-react"; 
import { notFound } from "next/navigation";

// ISR: Revalidate every 24 hours (86400 seconds)
export const revalidate = 86400;

const SectionTitle = ({ title, icon: Icon }: { title: string; icon?: React.ElementType; }) => (
  <div className="flex items-center gap-2 mb-6">
    {Icon && <Icon className="h-7 w-7 text-primary" />}
    <h1 className="font-headline text-3xl font-bold capitalize">Posts tagged: {title}</h1>
  </div>
);

interface TagPageProps {
  params: {
    slug: string; // e.g., "stock-market"
  };
}

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
  
  // Convert slug back to a more readable tag name for display, if needed
  // or find the original tag name if you store it. For this example, we'll just use the slug.
  const tagName = slug.replace(/-/g, ' ');

  const postsWithTag = latestBlogPosts.filter(post => 
    post.tags.some(tag => tag.toLowerCase().replace(/\s+/g, '-') === slug)
  );
  
  if (postsWithTag.length === 0) {
    // Optionally, you could show a "no posts for this tag" page instead of 404
    // For now, we'll consider it a 404 if no posts match.
    // Or, if generateStaticParams is exhaustive, this might not be strictly necessary
    // unless new tags are added without rebuilding.
    // notFound(); 
  }

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
