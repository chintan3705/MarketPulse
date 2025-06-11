
"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
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
import { Loader2, Save, ExternalLink } from "lucide-react";
import type { MarketAuxNewsItem as IMOAuxNewsItem, Category } from "@/types";
import { categories } from "@/lib/data"; // Your static categories

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:9002";

const SaveBlogSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters."),
  summary: z.string().min(10, "Summary must be at least 10 characters."),
  content: z.string().min(20, "Content must be at least 20 characters."),
  categorySlug: z.string().min(1, "Category is required."),
  tags: z.string().refine(
    (val) => {
      const tagsArray = val.split(",").map((tag) => tag.trim()).filter(tag => tag.length > 0);
      return tagsArray.length > 0;
    },
    { message: "Please provide at least one tag, separated by commas." }
  ),
  author: z.string().min(2, "Author name is required."),
  imageUrl: z.string().url("Must be a valid URL if provided.").optional().or(z.literal("")),
  originalArticleUrl: z.string().url().optional(), // For reference
});

type SaveBlogFormValues = z.infer<typeof SaveBlogSchema>;

interface SaveMarketAuxToBlogDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newsItem: IMOAuxNewsItem;
  onPostSaved?: () => void; // Callback after successful save
}

export function SaveMarketAuxToBlogDialog({
  isOpen,
  onOpenChange,
  newsItem,
  onPostSaved,
}: SaveMarketAuxToBlogDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SaveBlogFormValues>({
    resolver: zodResolver(SaveBlogSchema),
    defaultValues: {
      title: "",
      summary: "",
      content: "",
      categorySlug: categories[0]?.slug || "",
      tags: "",
      author: "MarketPulse Curated",
      imageUrl: "",
      originalArticleUrl: newsItem?.url,
    },
  });

  useEffect(() => {
    if (newsItem) {
      const defaultContent = newsItem.description ? `${newsItem.description}\n\nRead the original article: ${newsItem.url}` : `Read the original article: ${newsItem.url}`;
      form.reset({
        title: newsItem.title || "",
        summary: newsItem.description || "",
        content: defaultContent,
        categorySlug: categories.find(cat => cat.name.toLowerCase() === "general")?.slug || categories[0]?.slug || "",
        tags: newsItem.source ? newsItem.source.toLowerCase().replace(/\s+/g, '-') : "", // Basic tag from source
        author: `MarketPulse (via ${newsItem.source || 'News Source'})`,
        imageUrl: newsItem.image_url || "",
        originalArticleUrl: newsItem.url,
      });
    }
  }, [newsItem, form, isOpen]); // Re-run if newsItem or isOpen changes

  const onSubmit = async (data: SaveBlogFormValues) => {
    setIsSubmitting(true);
    try {
      const tagsArray = data.tags.split(",").map((tag) => tag.trim()).filter(Boolean);
      const payload = {
        title: data.title,
        summary: data.summary,
        content: data.content,
        categorySlug: data.categorySlug,
        tags: tagsArray,
        author: data.author,
        imageUrl: data.imageUrl || undefined, // Ensure empty string becomes undefined if API expects that
        isAiGenerated: false, // This is curated, not AI-generated
        // publishedAt will be set by the server
      };

      const response = await fetch(
        `${SITE_URL}/api/admin/create-blog-from-marketaux`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || `Failed to save blog post: ${response.statusText}`,
        );
      }

      toast({
        title: "Blog Post Saved!",
        description: `"${result.post.title}" has been successfully created.`,
      });
      onOpenChange(false); // Close dialog
      if (onPostSaved) {
        onPostSaved(); // Trigger callback
      }
    } catch (error: unknown) {
      const catchedError = error as Error;
      toast({
        title: "Error Saving Post",
        description: catchedError.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!newsItem) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg md:max-w-xl lg:max-w-2xl w-[95vw]">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl flex items-center">
            <Save className="mr-2 h-5 w-5 text-primary" />
            Save News as Blog Post
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Review and edit the details from the MarketAux news item before saving it as a blog post. Original article:{" "}
            <a href={newsItem.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline items-center inline-flex">
                {newsItem.source} <ExternalLink size={12} className="ml-1"/>
            </a>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...form.register("title")} />
            {form.formState.errors.title && (
              <p className="text-xs text-destructive mt-1">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="summary">Summary</Label>
            <Textarea id="summary" {...form.register("summary")} rows={3} />
            {form.formState.errors.summary && (
              <p className="text-xs text-destructive mt-1">{form.formState.errors.summary.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="content">Content (HTML supported)</Label>
            <Textarea id="content" {...form.register("content")} rows={7} />
            {form.formState.errors.content && (
              <p className="text-xs text-destructive mt-1">{form.formState.errors.content.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="categorySlug">Category</Label>
              <Controller
                name="categorySlug"
                control={form.control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="categorySlug">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat: Category) => (
                        <SelectItem key={cat.id} value={cat.slug}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.categorySlug && (
                <p className="text-xs text-destructive mt-1">{form.formState.errors.categorySlug.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input id="tags" {...form.register("tags")} placeholder="e.g., market-update, finance, analysis" />
              {form.formState.errors.tags && (
                <p className="text-xs text-destructive mt-1">{form.formState.errors.tags.message}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="author">Author</Label>
              <Input id="author" {...form.register("author")} />
              {form.formState.errors.author && (
                <p className="text-xs text-destructive mt-1">{form.formState.errors.author.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="imageUrl">Image URL (Optional)</Label>
              <Input id="imageUrl" {...form.register("imageUrl")} placeholder="https://example.com/image.jpg"/>
              {form.formState.errors.imageUrl && (
                <p className="text-xs text-destructive mt-1">{form.formState.errors.imageUrl.message}</p>
              )}
            </div>
          </div>
          
          {form.watch("imageUrl") && (
             <div className="mt-2">
                <Label className="text-xs text-muted-foreground">Image Preview:</Label>
                 <img
                    src={form.watch("imageUrl")}
                    alt="Preview"
                    className="mt-1 rounded-md border max-h-32 object-contain"
                    />
            </div>
           )}


          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Post
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
