
import { NextResponse, type NextRequest } from "next/server";
import { z } from "genkit";
import connectDB from "@/lib/mongodb";
import BlogPostModel, { type IMongoBlogPost } from "@/models/BlogPost";
import { categories } from "@/lib/data";
import {
  GenerateMultipleBlogPostsInputSchema,
  type GenerateMultipleBlogPostsInput,
} from "@/ai/schemas/multiple-blog-posts-schemas";
import { generateMultipleBlogPostsFlow } from "@/ai/flows/generate-multiple-blog-posts-flow";
import type { GenerateBlogPostOutput } from "@/ai/schemas/blog-post-schemas";

interface SavedPostInfo {
  title: string;
  slug: string;
}

interface GenerateMultipleBlogsSuccessResponse {
  message: string;
  posts: SavedPostInfo[];
}

interface GenerateMultipleBlogsErrorResponse {
  message: string;
  error?: string;
  detail?: string;
  errors?: unknown; // For Zod validation errors
}

export async function POST(
  request: NextRequest,
): Promise<
  NextResponse<
    GenerateMultipleBlogsSuccessResponse | GenerateMultipleBlogsErrorResponse
  >
> {
  console.log("[API /admin/generate-multiple-blogs] Received POST request.");
  try {
    const body: unknown = await request.json();
    console.log(
      "[API /admin/generate-multiple-blogs] Request body parsed:",
      body,
    );

    const validationResult =
      GenerateMultipleBlogPostsInputSchema.safeParse(body);

    if (!validationResult.success) {
      console.error(
        "[API /admin/generate-multiple-blogs] Input validation failed:",
        validationResult.error.format(),
      );
      return NextResponse.json(
        {
          message: "Invalid input.",
          errors: validationResult.error.format(),
        },
        { status: 400 },
      );
    }

    const genkitInput: GenerateMultipleBlogPostsInput = validationResult.data;
    console.log(
      `[API /admin/generate-multiple-blogs] Validated input. Count: ${genkitInput.count}, Topics: ${genkitInput.topics?.length || 0}, Category: ${genkitInput.categorySlug}. Calling Genkit flow...`,
    );

    const generatedDataArray = await generateMultipleBlogPostsFlow(genkitInput);
    console.log(
      `[API /admin/generate-multiple-blogs] Genkit flow completed. Received ${generatedDataArray.length} post data objects.`,
    );

    if (!generatedDataArray || generatedDataArray.length === 0) {
      console.warn(
        "[API /admin/generate-multiple-blogs] AI failed to generate any blog post content.",
      );
      return NextResponse.json(
        {
          message: "AI failed to generate any blog post content.",
          posts: [],
        },
        { status: 200 }, // Still 200, but with an empty posts array
      );
    }

    console.log("[API /admin/generate-multiple-blogs] Connecting to MongoDB...");
    await connectDB();
    console.log("[API /admin/generate-multiple-blogs] Connected to MongoDB.");

    const savedPostsInfo: SavedPostInfo[] = [];

    for (const generatedData of generatedDataArray) {
      if (!generatedData || !generatedData.title) {
        console.warn(
          "[API /admin/generate-multiple-blogs] Skipping an empty or invalid post data object from Genkit flow.",
        );
        continue;
      }

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

      let counter = 0;
      let uniqueSlug = slug;
      // eslint-disable-next-line no-await-in-loop
      while (await BlogPostModel.findOne({ slug: uniqueSlug })) {
        counter++;
        uniqueSlug = `${slug}-${counter}`;
      }
      slug = uniqueSlug;
      console.log(
        `[API /admin/generate-multiple-blogs] Generated unique slug: ${slug} for title: "${generatedData.title}"`,
      );

      const newPostData: Omit<
        IMongoBlogPost,
        "_id" | "createdAt" | "updatedAt"
      > = {
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
        chartType: generatedData.chartType,
        chartDataJson: generatedData.chartDataJson,
        detailedInformation: generatedData.detailedInformation,
      };

      const newPost = new BlogPostModel(newPostData);
      console.log(
        `[API /admin/generate-multiple-blogs] Saving post "${generatedData.title}" to MongoDB...`,
      );
      // eslint-disable-next-line no-await-in-loop
      const savedPost = (await newPost.save()) as IMongoBlogPost;
      console.log(
        `[API /admin/generate-multiple-blogs] Post "${savedPost.title}" saved successfully. ID: ${savedPost._id}`,
      );
      savedPostsInfo.push({ title: savedPost.title, slug: savedPost.slug });
    }

    return NextResponse.json(
      {
        message: `${savedPostsInfo.length} blog post(s) generated and saved successfully!`,
        posts: savedPostsInfo,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error(
      "[API /admin/generate-multiple-blogs] CRITICAL ERROR in POST handler:",
      error,
    );

    let errorMessage = "An unexpected error occurred.";
    let errorDetail: string | undefined;

    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetail = error.stack;
    } else if (typeof error === "string") {
      errorMessage = error;
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
