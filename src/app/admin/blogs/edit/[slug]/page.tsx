
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import type { BlogPost, Category } from "@/types";
import { categories } from "@/lib/data"; 

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:9002";

const EditBlogPostSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long."),
  summary: z.string().min(10, "Summary must be at least 10 characters long."),
  content: z.string().min(50, "Content must be at least 50 characters long."),
  categorySlug: z.string().min(1, "Category is required."),
  tags: z.string().refine(
    (val) => {
      const tagsArray = val.split(",").map((tag) => tag.trim());
      return tagsArray.length > 0 && tagsArray.every((tag) => tag.length > 0);
    },
    { message: "Please provide at least one tag, separated by commas." },
  ),
  imageUrl: z
    .string()
    .url("Please enter a valid URL.")
    .optional()
    .or(z.literal("")).nullable(),
  imageAiHint: z.string().optional().nullable(),
});

type EditBlogPostFormValues = z.infer<typeof EditBlogPostSchema>;

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [post, setPost] = useState<BlogPost | null>(null);

  const form = useForm<EditBlogPostFormValues>({
    resolver: zodResolver(EditBlogPostSchema),
    defaultValues: {
      title: "",
      summary: "",
      content: "",
      categorySlug: "",
      tags: "",
      imageUrl: "",
      imageAiHint: "",
    },
  });

  useEffect(() => {
    if (slug) {
      const fetchPost = async () => {
        setIsLoading(true);
        try {
          const res = await fetch(`${SITE_URL}/api/posts/${slug}`);
          if (!res.ok) {
            throw new Error(
              `Failed to fetch post: ${res.status} ${await res.text()}`,
            );
          }
          const postData: BlogPost = (await res.json()) as BlogPost;
          setPost(postData);
          form.reset({
            title: postData.title,
            summary: postData.summary,
            content: postData.content,
            categorySlug: postData.categorySlug,
            tags: postData.tags.join(", "),
            imageUrl: postData.imageUrl || "",
            imageAiHint: postData.imageAiHint || "",
          });
        } catch (error: unknown) {
          const catchedError = error as Error;
          toast({
            title: "Error fetching post",
            description: catchedError.message,
            variant: "destructive",
          });
          router.push("/admin/blogs");
        } finally {
          setIsLoading(false);
        }
      };
      void fetchPost();
    }
  }, [slug, toast, router, form]);

  const onSubmit: SubmitHandler<EditBlogPostFormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      const tagsArray = data.tags.split(",").map((tag) => tag.trim()).filter(tag => tag.length > 0);
      const payload = {
        ...data,
        tags: tagsArray,
        imageUrl: data.imageUrl || null, // Ensure empty string becomes null if API expects that
        imageAiHint: data.imageAiHint || null,
      };

      const response = await fetch(`${SITE_URL}/api/posts/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorResult = await response
          .json()
          .catch(() => ({ message: `Server error: ${response.status}` }));
        throw new Error(
          errorResult.message ||
            `Failed to update post: ${response.statusText}`,
        );
      }

      const updatedPost = (await response.json()) as BlogPost;

      toast({
        title: "Post Updated!",
        description: `"${updatedPost.title}" has been successfully updated.`,
      });
      router.push("/admin/blogs"); 
      router.refresh(); 
    } catch (error: unknown) {
      const catchedError = error as Error;
      toast({
        title: "Error updating post",
        description: catchedError.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Loading post data...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-muted-foreground">Post not found.</p>
        <Button asChild className="mt-4">
          <Link href="/admin/blogs">Back to Blogs</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-slide-in">
      <div className="mb-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/blogs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blogs
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">
            Edit Blog Post: <span className="text-primary">{post.title}</span>
          </CardTitle>
          <CardDescription>
            Modify the details of the blog post.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...form.register("title")} />
              {form.formState.errors.title && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary">Summary</Label>
              <Textarea id="summary" {...form.register("summary")} rows={3} />
              {form.formState.errors.summary && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.summary.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content (HTML)</Label>
              <Textarea id="content" {...form.register("content")} rows={10} />
              {form.formState.errors.content && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.content.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="categorySlug">Category</Label>
                <Controller
                  name="categorySlug"
                  control={form.control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger id="categorySlug">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat: Category) => (
                          <SelectItem key={cat.slug} value={cat.slug}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {form.formState.errors.categorySlug && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.categorySlug.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input id="tags" {...form.register("tags")} />
                {form.formState.errors.tags && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.tags.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL (Optional)</Label>
                <Input
                  id="imageUrl"
                  {...form.register("imageUrl")}
                  placeholder="https://example.com/image.png"
                />
                {form.formState.errors.imageUrl && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.imageUrl.message}
                  </p>
                )}
                {form.watch("imageUrl") && (
                  <div className="mt-2">
                    <Label className="text-xs text-muted-foreground">
                      Image Preview:
                    </Label>
                    <img
                      src={form.watch("imageUrl")!}
                      alt="Preview"
                      className="mt-1 rounded-md border max-h-40 object-contain"
                    />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageAiHint">Image AI Hint (Optional)</Label>
                <Input
                  id="imageAiHint"
                  {...form.register("imageAiHint")}
                  placeholder="e.g., stock market graph"
                />
                {form.formState.errors.imageAiHint && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.imageAiHint.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/blogs")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || isLoading}>
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
