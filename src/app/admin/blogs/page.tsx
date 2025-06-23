"use client";

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
import {
  Edit3,
  Trash2,
  Eye,
  Loader2,
  AlertTriangle,
  FileText,
} from "lucide-react";
import { GenerateBlogDialog } from "./_components/GenerateBlogDialog";
import { GenerateMultipleBlogsDialog } from "./_components/GenerateMultipleBlogsDialog";
import type { BlogPost } from "@/types";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:9002";

async function fetchAdminPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${SITE_URL}/api/posts`, { cache: "no-store" });
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Admin: Failed to fetch posts: ${res.status} ${errorText}`);
      return [];
    }
    const data = (await res.json()) as { posts: BlogPost[] };
    return data.posts || [];
  } catch (error: unknown) {
    const catchedError = error as Error;
    console.error(
      "Admin: Error fetching posts from API:",
      catchedError.message,
    );
    return [];
  }
}

export default function AdminBlogsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);

  const router = useRouter();
  const { toast } = useToast();

  const loadPosts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedPosts = await fetchAdminPosts();
      setPosts(fetchedPosts);
    } catch (err: unknown) {
      const catchedError = err as Error;
      setError(
        catchedError.message || "Failed to load posts. Please try again.",
      );
      console.error(catchedError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPosts();
  }, [loadPosts]);

  const handleDeleteClick = (post: BlogPost) => {
    setPostToDelete(post);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!postToDelete) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/posts/${postToDelete.slug}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Failed to delete post" }));
        throw new Error(
          errorData.message || `Server error: ${response.status}`,
        );
      }
      toast({
        title: "Post Deleted",
        description: `"${postToDelete.title}" has been successfully deleted.`,
      });
      setShowDeleteConfirm(false);
      setPostToDelete(null);
      setPosts((prevPosts) =>
        prevPosts.filter((p) => p.slug !== postToDelete.slug),
      );
    } catch (err: unknown) {
      const catchedError = err as Error;
      toast({
        title: "Error Deleting Post",
        description: catchedError.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
        <p className="mt-4 text-lg font-semibold text-destructive-foreground">
          Error loading posts
        </p>
        <p className="text-sm text-muted-foreground">{error}</p>
        <Button onClick={loadPosts} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

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
          <Button size="sm" asChild>
            <Link href="/admin/blogs/create">
              <FileText className="mr-2 h-4 w-4" /> Create Manual Post
            </Link>
          </Button>
          <GenerateBlogDialog />
          <GenerateMultipleBlogsDialog />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl md:text-2xl">
            Blog Posts
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            A list of all blog posts from the database.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative w-full overflow-auto">
            <Table className="min-w-[700px]">
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
                        title="Edit Post"
                        className="h-8 w-8 sm:h-9 sm:w-9"
                        asChild
                      >
                        <Link href={`/admin/blogs/edit/${post.slug}`}>
                          <Edit3 className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        title="Delete Post"
                        className="h-8 w-8 sm:h-9 sm:w-9"
                        onClick={() => handleDeleteClick(post)}
                        disabled={
                          isDeleting && postToDelete?.slug === post.slug
                        }
                      >
                        {isDeleting && postToDelete?.slug === post.slug ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      {posts.length === 0 && !isLoading && (
        <p className="text-center text-muted-foreground mt-6 text-sm sm:text-base">
          No blog posts found in the database.
        </p>
      )}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              blog post titled &quot;{postToDelete?.title}&quot; and remove its
              data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setShowDeleteConfirm(false);
                setPostToDelete(null);
              }}
              disabled={isDeleting}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
