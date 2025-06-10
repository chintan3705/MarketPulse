
import { NextResponse, type NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import BlogPostModel, { type IMongoBlogPost } from "@/models/BlogPost";
import type { BlogPost, Category } from "@/types";
import { categories as staticCategories } from "@/lib/data";
import { z } from "zod";

// Helper function to transform MongoDB document to BlogPost type
function transformPost(doc: IMongoBlogPost): BlogPost {
  const categoryObject: Category = staticCategories.find(
    (c) => c.slug === doc.categorySlug,
  ) ||
    staticCategories.find((c) => c.slug === "general") || {
      id: doc.categorySlug,
      name: doc.categoryName || "General",
      slug: doc.categorySlug,
    };
  return {
    _id: doc._id.toString(),
    id: doc._id.toString(), // Ensure id is also populated for consistency
    slug: doc.slug,
    title: doc.title,
    summary: doc.summary,
    imageUrl: doc.imageUrl,
    imageAiHint: doc.imageAiHint,
    category: categoryObject,
    categorySlug: doc.categorySlug,
    categoryName: doc.categoryName,
    author: doc.author,
    publishedAt: doc.publishedAt.toISOString(),
    tags: doc.tags,
    content: doc.content,
    isAiGenerated: doc.isAiGenerated,
    chartType: doc.chartType,
    chartDataJson: doc.chartDataJson,
    detailedInformation: doc.detailedInformation,
  };
}

interface GetPostsResponse {
  posts: BlogPost[];
  totalPosts: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function GET(
  request: NextRequest,
): Promise<
  NextResponse<GetPostsResponse | { message: string; error?: string }>
> {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("categorySlug");
    const tagSlug = searchParams.get("tagSlug");
    const limitParam = searchParams.get("limit");
    const pageParam = searchParams.get("page");

    const limit = limitParam ? parseInt(limitParam, 10) : 0; // 0 for no limit
    const page = pageParam ? parseInt(pageParam, 10) : 1;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {};
    if (categorySlug) {
      filter.categorySlug = categorySlug;
    }
    if (tagSlug) {
      const tagName = tagSlug.replace(/-/g, " ");
      filter.tags = { $regex: new RegExp(`^${tagName}$`, "i") };
    }

    let query = BlogPostModel.find(filter).sort({ publishedAt: -1 });

    if (limit > 0) {
      const skip = (page - 1) * limit;
      query = query.skip(skip).limit(limit);
    }

    const postsDocs = await query.exec();
    const posts: BlogPost[] = postsDocs.map(transformPost);

    const totalPosts = await BlogPostModel.countDocuments(filter);

    return NextResponse.json(
      {
        posts,
        totalPosts,
        page,
        limit: limit > 0 ? limit : posts.length,
        totalPages: limit > 0 ? Math.ceil(totalPosts / limit) : 1,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("API Error fetching posts:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json(
      { message: "Error fetching posts.", error: errorMessage },
      { status: 500 },
    );
  }
}


// Schema for manual blog post creation (server-side validation)
const CreateManualBlogPostAPISchema = z.object({
  title: z.string().min(5),
  summary: z.string().min(10),
  content: z.string().min(50),
  categorySlug: z.string().min(1),
  tags: z.array(z.string().min(1)).min(1, "At least one tag is required."),
  author: z.string().min(2),
  imageUrl: z.string().url().optional().or(z.literal("")).nullable(),
  imageAiHint: z.string().optional().nullable(),
});


export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    await connectDB();
    const body: unknown = await request.json();

    const validationResult = CreateManualBlogPostAPISchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { message: "Invalid input.", errors: validationResult.error.format() },
        { status: 400 },
      );
    }

    const { title, summary, content, categorySlug, tags, author, imageUrl, imageAiHint } = validationResult.data;

    // Generate slug
    let slug = title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");

    let counter = 0;
    let uniqueSlug = slug;
    // eslint-disable-next-line no-await-in-loop
    while (await BlogPostModel.findOne({ slug: uniqueSlug })) {
      counter++;
      uniqueSlug = `${slug}-${counter}`;
    }
    slug = uniqueSlug;

    const categoryDetails = staticCategories.find(c => c.slug === categorySlug);
    const categoryName = categoryDetails?.name || staticCategories.find(c => c.slug === "general")?.name || "General";

    const newPostData: Omit<IMongoBlogPost, "_id" | "createdAt" | "updatedAt"> = {
      slug,
      title,
      summary,
      content,
      categorySlug,
      categoryName,
      tags,
      author,
      imageUrl: imageUrl || undefined, // Ensure undefined if empty string
      imageAiHint: imageAiHint || undefined,
      publishedAt: new Date(),
      isAiGenerated: false, // Explicitly false for manual creation
      // chartType, chartDataJson, detailedInformation will be undefined by default
    };

    const newPost = new BlogPostModel(newPostData);
    const savedPost = await newPost.save();

    return NextResponse.json(transformPost(savedPost as IMongoBlogPost), { status: 201 });

  } catch (error) {
    console.error("API Error creating manual post:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json(
      { message: "Error creating blog post.", error: errorMessage },
      { status: 500 },
    );
  }
}
