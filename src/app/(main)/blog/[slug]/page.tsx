
import { latestBlogPosts, categories } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, UserCircle, ArrowLeft, Headphones, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';
import { generateBlogPost } from '@/ai/flows/generate-blog-post-flow';
import type { BlogPost } from '@/types';
import { getPost as getCachedPost, setPost as cacheSetPost } from '@/lib/aiPostCache';


const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.marketpulse.example.com';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

async function getPostData(slug: string): Promise<BlogPost | null> {
  // 1. Check static posts
  let post = latestBlogPosts.find((p) => p.slug === slug);
  if (post) {
    return post;
  }

  // 2. Check server-side cache for AI-generated posts
  const cachedPost = getCachedPost(slug);
  if (cachedPost) {
    // console.log(`Post "${slug}" found in cache.`);
    return cachedPost;
  }

  // 3. If not found in static or cache, generate on-demand
  // This typically happens if user directly accesses an AI post URL or cache expired.
  // console.log(`Post "${slug}" not in static data or cache. Attempting AI generation.`);
  try {
    const generatedPostData = await generateBlogPost({ topic: slug.replace(/-/g, ' ').replace(/-ai-\d+-\d+$/, '') }); 
    
    const chosenCategory = categories.find(c => c.slug === generatedPostData.categorySlug) || 
                           (categories.length > 0 ? categories[0] : { id: 'unknown', name: 'General', slug: 'general' });
    
    if (!chosenCategory && categories.length > 0) {
      console.warn(`Category not found for slug: ${generatedPostData.categorySlug}. Defaulting to first category.`);
    } else if (categories.length === 0 && !chosenCategory) {
       console.warn(`No categories defined. Defaulting AI post category to general.`);
    }

    const aiPost: BlogPost = {
      id: `ai-generated-${slug}-${Date.now()}`, // Ensure a unique ID if generating on demand
      slug: slug, // Use the slug from the URL
      title: generatedPostData.title,
      summary: generatedPostData.summary,
      content: generatedPostData.content,
      category: chosenCategory,
      author: 'MarketPulse AI',
      publishedAt: new Date().toISOString(),
      tags: generatedPostData.tags,
      isAiGenerated: true,
      imageUrl: generatedPostData.imageUrl,
      imageAiHint: generatedPostData.imageAiHint || generatedPostData.tags.slice(0,2).join(' ') || "financial news",
    };
    
    // Cache this newly generated post as well, so subsequent reloads (within TTL) don't re-generate
    cacheSetPost(slug, aiPost, 15); // Cache for 15 minutes
    return aiPost;

  } catch (error) {
    console.error(`Error generating blog post for slug "${slug}" on detail page:`, error);
    return null; // This will lead to a notFound() call later
  }
}

export async function generateMetadata(
  { params }: BlogPostPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug;
  const post = await getPostData(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const previousImages = (await parent).openGraph?.images || [];
  const postImage = post.imageUrl && !post.imageUrl.startsWith('https://placehold.co') 
    ? [{ url: post.imageUrl, alt: post.title }] 
    : post.imageUrl && post.imageUrl.startsWith('https://placehold.co')
    ? [{url: `${SITE_URL}/api/placeholder-og?imageUrl=${encodeURIComponent(post.imageUrl)}&text=${encodeURIComponent(post.title)}`, alt: post.title, width:1200, height:630}]
    : previousImages;


  return {
    title: post.title,
    description: post.summary,
    keywords: post.tags,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.summary,
      url: `${SITE_URL}/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author],
      tags: post.tags,
      images: postImage,
      siteName: 'MarketPulse',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      images: postImage.map(img => img.url), 
    },
  };
}

// export const revalidate = 86400; // Revalidate static posts daily
export const revalidate = 0; // AI generated posts need to be dynamic if not in cache

export async function generateStaticParams() {
  // Only generate static params for non-AI generated posts from latestBlogPosts
  return latestBlogPosts
    .filter(post => !post.isAiGenerated) // Ensure we only pre-render truly static posts
    .map((post) => ({
      slug: post.slug,
    }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = params;
  const post = await getPostData(slug);

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
          <div className="flex justify-between items-center mb-4">
            <Button variant="outline" asChild size="sm">
              <Link href="/news" className="text-sm">
                <ArrowLeft size={16} className="mr-2" />
                Back to News
              </Link>
            </Button>
            <Button variant="outline" size="sm" disabled title="Listen to article (Feature coming soon)">
              <Headphones size={16} className="mr-2" />
              Listen
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
              {post.isAiGenerated ? <Bot size={14} className="text-primary" /> : <UserCircle size={14} />}
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
              priority={!post.isAiGenerated} 
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
