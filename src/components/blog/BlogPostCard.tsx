import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "@/types";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, UserCircle, Bot } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface BlogPostCardProps {
  post: BlogPost;
  className?: string;
  orientation?: "vertical" | "horizontal";
  priority?: boolean; // For LCP image optimization
}

export function BlogPostCard({
  post,
  className,
  orientation = "vertical",
  priority = false,
}: BlogPostCardProps) {
  const formattedDate: string = new Date(post.publishedAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  const createTagSlug = (tag: string): string =>
    tag.toLowerCase().replace(/\s+/g, "-");

  return (
    <Card
      className={cn(
        "overflow-hidden hover:shadow-lg transition-all duration-300 ease-in-out group flex flex-col", // Always flex-col for consistent structure
        className,
        {
          "md:flex-row": orientation === "horizontal", // Horizontal layout on md+
        },
      )}
    >
      {post.imageUrl && (
        <div
          className={cn(
            "relative w-full shrink-0",
            orientation === "vertical"
              ? "aspect-video"
              : "md:aspect-auto md:w-1/3 lg:w-2/5 md:h-full",
            !post.imageUrl && "hidden", // Hide if no image
          )}
        >
          <Link href={`/blog/${post.slug}`} aria-label={post.title}>
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              sizes={
                orientation === "horizontal"
                  ? "(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw"
                  : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              }
              className="object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
              priority={priority}
              data-ai-hint={post.imageAiHint || "financial news"}
            />
          </Link>
        </div>
      )}
      <div
        className={cn(
          "flex flex-col flex-grow p-4 md:p-5", // Standardized padding
          orientation === "horizontal" && post.imageUrl ? "md:pl-5" : "",
        )}
      >
        <CardHeader className="p-0 pb-2">
          <Link href={`/category/${post.category.slug}`}>
            <Badge
              variant="secondary"
              className="mb-2 inline-block hover:bg-accent hover:text-accent-foreground transition-colors duration-200 ease-in-out text-xs px-2 py-0.5"
            >
              {post.category.name}
            </Badge>
          </Link>
          <CardTitle className="font-headline text-lg sm:text-xl md:text-xl leading-tight">
            <Link
              href={`/blog/${post.slug}`}
              className="hover:text-primary/80 transition-colors duration-200 ease-in-out"
            >
              {post.title}
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex-grow pt-1 pb-3">
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-3">
            {post.summary}
          </p>
        </CardContent>
        <CardFooter className="p-0 flex flex-wrap items-center justify-between text-xs text-muted-foreground gap-x-3 gap-y-1 pt-2 border-t border-border/60 mt-auto">
          <div className="flex items-center gap-1">
            {post.isAiGenerated ? (
              <Bot size={12} className="text-primary" />
            ) : (
              <UserCircle size={12} />
            )}
            <span className="truncate max-w-[100px] sm:max-w-none">
              {post.author}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <CalendarDays size={12} />
            <time dateTime={post.publishedAt}>{formattedDate}</time>
          </div>
        </CardFooter>
        {post.tags && post.tags.length > 0 && orientation === "vertical" && (
          <div className="p-0 pt-3 mt-auto">
            <div className="flex flex-wrap gap-1.5">
              {post.tags.slice(0, 3).map((tag: string) => (
                <Link key={tag} href={`/tags/${createTagSlug(tag)}`}>
                  <Badge variant="outline" className="text-xs px-1.5 py-0.5">
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
