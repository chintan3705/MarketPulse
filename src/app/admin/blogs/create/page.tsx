
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
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
import { ArrowLeft, Loader2, Save, FileText } from "lucide-react";
import type { Category } from "@/types";
import { categories } from "@/lib/data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:9002";

// Schema for creating a manual blog post
const CreateManualBlogPostSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long."),
  summary: z.string().min(10, "Summary must be at least 10 characters long."),
  content: z.string().min(50, "Content must be at least 50 characters long."),
  categorySlug: z.string().min(1, "Category is required."),
  tags: z.string().refine(
    (val) => {
      const tagsArray = val
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
      return tagsArray.length > 0;
    },
    { message: "Please provide at least one tag, separated by commas." },
  ),
  author: z.string().min(2, "Author name must be at least 2 characters long."),
  imageUrl: z
    .string()
    .url("Please enter a valid URL if providing an image.")
    .optional()
    .or(z.literal("")),
  imageAiHint: z.string().optional(),
});

type CreateManualBlogPostFormValues = z.infer<
  typeof CreateManualBlogPostSchema
>;

export default function CreateManualBlogPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateManualBlogPostFormValues>({
    resolver: zodResolver(CreateManualBlogPostSchema),
    defaultValues: {
      title: "",
      summary: "",
      content: "",
      categorySlug: categories[0]?.slug || "", 
      tags: "",
      author: "Admin", 
      imageUrl: "",
      imageAiHint: "",
    },
  });

  const onSubmit: SubmitHandler<CreateManualBlogPostFormValues> = async (
    data,
  ) => {
    setIsSubmitting(true);
    try {
      const tagsArray = data.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
      const payload = {
        ...data,
        tags: tagsArray,
      };

      const response = await fetch(`${SITE_URL}/api/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorResult = await response
          .json()
          .catch(() => ({ message: `Server error: ${response.status}` }));
        throw new Error(
          errorResult.message ||
            `Failed to create post: ${response.statusText}`,
        );
      }

      const createdPost = await response.json();

      toast({
        title: "Post Created!",
        description: `"${createdPost.title}" has been successfully created.`,
      });
      router.push("/admin/blogs");
      router.refresh(); 
    } catch (error: unknown) {
      const catchedError = error as Error;
      toast({
        title: "Error creating post",
        description: catchedError.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <CardTitle className="text-xl md:text-2xl flex items-center">
            <FileText className="mr-2 h-6 w-6 text-primary" />
            Create Manual Blog Post
          </CardTitle>
          <CardDescription>
            Fill in the details to create a new blog post manually.
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
              <Textarea
                id="content"
                {...form.register("content")}
                rows={10}
                placeholder="Enter HTML content for the blog post..."
              />
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
                <Input
                  id="tags"
                  {...form.register("tags")}
                  placeholder="e.g., finance, stocks, update"
                />
                {form.formState.errors.tags && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.tags.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input id="author" {...form.register("author")} />
                {form.formState.errors.author && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.author.message}
                  </p>
                )}
              </div>
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
                      src={form.watch("imageUrl")}
                      alt="Preview"
                      className="mt-1 rounded-md border max-h-40 object-contain"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2 md:w-1/2 pr-0 md:pr-3">
              <Label htmlFor="imageAiHint">Image AI Hint (Optional)</Label>
              <Input
                id="imageAiHint"
                {...form.register("imageAiHint")}
                placeholder="e.g., abstract financial graph"
              />
              {form.formState.errors.imageAiHint && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.imageAiHint.message}
                </p>
              )}
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
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Create Post
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
