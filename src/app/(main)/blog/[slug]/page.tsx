import { latestBlogPosts } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, UserCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { notFound } from 'next/navigation';

// ISR: Revalidate every 24 hours (86400 seconds)
export const revalidate = 86400;

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return latestBlogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = params;
  const post = latestBlogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="container py-8 md:py-12 animate-slide-in" style={{animationDelay: '0.1s', animationFillMode: 'backwards'}}>
      <article className="max-w-3xl mx-auto">
        <header className="mb-8">
          <div className="mb-4">
            <Button variant="outline" asChild size="sm">
              <Link href="/news" className="text-sm">
                <ArrowLeft size={16} className="mr-2" />
                Back to News
              </Link>
            </Button>
          </div>
          <Link href={`/category/${post.category.slug}`}>
            <Badge variant="secondary" className="mb-2 inline-block hover:bg-accent hover:text-accent-foreground transition-colors">
              {post.category.name}
            </Badge>
          </Link>
          <h1 className="font-headline text-3xl md:text-4xl font-bold mb-3 leading-tight">{post.title}</h1>
          <div className="flex flex-wrap items-center text-sm text-muted-foreground gap-x-4 gap-y-1">
            <div className="flex items-center gap-1">
              <UserCircle size={14} />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <CalendarDays size={14} />
              <time dateTime={post.publishedAt}>{formattedDate}</time>
            </div>
          </div>
        </header>

        {post.imageUrl && (
          <div className="relative aspect-video mb-8 rounded-lg overflow-hidden shadow-lg">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 768px"
              className="object-cover"
              priority
              data-ai-hint={post.imageAiHint || "financial news article"}
            />
          </div>
        )}

        {post.content ? (
          <div
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        ) : (
          <p className="text-lg text-muted-foreground">{post.summary}</p>
        )}

        {post.tags && post.tags.length > 0 && (
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">TAGS:</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <Link key={tag} href={`/tags/${tag.toLowerCase().replace(/\s+/g, '-')}`}>
                  <Badge variant="outline" className="text-xs hover:bg-muted transition-colors"># {tag}</Badge>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}

// Add some basic prose styling for Tailwind Typography if not already present globally
// You might want to add this to your globals.css if you use prose frequently
// @layer components {
//   .prose { @apply text-foreground; }
//   .prose h1, .prose h2, .prose h3, .prose h4 { @apply text-foreground font-headline; }
//   .prose a { @apply text-primary hover:text-primary/80; }
//   .prose strong { @apply text-foreground; }
//   .prose blockquote { @apply border-primary; }
//   .prose code { @apply text-sm; }
// }
// We'll assume tailwind typography plugin is configured or some base styles exist.
// For simplicity here, direct HTML is used.
