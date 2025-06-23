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
import {
  Loader2,
  Save,
  ExternalLink,
  Wand2,
  Image as ImageIcon,
  FileText,
} from "lucide-react";
import type { MarketAuxNewsItem as IMOAuxNewsItem, Category } from "@/types";
import { categories } from "@/lib/data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:9002";

const SaveBlogSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters."),
  summary: z.string().min(10, "Summary must be at least 10 characters."),
  content: z.string().min(20, "Content must be at least 20 characters."),
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
  author: z.string().min(2, "Author name is required."),
  imageUrl: z
    .string()
    .url("Must be a valid URL if provided.")
    .optional()
    .or(z.literal("")),
  imageAiHint: z.string().optional(),
  originalArticleUrl: z.string().url().optional(),
});

type SaveBlogFormValues = z.infer<typeof SaveBlogSchema>;

interface SaveMarketAuxToBlogDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newsItem: IMOAuxNewsItem;
  onPostSaved?: () => void;
}

export function SaveMarketAuxToBlogDialog({
  isOpen,
  onOpenChange,
  newsItem,
  onPostSaved,
}: SaveMarketAuxToBlogDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegeneratingSummary, setIsRegeneratingSummary] = useState(false);
  const [isRegeneratingTags, setIsRegeneratingTags] = useState(false);
  const [isRegeneratingImage, setIsRegeneratingImage] = useState(false);
  const [isRegeneratingContent, setIsRegeneratingContent] = useState(false);

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
      imageAiHint: "",
      originalArticleUrl: newsItem?.url,
    },
  });

  useEffect(() => {
    if (newsItem && isOpen) {
      // Reset form when dialog opens with new item
      const defaultContent = newsItem.description
        ? `<p>${newsItem.description}</p><p><br></p><p><em>Read the original article on <a href="${newsItem.url}" target="_blank" rel="noopener noreferrer">${newsItem.source}</a>.</em></p>`
        : `<p><em>Read the original article on <a href="${newsItem.url}" target="_blank" rel="noopener noreferrer">${newsItem.source}</a>.</em></p>`;
      const initialTags = newsItem.source
        ? newsItem.source
            .toLowerCase()
            .replace(/\s+/g, "-")
            .split(" ")
            .join(",")
        : "";
      form.reset({
        title: newsItem.title || "",
        summary: newsItem.description || "",
        content: defaultContent,
        categorySlug:
          categories.find((cat) => cat.slug === "general")?.slug ||
          categories[0]?.slug ||
          "",
        tags: initialTags,
        author: `MarketPulse (via ${newsItem.source || "News Source"})`,
        imageUrl: newsItem.image_url || "",
        imageAiHint: newsItem.title.substring(0, 30) || "financial news",
        originalArticleUrl: newsItem.url,
      });
    }
  }, [newsItem, form, isOpen]);

  const anyRegenInProgress =
    isRegeneratingSummary ||
    isRegeneratingTags ||
    isRegeneratingImage ||
    isRegeneratingContent;

  const handleRegenerateSummary = async () => {
    setIsRegeneratingSummary(true);
    try {
      const { title, content, summary: existingSummary } = form.getValues();
      const response = await fetch(`${SITE_URL}/api/admin/regenerate/summary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          currentContent: content,
          existingSummary,
        }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Failed to regenerate summary");
      form.setValue("summary", result.newSummary, { shouldValidate: true });
      toast({
        title: "Summary Regenerated",
        description: "AI has updated the summary.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: (err as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsRegeneratingSummary(false);
    }
  };

  const handleRegenerateTags = async () => {
    setIsRegeneratingTags(true);
    try {
      const { title, summary, content } = form.getValues();
      const response = await fetch(`${SITE_URL}/api/admin/regenerate/tags`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, summary, currentContent: content }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Failed to regenerate tags");
      form.setValue("tags", result.newTags.join(", "), {
        shouldValidate: true,
      });
      toast({
        title: "Tags Regenerated",
        description: "AI has updated the tags.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: (err as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsRegeneratingTags(false);
    }
  };

  const handleRegenerateImage = async () => {
    setIsRegeneratingImage(true);
    try {
      const { title, summary, tags, categorySlug } = form.getValues();
      const currentTagsArray = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      const categoryName = categories.find(
        (c) => c.slug === categorySlug,
      )?.name;

      const response = await fetch(`${SITE_URL}/api/admin/regenerate/image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          summary,
          currentTags: currentTagsArray,
          categoryName,
        }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Failed to regenerate image");
      form.setValue("imageUrl", result.newImageUrl, { shouldValidate: true });
      form.setValue(
        "imageAiHint",
        result.newImageAiHint || title.substring(0, 30),
      );
      toast({
        title: "Image Regenerated",
        description: "AI has generated a new image.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: (err as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsRegeneratingImage(false);
    }
  };

  const handleRegenerateContent = async () => {
    setIsRegeneratingContent(true);
    try {
      const { title, summary, content: existingContent } = form.getValues();
      const response = await fetch(`${SITE_URL}/api/admin/regenerate/content`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, summary, existingContent }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Failed to regenerate content");
      form.setValue("content", result.newContent, { shouldValidate: true });
      toast({
        title: "Content Regenerated",
        description: "AI has generated new content.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: (err as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsRegeneratingContent(false);
    }
  };

  const onSubmit = async (data: SaveBlogFormValues) => {
    setIsSubmitting(true);
    try {
      const tagsArray = data.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
      const payload = {
        ...data,
        tags: tagsArray,
        imageUrl: data.imageUrl || undefined,
        imageAiHint: data.imageAiHint || data.title.substring(0, 30),
        isAiGenerated: false,
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
      onOpenChange(false);
      if (onPostSaved) onPostSaved();
    } catch (error: unknown) {
      toast({
        title: "Error Saving Post",
        description: (error as Error).message,
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
            Curate News as Blog Post
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Review, edit, and use AI to enhance details from the MarketAux news
            item. Original:{" "}
            <a
              href={newsItem.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline items-center inline-flex"
            >
              {newsItem.source} <ExternalLink size={12} className="ml-1" />
            </a>
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 max-h-[70vh] overflow-y-auto pr-2"
        >
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...form.register("title")} />
            {form.formState.errors.title && (
              <p className="text-xs text-destructive mt-1">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <Label htmlFor="summary">Summary</Label>
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={handleRegenerateSummary}
                disabled={anyRegenInProgress}
              >
                {isRegeneratingSummary ? (
                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                ) : (
                  <Wand2 className="h-3 w-3 mr-1" />
                )}{" "}
                Regen AI
              </Button>
            </div>
            <Textarea id="summary" {...form.register("summary")} rows={3} />
            {form.formState.errors.summary && (
              <p className="text-xs text-destructive mt-1">
                {form.formState.errors.summary.message}
              </p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <Label htmlFor="content">Content (HTML supported)</Label>
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={handleRegenerateContent}
                disabled={anyRegenInProgress}
              >
                {isRegeneratingContent ? (
                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                ) : (
                  <FileText className="h-3 w-3 mr-1" />
                )}{" "}
                Regen AI
              </Button>
            </div>
            <Textarea id="content" {...form.register("content")} rows={10} />
            {form.formState.errors.content && (
              <p className="text-xs text-destructive mt-1">
                {form.formState.errors.content.message}
              </p>
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
                <p className="text-xs text-destructive mt-1">
                  {form.formState.errors.categorySlug.message}
                </p>
              )}
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  onClick={handleRegenerateTags}
                  disabled={anyRegenInProgress}
                >
                  {isRegeneratingTags ? (
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  ) : (
                    <Wand2 className="h-3 w-3 mr-1" />
                  )}{" "}
                  Regen AI
                </Button>
              </div>
              <Input
                id="tags"
                {...form.register("tags")}
                placeholder="e.g., market-update, finance"
              />
              {form.formState.errors.tags && (
                <p className="text-xs text-destructive mt-1">
                  {form.formState.errors.tags.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="author">Author</Label>
              <Input id="author" {...form.register("author")} />
              {form.formState.errors.author && (
                <p className="text-xs text-destructive mt-1">
                  {form.formState.errors.author.message}
                </p>
              )}
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <Label htmlFor="imageUrl">Image URL (Optional)</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  onClick={handleRegenerateImage}
                  disabled={anyRegenInProgress}
                >
                  {isRegeneratingImage ? (
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  ) : (
                    <ImageIcon className="h-3 w-3 mr-1" />
                  )}{" "}
                  Regen AI
                </Button>
              </div>
              <Input
                id="imageUrl"
                {...form.register("imageUrl")}
                placeholder="https://example.com/image.jpg"
              />
              {form.formState.errors.imageUrl && (
                <p className="text-xs text-destructive mt-1">
                  {form.formState.errors.imageUrl.message}
                </p>
              )}
            </div>
          </div>

          {form.watch("imageUrl") && (
            <div className="mt-2">
              <Label className="text-xs text-muted-foreground">
                Image Preview:
              </Label>
              <img
                src={form.watch("imageUrl")!}
                alt="Preview"
                className="mt-1 rounded-md border max-h-32 object-contain"
                onError={(e) => (e.currentTarget.style.display = "none")} // Hide if image fails to load
                onLoad={(e) => (e.currentTarget.style.display = "block")}
              />
            </div>
          )}
          <Input type="hidden" {...form.register("imageAiHint")} />

          <DialogFooter className="pt-4 sticky bottom-0 bg-background pb-2">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting || anyRegenInProgress}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting || anyRegenInProgress}>
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
