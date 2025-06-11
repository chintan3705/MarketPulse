
"use client";

import React, { useEffect, useState } from "react";
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
  TrendingUp,
  AlertTriangle,
  Loader2,
  Lightbulb,
} from "lucide-react";
import { categories } from "@/lib/data"; // For category count
import type { BlogPost } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:9002";

interface DashboardStats {
  totalBlogs: number;
  aiGeneratedBlogs: number;
  totalCategories: number;
}

// Mock news suggestions - replace with actual API call
const mockNewsSuggestions = [
  {
    id: "news1",
    headline: "NSE Nifty 50 hits record high amid strong global cues.",
    source: "Financial Express",
    url: "#",
  },
  {
    id: "news2",
    headline: "SEBI proposes new framework for SME IPOs.",
    source: "LiveMint",
    url: "#",
  },
  {
    id: "news3",
    headline: "RBI Monetary Policy: Repo rate unchanged, inflation outlook key.",
    source: "Reuters India",
    url: "#",
  },
  {
    id: "news4",
    headline:
      "Impact of crude oil prices on Indian stock market - Q3 Analysis.",
    source: "Economic Times",
    url: "#",
  },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`${SITE_URL}/api/posts`, {
          cache: "no-store",
        });
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
        setError(
          catchedError.message ||
            "Failed to load dashboard data. Please try again.",
        );
        console.error("Error fetching dashboard data:", catchedError);
      } finally {
        setIsLoading(false);
      }
    }
    void fetchDashboardData();
  }, []);

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

      {error && (
        <Card className="mb-6 border-destructive bg-destructive/10">
          <CardContent className="p-4 flex items-center">
            <AlertTriangle className="h-6 w-6 text-destructive mr-3" />
            <div>
              <h3 className="font-semibold text-destructive-foreground">
                Error Loading Dashboard
              </h3>
              <p className="text-sm text-destructive-foreground/80">{error}</p>
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
          isLoadingCard={isLoading}
        />
        <StatCard
          title="Content Categories"
          value={stats?.totalCategories ?? "-"}
          icon={LayoutGrid}
          description="Available content categories"
          isLoadingCard={isLoading}
        />
        <StatCard
          title="AI-Generated Posts"
          value={stats?.aiGeneratedBlogs ?? "-"}
          icon={Wand2}
          description="Posts created using AI"
          isLoadingCard={isLoading}
        />
      </div>

      <div className="mt-6 sm:mt-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              <CardTitle className="font-headline text-lg sm:text-xl md:text-2xl">
                Market News & Blog Ideas
              </CardTitle>
            </div>
            <CardDescription className="text-xs sm:text-sm">
              Recent market headlines to inspire your next blog post. (
              <strong>Note:</strong> This section uses placeholder data.
              Integrate a live news API for real-time suggestions.)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-3 border rounded-md">
                    <Skeleton className="h-4 w-3/4 mb-1.5" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <ul className="space-y-3">
                {mockNewsSuggestions.map((news) => (
                  <li
                    key={news.id}
                    className="p-3 border rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <a
                      href={news.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-sm text-primary hover:underline"
                    >
                      {news.headline}
                    </a>
                    <p className="text-xs text-muted-foreground mt-1">
                      Source: {news.source}
                    </p>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-4 text-center">
              <Button variant="outline" size="sm" disabled>
                <TrendingUp className="mr-2 h-4 w-4" />
                Load More News (API Needed)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 sm:mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg sm:text-xl md:text-2xl">
              Recent Activity
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Overview of recent actions and updates. (Placeholder)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm sm:text-base">
              No recent activity to display. This section will show logs or
              important events in a future update.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
