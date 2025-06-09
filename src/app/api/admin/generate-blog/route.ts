
import { NextResponse, type NextRequest } from "next/server";
import { generateBlogPost } from "@/ai/flows/generate-blog-post-flow";
import { z } from "genkit";
import connectDB from "@/lib/mongodb";
import BlogPostModel, { type IMongoBlogPost } from "@/models/BlogPost";
import { categories } from "@/lib/data";
import type { GenerateBlogPostInput } from "@/ai/schemas/blog-post-schemas";

const ApiInputSchema = z.object({
  topic: z
    .string()
    .min(3, { message: "Topic must be at least 3 characters long." }),
  categorySlug: z.string().optional(), // Added optional categorySlug
});

interface GenerateBlogSuccessResponse {
  message: string;
  post: IMongoBlogPost;
}

interface GenerateBlogErrorResponse {
  message: string;
  error?: string;
  detail?: string;
  errors?: unknown;
}

export async function POST(
  request: NextRequest,
): Promise<
  NextResponse<GenerateBlogSuccessResponse | GenerateBlogErrorResponse>
> {
  console.log("[API /admin/generate-blog] Received POST request.");
  try {
    const body: unknown = await request.json();
    console.log("[API /admin/generate-blog] Request body parsed:", body);

    const validationResult = ApiInputSchema.safeParse(body);

    if (!validationResult.success) {
      console.error(
        "[API /admin/generate-blog] Input validation failed:",
        validationResult.error.format(),
      );
      return NextResponse.json(
        { message: "Invalid input.", errors: validationResult.error.format() },
        { status: 400 },
      );
    }

    const { topic, categorySlug } = validationResult.data;
    console.log(
      `[API /admin/generate-blog] Validated topic: "${topic}", categorySlug: "${categorySlug || "AI choice"}". Calling Genkit flow...`,
    );

    // 1. Call the Genkit flow to generate content
    const genkitInput: GenerateBlogPostInput = { topic };
    if (categorySlug && categorySlug !== "ai-choose") {
      genkitInput.categorySlug = categorySlug;
    }

    const generatedData = await generateBlogPost(genkitInput);
    console.log(
      "[API /admin/generate-blog] Genkit flow completed. Generated data:",
      generatedData ? "Data received" : "No data received",
    );

    if (!generatedData) {
      console.error(
        "[API /admin/generate-blog] AI failed to generate blog post content (generatedData is null/undefined).",
      );
      return NextResponse.json(
        { message: "AI failed to generate blog post content." },
        { status: 500 },
      );
    }

    console.log("[API /admin/generate-blog] Connecting to MongoDB...");
    await connectDB();
    console.log("[API /admin/generate-blog] Connected to MongoDB.");

    const categoryDetails = categories.find(
      (c) => c.slug === generatedData.categorySlug,
    );

    const categoryName =
      categoryDetails?.name ||
      categories.find((c) => c.slug === "general")?.name ||
      "General";
    const finalCategorySlug =
      categoryDetails?.slug ||
      categories.find((c) => c.slug === "general")?.slug ||
      "general";

    let slug = generatedData.title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");

    const existingPostWithSlug = await BlogPostModel.findOne({ slug });
    if (existingPostWithSlug) {
      slug = `${slug}-${Date.now()}`;
    }
    console.log(`[API /admin/generate-blog] Generated slug: ${slug}`);

    const newPostData: Omit<IMongoBlogPost, "_id" | "createdAt" | "updatedAt"> =
      {
        slug: slug,
        title: generatedData.title,
        summary: generatedData.summary,
        content: generatedData.content,
        imageUrl: generatedData.imageUrl,
        imageAiHint: generatedData.imageAiHint,
        categorySlug: finalCategorySlug,
        categoryName: categoryName,
        author: "MarketPulse AI",
        publishedAt: new Date(),
        tags: generatedData.tags,
        isAiGenerated: true,
      };

    const newPost = new BlogPostModel(newPostData);
    console.log("[API /admin/generate-blog] Saving post to MongoDB...");
    const savedPost = (await newPost.save()) as IMongoBlogPost;
    console.log(
      "[API /admin/generate-blog] Post saved successfully. ID:",
      savedPost._id,
    );

    return NextResponse.json(
      {
        message: "Blog post generated and saved successfully!",
        post: savedPost.toObject(),
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error(
      "[API /admin/generate-blog] CRITICAL ERROR in POST handler:",
      error,
    );

    let errorMessage = "An unexpected error occurred.";
    let errorDetail: string | undefined;

    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetail = error.stack;
    } else if (typeof error === "string") {
      errorMessage = error;
    } else if (
      error &&
      typeof error === "object" &&
      "message" in error &&
      typeof (error as { message: unknown }).message === "string"
    ) {
      errorMessage = (error as { message: string }).message;
    }

    if (errorMessage.toLowerCase().includes("api key") || errorMessage.toLowerCase().includes("permission denied")) {
        errorMessage = "Error with AI service: Potentially an API key or permission issue. Please verify your GOOGLE_API_KEY and ensure the Gemini API is enabled for your project.";
    }

    return NextResponse.json(
      {
        message: "Error processing your request on the server.",
        error: errorMessage,
        detail: errorDetail,
      },
      { status: 500 },
    );
  }
}
