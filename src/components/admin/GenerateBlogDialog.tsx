
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
  PlusCircle,
  Wand2,
  DatabaseZap,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { IMongoBlogPost } from "@/models/BlogPost";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { categories } from "@/lib/data"; // Import categories for the dropdown

type SavedPostData = Pick<
  IMongoBlogPost,
  | "_id"
  | "title"
  | "slug"
  | "summary"
  | "content"
  | "imageUrl"
  | "imageAiHint"
  | "categorySlug"
  | "tags"
  | "categoryName"
  | "author"
  | "publishedAt"
  | "isAiGenerated"
>;

export function GenerateBlogDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [topic, setTopic] = useState("");
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<
    string | undefined
  >(undefined);
  const [savedPostData, setSavedPostData] = useState<SavedPostData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!topic.trim()) {
      toast({
        title: "Error",
        description: "Please enter a topic for the blog post.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setSavedPostData(null);
    setError(null);

    try {
      const response = await fetch("/api/admin/generate-blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ topic, categorySlug: selectedCategorySlug }),
      });

      if (!response.ok) {
        let serverErrorMessage = `Server error: ${response.status} ${response.statusText}`;
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
          try {
            const errorResult = (await response.json()) as {
              message?: string;
              error?: string;
              errors?: unknown;
            };
            serverErrorMessage =
              errorResult.message || errorResult.error || serverErrorMessage;
          } catch (jsonError) {
            console.error("Failed to parse error response JSON:", jsonError);
            // serverErrorMessage will remain as the initial HTTP status error
          }
        } else {
          // If not JSON, try to get text for more context, but limit its length.
          const textResponse = await response.text();
          console.error(
            "Server returned non-JSON error response:",
            textResponse.substring(0, 500), // Log more of the response
          );
          serverErrorMessage = `Server returned an unexpected response (not JSON). Check console for details. Status: ${response.status}`;
        }
        throw new Error(serverErrorMessage);
      }

      const result = (await response.json()) as {
        message: string;
        post?: SavedPostData;
      };

      if (!result.post) {
        throw new Error(
          result.message ||
            "Failed to generate and save blog post: No post data returned.",
        );
      }

      setSavedPostData(result.post);
      toast({
        title: "Blog Post Generated & Saved to DB!",
        description: `"${result.post.title}" has been saved. It will appear on the site.`,
        duration: 7000,
      });
    } catch (err) {
      const catchedError = err as Error;
      console.error("Error in handleSubmit for blog generation:", catchedError);
      const errorMessage =
        catchedError.message || "An unexpected error occurred.";
      setError(errorMessage);
      toast({
        title: "Error Generating Blog Post",
        description: errorMessage,
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
          setSavedPostData(null);
          setError(null);
          // setTopic(""); // Optionally reset topic on close
          // setSelectedCategorySlug(undefined); // Optionally reset category
        }
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Generate & Save Blog
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Wand2 className="mr-2 h-5 w-5 text-primary" />
            Generate &amp; Save AI Blog Post to Database
          </DialogTitle>
          <DialogDescription>
            Enter a topic and optionally select a category. AI will generate a
            blog post and save it to the database.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="topic" className="text-right">
                Topic
              </Label>
              <Input
                id="topic"
                value={topic}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTopic(e.target.value)
                }
                className="col-span-3"
                placeholder="e.g., Future of Renewable Energy Stocks"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select
                value={selectedCategorySlug}
                onValueChange={setSelectedCategorySlug}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Let AI choose category (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ai-choose">
                    Let AI choose category
                  </SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.slug} value={category.slug}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isLoading}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading || !topic.trim()}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <DatabaseZap className="mr-2 h-4 w-4" />
              )}
              Generate &amp; Save
            </Button>
          </DialogFooter>
        </form>

        {error && !isLoading && (
          <Card className="mt-6 border-destructive bg-destructive/10">
            <CardHeader>
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle size={20} />
                <CardTitle className="text-lg">
                  Generation/Save Failed
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-destructive-foreground">{error}</p>
            </CardContent>
          </Card>
        )}

        {savedPostData && !isLoading && !error && (
          <Card className="mt-6 border-green-500 bg-green-500/10">
            <CardHeader>
              <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <DatabaseZap size={20} />
                <CardTitle className="text-lg">
                  Successfully Saved to Database!
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <strong>Title:</strong> {savedPostData.title}
              </p>
              <p>
                <strong>Slug:</strong> <code>{savedPostData.slug}</code>
              </p>
              <p>
                The post is now in the database. You can view it at:
                <Link
                  href={`/blog/${savedPostData.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 text-primary hover:underline"
                >
                  /blog/{savedPostData.slug}
                </Link>
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => {
                  setSavedPostData(null);
                  setTopic("");
                  setSelectedCategorySlug(undefined);
                }}
              >
                Generate Another
              </Button>
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
}
