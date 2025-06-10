
import type { MetadataRoute } from "next";
import connectDB from "@/lib/mongodb";
import BlogPostModel, { type IMongoBlogPost } from "@/models/BlogPost";
import { categories } from "@/lib/data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:9002";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connectDB();

  // 1. Static Pages
  const staticPages = [
    "", // Homepage
    "/news",
    "/news/all",
    "/analysis",
    "/ipos",
    "/markets",
    "/about",
    "/contact",
    "/privacy-policy",
    "/terms-of-service",
    "/disclaimer",
    "/careers",
    "/advertise",
    "/login",
    "/signup-admin",
  ];

  const staticPageEntries: MetadataRoute.Sitemap = staticPages.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date().toISOString(),
    changeFrequency: path === "" ? "daily" : "monthly",
    priority: path === "" ? 1.0 : 0.7,
  }));

  // 2. Blog Post Pages
  const posts: IMongoBlogPost[] = await BlogPostModel.find({})
    .select("slug updatedAt publishedAt")
    .lean();
  const blogPostEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt
      ? new Date(post.updatedAt).toISOString()
      : new Date(post.publishedAt).toISOString(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // 3. Category Pages
  const categoryEntries: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${SITE_URL}/category/${category.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // 4. Tag Pages
  const allTagsFromPosts = posts.flatMap((post) => post.tags);
  const uniqueTags = [...new Set(allTagsFromPosts)].filter(Boolean); // Filter out any undefined/null tags

  const tagEntries: MetadataRoute.Sitemap = uniqueTags.map((tag) => {
    const tagSlug = tag.toLowerCase().replace(/\s+/g, "-");
    return {
      url: `${SITE_URL}/tags/${tagSlug}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.6,
    };
  });

  return [
    ...staticPageEntries,
    ...blogPostEntries,
    ...categoryEntries,
    ...tagEntries,
  ];
}
