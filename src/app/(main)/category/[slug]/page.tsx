
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { categories, latestBlogPosts } from "@/lib/data";
import { LayoutGrid } from "lucide-react"; 
import { notFound } from "next/navigation";

// ISR: Revalidate every 24 hours (86400 seconds)
export const revalidate = 86400;

const SectionTitle = ({ title, icon: Icon }: { title: string; icon?: React.ElementType; }) => (
  <div className="flex items-center gap-2 mb-6">
    {Icon && <Icon className="h-7 w-7 text-primary" />}
    <h1 className="font-headline text-3xl font-bold capitalize">{title}</h1>
  </div>
);

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return categories.map(category => ({
    slug: category.slug,
  }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params;
  const category = categories.find(cat => cat.slug === slug);
  
  if (!category) {
    notFound();
  }

  const postsInCategory = latestBlogPosts.filter(post => post.category.slug === slug);

  return (
    <div className="container py-8 md:py-12 animate-slide-in" style={{animationDelay: '0.1s', animationFillMode: 'backwards'}}>
      <SectionTitle title={category.name.replace('-', ' ')} icon={LayoutGrid} />
      {postsInCategory.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {postsInCategory.map((post) => (
            <BlogPostCard key={post.id} post={post} orientation="vertical" />
          ))}
        </div>
      ) : (
        <p className="text-lg text-muted-foreground">
          There are no posts in the "{category.name}" category at the moment. Please check back later.
        </p>
      )}
    </div>
  );
}
