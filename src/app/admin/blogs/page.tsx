
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit3, Trash2, Eye } from "lucide-react";
import { GenerateBlogDialog } from "@/app/admin/blogs/_components/GenerateBlogDialog";
import { GenerateMultipleBlogsDialog } from "@/app/admin/blogs/_components/GenerateMultipleBlogsDialog";
import type { BlogPost } from "@/types";
import { unstable_noStore as noStore } from "next/cache";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:9002";

async function fetchAdminPosts(): Promise<BlogPost[]> {
  noStore();
  try {
    const res = await fetch(`${SITE_URL}/api/posts`, { cache: "no-store" });
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Admin: Failed to fetch posts: ${res.status} ${errorText}`);
      return [];
    }
    const data = (await res.json()) as { posts: BlogPost[] };
    return data.posts || [];
  } catch (error) {
    console.error("Admin: Error fetching posts from API:", error);
    return [];
  }
}

export default async function AdminBlogsPage() {
  const posts = await fetchAdminPosts();

  return (
    <div
      className="animate-slide-in"
      style={{ animationDelay: "0.1s", animationFillMode: "backwards" }}
    >
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-3 sm:gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold font-headline text-center sm:text-left">
          Manage Blogs
        </h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <GenerateBlogDialog />
          <GenerateMultipleBlogsDialog />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl md:text-2xl">
            Blog Posts from Database
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            A list of all blog posts. Editing and Deleting are placeholders. Use
            generation buttons to create new content.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table className="min-w-[700px]"> {/* Added min-width here */}
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden sm:table-cell">
                  Category
                </TableHead>
                <TableHead className="hidden lg:table-cell">Author</TableHead>
                <TableHead className="hidden lg:table-cell">
                  Published At
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post._id || post.slug}>
                  <TableCell className="font-medium text-sm">
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary/80 transition-colors duration-200 ease-in-out line-clamp-2"
                      title={post.title}
                    >
                      {post.title}
                    </Link>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-xs">
                    <Badge variant="outline" className="whitespace-nowrap">
                      {post.categoryName || post.category?.name || "N/A"}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-xs">
                    {post.author}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-xs">
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-right space-x-1 sm:space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      asChild
                      title="View live post"
                      className="h-8 w-8 sm:h-9 sm:w-9"
                    >
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      disabled
                      title="Edit (Placeholder)"
                      className="hidden sm:inline-flex h-8 w-8 sm:h-9 sm:w-9"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      disabled
                      title="Delete (Placeholder)"
                      className="hidden sm:inline-flex h-8 w-8 sm:h-9 sm:w-9"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {posts.length === 0 && (
        <p className="text-center text-muted-foreground mt-6 text-sm sm:text-base">
          No blog posts found in the database.
        </p>
      )}
    </div>
  );
}
