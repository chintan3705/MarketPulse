
"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Newspaper,
  LayoutGrid,
  Wand2,
  AlertTriangle,
  Loader2,
  Lightbulb,
  RadioTower,
  Search,
  ExternalLink,
  Save,
} from "lucide-react";
import { categories } from "@/lib/data";
import type { BlogPost, MarketAuxNewsItem as IMOAuxNewsItem } from "@/types"; // Renamed for clarity
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { SaveMarketAuxToBlogDialog } from "./_components/SaveMarketAuxToBlogDialog"; // New Dialog

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:9002";

interface DashboardStats {
  totalBlogs: number;
  aiGeneratedBlogs: number;
  totalCategories: number;
}

type MarketAuxQueryType =
  | "general"
  | "symbols"
  | "positive"
  | "neutral"
  | "negative";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);
  const { toast } = useToast();

  const [marketAuxQueryType, setMarketAuxQueryType] =
    useState<MarketAuxQueryType>("general");
  const [marketAuxSymbols, setMarketAuxSymbols] = useState<string>("");
  const [marketAuxLimit, setMarketAuxLimit] = useState<number>(3);
  const [marketAuxNews, setMarketAuxNews] = useState<IMOAuxNewsItem[]>([]);
  const [isLoadingMarketAux, setIsLoadingMarketAux] = useState(false);
  const [marketAuxError, setMarketAuxError] = useState<string | null>(null);

  // State for the new dialog
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [selectedNewsItem, setSelectedNewsItem] =
    useState<IMOAuxNewsItem | null>(null);

  const fetchDashboardStats = useCallback(async () => {
    setIsLoadingStats(true);
    setStatsError(null);
    try {
      const res = await fetch(`${SITE_URL}/api/posts`, { cache: "no-store" });
      if (!res.ok) {
        throw new Error(`Failed to fetch posts: ${res.status}`);
      }
      const postsData = (await res.json()) as { posts: BlogPost[] };
      const allPosts = postsData.posts || [];
      const aiGeneratedCount = allPosts.filter(
        (post) => post.isAiGenerated,
      ).length;
      setStats({
        totalBlogs: allPosts.length,
        aiGeneratedBlogs: aiGeneratedCount,
        totalCategories: categories.length,
      });
    } catch (err) {
      const catchedError = err as Error;
      setStatsError(
        catchedError.message ||
          "Failed to load dashboard stats. Please try again.",
      );
      console.error("Error fetching dashboard stats:", catchedError);
    } finally {
      setIsLoadingStats(false);
    }
  }, []);

  useEffect(() => {
    void fetchDashboardStats();
  }, [fetchDashboardStats]);

  const handleFetchMarketAuxNews = async () => {
    setIsLoadingMarketAux(true);
    setMarketAuxError(null);
    setMarketAuxNews([]);

    if (marketAuxQueryType === "symbols" && !marketAuxSymbols.trim()) {
      setMarketAuxError("Please enter stock symbols.");
      setIsLoadingMarketAux(false);
      return;
    }
    if (marketAuxLimit < 1 || marketAuxLimit > 10) {
      setMarketAuxError("Number of articles must be between 1 and 10.");
      setIsLoadingMarketAux(false);
      return;
    }

    try {
      const params: Record<string, string | number> = {
        queryType: marketAuxQueryType,
        limit: marketAuxLimit,
      };
      if (marketAuxQueryType === "symbols") {
        params.symbols = marketAuxSymbols.trim();
      }

      const queryString = new URLSearchParams(
        params as Record<string, string>,
      ).toString();
      const response = await fetch(
        `/api/admin/marketaux-news?${queryString}`,
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            result.error ||
            `Failed to fetch news: ${response.statusText}`,
        );
      }
      setMarketAuxNews(result.data || []);
      if ((result.data || []).length === 0) {
        toast({
          title: "No News Found",
          description: "No articles matched your criteria.",
        });
      }
    } catch (err) {
      const catchedError = err as Error;
      setMarketAuxError(
        catchedError.message || "An unexpected error occurred.",
      );
      toast({
        title: "Error Fetching News",
        description: catchedError.message,
        variant: "destructive",
      });
    } finally {
      setIsLoadingMarketAux(false);
    }
  };

  const handleSaveAsBlog = (newsItem: IMOAuxNewsItem) => {
    setSelectedNewsItem(newsItem);
    setShowSaveDialog(true);
  };

  const StatCard = ({
    title,
    value,
    icon: Icon,
    description,
    isLoadingCard,
  }: {
    title: string;
    value: string | number;
    icon: React.ElementType;
    description: string;
    isLoadingCard: boolean;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoadingCard ? (
          <>
            <Skeleton className="h-7 w-1/2 mb-1.5" />
            <Skeleton className="h-3 w-3/4" />
          </>
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{description}</p>
          </>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div
      className="animate-slide-in"
      style={{ animationDelay: "0.1s", animationFillMode: "backwards" }}
    >
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold font-headline text-center sm:text-left">
          Admin Dashboard
        </h1>
      </div>

      {statsError && (
        <Card className="mb-6 border-destructive bg-destructive/10">
          <CardContent className="p-4 flex items-center">
            <AlertTriangle className="h-6 w-6 text-destructive mr-3" />
            <div>
              <h3 className="font-semibold text-destructive-foreground">
                Error Loading Stats
              </h3>
              <p className="text-sm text-destructive-foreground/80">
                {statsError}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Blogs"
          value={stats?.totalBlogs ?? "-"}
          icon={Newspaper}
          description="Currently published blog posts"
          isLoadingCard={isLoadingStats}
        />
        <StatCard
          title="Content Categories"
          value={stats?.totalCategories ?? "-"}
          icon={LayoutGrid}
          description="Available content categories"
          isLoadingCard={isLoadingStats}
        />
        <StatCard
          title="AI-Generated Posts"
          value={stats?.aiGeneratedBlogs ?? "-"}
          icon={Wand2}
          description="Posts created using AI"
          isLoadingCard={isLoadingStats}
        />
      </div>

      <div className="mt-6 sm:mt-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <RadioTower className="h-5 w-5 text-primary" />
              <CardTitle className="font-headline text-lg sm:text-xl md:text-2xl">
                Market News Fetcher (MarketAux)
              </CardTitle>
            </div>
            <CardDescription className="text-xs sm:text-sm">
              Fetch news headlines for blog ideas.
              <strong className="text-destructive-foreground/80">
                {" "}
                Use API requests sparingly (free tier has limits).
              </strong>
              <br />
              Ensure `MARKETAUX_API_TOKEN` is set in your `.env` file.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <div className="space-y-1.5">
                <Label htmlFor="marketAuxQueryType" className="text-sm">
                  News Feed Type
                </Label>
                <Select
                  value={marketAuxQueryType}
                  onValueChange={(value) =>
                    setMarketAuxQueryType(value as MarketAuxQueryType)
                  }
                >
                  <SelectTrigger id="marketAuxQueryType" className="text-sm">
                    <SelectValue placeholder="Select news type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">
                      General Financial News
                    </SelectItem>
                    <SelectItem value="symbols">
                      News by Stock Symbols
                    </SelectItem>
                    <SelectItem value="positive">
                      Positive Sentiment News
                    </SelectItem>
                    <SelectItem value="neutral">
                      Neutral Sentiment News
                    </SelectItem>
                    <SelectItem value="negative">
                      Negative Sentiment News
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="marketAuxLimit" className="text-sm">
                  Number of Articles (1-10)
                </Label>
                <Input
                  id="marketAuxLimit"
                  type="number"
                  value={marketAuxLimit}
                  onChange={(e) =>
                    setMarketAuxLimit(
                      Math.max(1, Math.min(10, parseInt(e.target.value) || 1)),
                    )
                  }
                  min="1"
                  max="10"
                  className="text-sm"
                />
              </div>
            </div>
            {marketAuxQueryType === "symbols" && (
              <div className="space-y-1.5">
                <Label htmlFor="marketAuxSymbols" className="text-sm">
                  Stock Symbols (comma-separated, e.g., AAPL,MSFT)
                </Label>
                <Input
                  id="marketAuxSymbols"
                  value={marketAuxSymbols}
                  onChange={(e) => setMarketAuxSymbols(e.target.value)}
                  placeholder="AAPL,MSFT,GOOG"
                  className="text-sm"
                />
              </div>
            )}
            <Button
              onClick={handleFetchMarketAuxNews}
              disabled={isLoadingMarketAux}
              size="sm"
            >
              {isLoadingMarketAux ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Search className="mr-2 h-4 w-4" />
              )}
              Fetch Market News
            </Button>

            {marketAuxError && (
              <div className="text-sm text-destructive p-2 bg-destructive/10 rounded-md flex items-center gap-2">
                <AlertTriangle size={16} /> {marketAuxError}
              </div>
            )}

            {marketAuxNews.length > 0 && (
              <div className="mt-4 space-y-3 max-h-96 overflow-y-auto pr-2">
                <h4 className="font-semibold text-md">Fetched Headlines:</h4>
                {marketAuxNews.map((news) => (
                  <div
                    key={news.uuid}
                    className="p-3 border rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                        <div>
                            <a
                            href={news.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-sm text-primary hover:underline flex items-center"
                            >
                            {news.title}
                            <ExternalLink size={12} className="ml-1.5 shrink-0" />
                            </a>
                            <p className="text-xs text-muted-foreground mt-1">
                            {news.source} -{" "}
                            {new Date(news.published_at).toLocaleDateString()}
                            </p>
                        </div>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleSaveAsBlog(news)}
                            className="ml-2 text-xs shrink-0"
                            title="Save this news as a blog post draft"
                        >
                            <Save size={14} className="mr-1.5" /> Blog it
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {news.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
            {marketAuxNews.length === 0 && !isLoadingMarketAux && !marketAuxError && (
               <p className="text-sm text-muted-foreground mt-2">
                Click "Fetch Market News" to get suggestions.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 sm:mt-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              <CardTitle className="font-headline text-lg sm:text-xl md:text-2xl">
                Content Ideas from News
              </CardTitle>
            </div>
            <CardDescription className="text-xs sm:text-sm">
              Use the fetched headlines above to generate blog posts using the
              AI or manual creation tools in the "Manage Blogs" section, or use the "Blog it" button above.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm sm:text-base">
              Example: Pick a headline, click "Blog it", then refine the details in the dialog and save.
            </p>
          </CardContent>
        </Card>
      </div>
      {selectedNewsItem && (
        <SaveMarketAuxToBlogDialog
          isOpen={showSaveDialog}
          onOpenChange={setShowSaveDialog}
          newsItem={selectedNewsItem}
          onPostSaved={() => {
            fetchDashboardStats(); // Refresh stats after a post is saved
            toast({ title: "Blog Post Saved!", description: "The new post from MarketAux data has been added." });
          }}
        />
      )}
    </div>
  );
}
