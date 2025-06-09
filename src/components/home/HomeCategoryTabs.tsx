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
    <section className="py-8 md:py-12 bg-card border-y">
      <div className="container">
        <div className="flex items-center gap-2 mb-6">
          <Tag className="h-6 w-6 text-primary" />
          <h2 className="font-headline text-xl sm:text-2xl md:text-3xl font-bold">
            Browse by Category
          </h2>
        </div>
        <ScrollArea className="whitespace-nowrap rounded-md">
          <div className="flex space-x-3 pb-3">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant="outline"
                asChild
                className="shadow-sm hover:shadow-md transition-shadow"
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
