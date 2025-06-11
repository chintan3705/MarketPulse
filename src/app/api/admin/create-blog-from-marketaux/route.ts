
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import connectDB from "@/lib/mongodb";
import BlogPostModel, { type IMongoBlogPost } from "@/models/BlogPost";
import { categories as staticCategories } from "@/lib/data";

const CreateBlogFromMarketAuxSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters."),
  summary: z.string().min(10, "Summary must be at least 10 characters."),
  content: z.string().min(20, "Content must be at least 20 characters."),
  categorySlug: z.string().min(1, "Category is required."),
  tags: z.array(z.string().min(1)).min(1, "At least one tag is required."),
  author: z.string().min(2, "Author name is required."),
  imageUrl: z.string().url("Must be a valid URL if provided.").optional().or(z.literal("")).nullable(),
});

interface SuccessResponse {
  message: string;
  post: IMongoBlogPost; // Or a transformed BlogPost type
}

interface ErrorResponse {
  message: string;
  errors?: unknown;
}

export async function POST(
  request: NextRequest,
): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
  console.log("[API /admin/create-blog-from-marketaux] Received POST request.");
  try {
    const body: unknown = await request.json();
    console.log("[API /admin/create-blog-from-marketaux] Request body parsed:", body);

    const validationResult = CreateBlogFromMarketAuxSchema.safeParse(body);

    if (!validationResult.success) {
      console.error(
        "[API /admin/create-blog-from-marketaux] Input validation failed:",
        validationResult.error.format(),
      );
      return NextResponse.json(
        { message: "Invalid input.", errors: validationResult.error.format() },
        { status: 400 },
      );
    }

    const {
      title,
      summary,
      content,
      categorySlug,
      tags,
      author,
      imageUrl,
    } = validationResult.data;

    console.log("[API /admin/create-blog-from-marketaux] Connecting to MongoDB...");
    await connectDB();
    console.log("[API /admin/create-blog-from-marketaux] Connected to MongoDB.");

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
    console.log(`[API /admin/create-blog-from-marketaux] Generated unique slug: ${slug}`);
    
    const categoryDetails = staticCategories.find(
      (c) => c.slug === categorySlug,
    );
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
      imageUrl: imageUrl || undefined,
      imageAiHint: `news article ${tags.join(" ")}`.substring(0, 50), // Basic hint
      publishedAt: new Date(),
      isAiGenerated: false, // This is curated
      // chartType, chartDataJson, detailedInformation can be undefined
    };

    const newPost = new BlogPostModel(newPostData);
    console.log("[API /admin/create-blog-from-marketaux] Saving post to MongoDB...");
    const savedPost = (await newPost.save()) as IMongoBlogPost;
    console.log(
      "[API /admin/create-blog-from-marketaux] Post saved successfully. ID:",
      savedPost._id,
    );

    return NextResponse.json(
      {
        message: "Blog post created successfully from MarketAux data!",
        post: savedPost.toObject() as IMongoBlogPost,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error(
      "[API /admin/create-blog-from-marketaux] CRITICAL ERROR in POST handler:",
      error,
    );
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json(
      {
        message: "Error processing your request on the server.",
        errors: errorMessage,
      },
      { status: 500 },
    );
  }
}
