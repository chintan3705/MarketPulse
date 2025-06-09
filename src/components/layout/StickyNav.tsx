"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface StickyNavProps {
  categories: Category[];
}

export function StickyNav({ categories }: StickyNavProps) {
  const pathname = usePathname();

  // In a real app, this might come from a global state or context if category pages exist
  const currentCategorySlug = pathname.split("/category/")[1]?.split("/")[0];

  return (
    <nav className="sticky top-16 z-30 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/50 shadow-sm">
      <div className="container px-0 sm:px-auto">
        <ScrollArea className="whitespace-nowrap">
          <div className="flex items-center h-12 space-x-2 sm:space-x-4 px-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`} // Assuming category pages exist at this path
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground whitespace-nowrap",
                  currentCategorySlug === category.slug
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                    : "text-foreground/80 hover:text-foreground",
                )}
              >
                {category.name}
              </Link>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </nav>
  );
}
