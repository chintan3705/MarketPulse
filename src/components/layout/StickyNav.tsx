"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface StickyNavProps {
  categories: Category[];
}

export function StickyNav({ categories }: StickyNavProps) {
  const pathname = usePathname();

  const currentCategorySlug = pathname.split("/category/")[1]?.split("/")[0];

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <nav className="sticky top-14 z-30 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container px-0 sm:px-4">
        <ScrollArea className="whitespace-nowrap">
          <div className="flex items-center h-11 space-x-1 sm:space-x-2 px-2 sm:px-0">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className={cn(
                  "px-2.5 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors duration-200 ease-in-out hover:bg-primary/10 hover:text-accent-foreground whitespace-nowrap",
                  currentCategorySlug === category.slug
                    ? "bg-primary/20 text-primary hover:bg-primary/20 hover:text-primary"
                    : "text-foreground/70 hover:text-primary/90",
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
