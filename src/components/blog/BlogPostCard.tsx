import Link from 'next/link';
import Image from 'next/image';
import type { BlogPost } from '@/types';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, UserCircle } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface BlogPostCardProps {
  post: BlogPost;
  className?: string;
  orientation?: 'vertical' | 'horizontal';
}

export function BlogPostCard({ post, className, orientation = 'vertical' }: BlogPostCardProps) {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const createTagSlug = (tag: string) => tag.toLowerCase().replace(/\s+/g, '-');

  return (
    <Card
      className={cn(
        'overflow-hidden hover:shadow-xl transition-shadow duration-300 group',
        className,
        {
          'flex flex-col': orientation === 'vertical',
          'md:flex-row': orientation === 'horizontal',
        }
      )}
    >
      {post.imageUrl && (
        <div
          className={cn('relative aspect-video shrink-0', {
            'w-full': orientation === 'vertical',
            'md:w-1/3 lg:w-2/5': orientation === 'horizontal',
          })}
        >
          <Link href={`/blog/${post.slug}`} aria-label={post.title}>
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
              className='object-cover group-hover:scale-105 transition-transform duration-300'
              data-ai-hint={post.imageAiHint || 'financial news'}
            />
          </Link>
        </div>
      )}
      <div className={cn('flex flex-col flex-grow', { 'p-0': orientation === 'horizontal' })}>
        <CardHeader className={cn({ 'p-4 md:p-6': orientation === 'horizontal' })}>
          <Link href={`/category/${post.category.slug}`}>
            <Badge
              variant='secondary'
              className='mb-2 inline-block hover:bg-accent hover:text-accent-foreground transition-colors'
            >
              {post.category.name}
            </Badge>
          </Link>
          <CardTitle className='font-headline text-xl lg:text-2xl leading-tight'>
            <Link href={`/blog/${post.slug}`} className='hover:text-primary transition-colors'>
              {post.title}
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent
          className={cn('flex-grow', { 'p-4 md:p-6 pt-0': orientation === 'horizontal' })}
        >
          <p className='text-sm text-muted-foreground line-clamp-3'>{post.summary}</p>
        </CardContent>
        <CardFooter
          className={cn(
            'flex flex-wrap items-center justify-between text-xs text-muted-foreground gap-2',
            { 'p-4 md:p-6 pt-0': orientation === 'horizontal' }
          )}
        >
          <div className='flex items-center gap-1'>
            <UserCircle size={14} />
            <span>{post.author}</span>
          </div>
          <div className='flex items-center gap-1'>
            <CalendarDays size={14} />
            <time dateTime={post.publishedAt}>{formattedDate}</time>
          </div>
        </CardFooter>
        {post.tags && post.tags.length > 0 && orientation === 'vertical' && (
          <div className='px-6 pb-4 pt-0'>
            <div className='flex flex-wrap gap-2'>
              {post.tags.slice(0, 3).map((tag) => (
                <Link key={tag} href={`/tags/${createTagSlug(tag)}`}>
                  <Badge variant='outline' className='text-xs hover:bg-muted transition-colors'>
                    # {tag}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
