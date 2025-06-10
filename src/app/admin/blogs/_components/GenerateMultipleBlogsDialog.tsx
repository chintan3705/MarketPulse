
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
  CopyPlus,
  Wand2,
  DatabaseZap,
  AlertTriangle,
  ListChecks,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { categories } from "@/lib/data";
import type { GenerateBlogPostOutput } from "@/ai/schemas/blog-post-schemas";

interface SavedPostInfo {
  title: string;
  slug: string;
}

export function GenerateMultipleBlogsDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [count, setCount] = useState<number>(3);
  const [topics, setTopics] = useState<string>(""); // Comma-separated or one per line
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>("ai-choose-per-post");
  const [savedPosts, setSavedPosts] = useState<SavedPostInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (count < 1 || count > 10) {
      toast({
        title: "Error",
        description: "Number of posts must be between 1 and 10.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setSavedPosts([]);
    setError(null);

    const topicsArray = topics.split("\n").map(t => t.trim()).filter(t => t.length > 0);

    try {
      const response = await fetch("/api/admin/generate-multiple-blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          count,
          topics: topicsArray.length > 0 ? topicsArray : undefined,
          categorySlug: selectedCategorySlug === "ai-choose-per-post" ? undefined : selectedCategorySlug,
        }),
      });

      if (!response.ok) {
        const errorResult = await response.json().catch(() => ({ message: `Server error: ${response.status}` }));
        throw new Error(errorResult.message || `Failed to generate posts: ${response.statusText}`);
      }

      const result = (await response.json()) as { message: string; posts: SavedPostInfo[] };
      setSavedPosts(result.posts || []);
      toast({
        title: "Blog Posts Processed!",
        description: result.message || `${result.posts?.length || 0} posts generated and saved.`,
        duration: 7000,
      });
    } catch (err) {
      const catchedError = err as Error;
      console.error("Error generating multiple blog posts:", catchedError);
      setError(catchedError.message || "An unexpected error occurred.");
      toast({
        title: "Error Generating Multiple Blog Posts",
        description: catchedError.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(openState) => {
        setIsOpen(openState);
        if (!openState) {
          setSavedPosts([]);
          setError(null);
          // Reset form fields if needed
          // setCount(3);
          // setTopics("");
          // setSelectedCategorySlug("ai-choose-per-post");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <CopyPlus className="mr-2 h-4 w-4" /> Generate Multiple
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[90vw] sm:max-w-md md:max-w-lg lg:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center text-lg sm:text-xl">
            <Wand2 className="mr-2 h-5 w-5 text-primary" />
            Generate Multiple AI Blog Posts
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Specify the number of posts, optional topics (one per line), and an optional global category.
            AI will generate posts and save them to the database. Max 10 posts.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-1.5">
              <Label htmlFor="count" className="text-sm">Number of Posts (1-10)</Label>
              <Input
                id="count"
                type="number"
                value={count}
                onChange={(e) => setCount(Math.max(1, Math.min(10, parseInt(e.target.value, 10) || 1)))}
                min="1"
                max="10"
                className="text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="topics" className="text-sm">Topics (Optional, one per line)</Label>
              <Textarea
                id="topics"
                value={topics}
                onChange={(e) => setTopics(e.target.value)}
                placeholder="e.g., Future of AI in Finance\nImpact of Interest Rates on Stocks"
                className="text-sm h-24"
              />
              <p className="text-xs text-muted-foreground">If empty, AI will generate diverse financial topics.</p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="category" className="text-sm">Global Category (Optional)</Label>
              <Select
                value={selectedCategorySlug}
                onValueChange={setSelectedCategorySlug}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Let AI choose category per post" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ai-choose-per-post" className="text-sm">
                    Let AI choose category per post
                  </SelectItem>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.slug}
                      value={category.slug}
                      className="text-sm"
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="mt-4 sm:mt-6 flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isLoading} size="sm" className="w-full sm:w-auto">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading} size="sm" className="w-full sm:w-auto">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <DatabaseZap className="mr-2 h-4 w-4" />
              )}
              Generate &amp; Save Multiple
            </Button>
          </DialogFooter>
        </form>

        {error && !isLoading && (
          <Card className="mt-4 sm:mt-6 border-destructive bg-destructive/10">
            <CardHeader className="p-3 sm:p-4">
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle size={18} />
                <CardTitle className="text-sm sm:text-base">Generation/Save Failed</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 pt-0">
              <p className="text-xs sm:text-sm text-destructive-foreground">{error}</p>
            </CardContent>
          </Card>
        )}

        {savedPosts.length > 0 && !isLoading && !error && (
          <Card className="mt-4 sm:mt-6 border-green-500 bg-green-500/10">
            <CardHeader className="p-3 sm:p-4">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <ListChecks size={18} />
                <CardTitle className="text-sm sm:text-base">Successfully Generated Posts!</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-1 text-xs sm:text-sm p-3 sm:p-4 pt-0 max-h-48 overflow-y-auto">
              <p className="mb-2">{savedPosts.length} post(s) processed:</p>
              <ul className="list-disc list-inside space-y-0.5">
                {savedPosts.map((post) => (
                  <li key={post.slug}>
                    <strong>{post.title}</strong> (
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      View
                    </Link>
                    )
                  </li>
                ))}
              </ul>
               <Button
                variant="outline"
                size="sm"
                className="mt-3 text-xs"
                onClick={() => {
                  setSavedPosts([]);
                  setTopics("");
                  // Optionally reset other fields or close dialog
                  // setIsOpen(false);
                }}
              >
                Generate More
              </Button>
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
}
