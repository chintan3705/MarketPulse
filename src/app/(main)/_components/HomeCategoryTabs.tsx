import Link from "next/link";
import { categories } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tag } from "lucide-react";

export function HomeCategoryTabs() {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="py-6 md:py-10 bg-card border-y">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-4 md:mb-6">
          <Tag className="h-5 w-5 md:h-6 md:w-6 text-primary" />
          <h2 className="font-headline text-lg sm:text-xl md:text-2xl font-bold">
            Browse by Category
          </h2>
        </div>
        <ScrollArea className="whitespace-nowrap rounded-md -mx-4 sm:-mx-0">
          <div className="flex space-x-2 sm:space-x-3 px-4 sm:px-0 pb-3">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant="outline"
                size="sm"
                asChild
                className="shadow-sm hover:shadow-md transition-shadow text-xs sm:text-sm"
              >
                <Link href={`/category/${category.slug}`}>{category.name}</Link>
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </section>
  );
}
