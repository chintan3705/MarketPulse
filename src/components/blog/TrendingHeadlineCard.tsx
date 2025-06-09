import Link from 'next/link';
import type { TrendingHeadline } from '@/types';
import { TrendingUp, TrendingDown, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrendingHeadlineCardProps {
  headline: TrendingHeadline;
  className?: string;
}

export function TrendingHeadlineCard({ headline, className }: TrendingHeadlineCardProps) {
  const timeSince = (dateString: string): string => {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "m ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return Math.floor(seconds) + "s ago";
  };


  return (
    <div className={cn("group p-4 border-b last:border-b-0 hover:bg-card transition-colors", className)}>
      <Link href={headline.url} target="_blank" rel="noopener noreferrer" className="flex items-start space-x-3">
        {headline.isGain !== undefined && (
          <div className="flex-shrink-0 mt-1">
            {headline.isGain ? (
              <TrendingUp className="h-5 w-5 text-gain" />
            ) : (
              <TrendingDown className="h-5 w-5 text-loss" />
            )}
          </div>
        )}
        <div className="flex-grow">
          <h3 className="font-headline text-md font-medium leading-snug group-hover:text-primary transition-colors">
            {headline.title}
          </h3>
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
            <span>{headline.source}</span>
            <time dateTime={headline.publishedAt}>{timeSince(headline.publishedAt)}</time>
          </div>
        </div>
         <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
      </Link>
    </div>
  );
}
