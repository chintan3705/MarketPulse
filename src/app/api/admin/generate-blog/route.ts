import { NextResponse, type NextRequest } from 'next/server';
import { generateBlogPost } from '@/ai/flows/generate-blog-post-flow';
import { z } from 'genkit';
import connectDB from '@/lib/mongodb';
import BlogPostModel, { type IMongoBlogPost } from '@/models/BlogPost';
import { categories } from '@/lib/data'; // To find category name
import type { GenerateBlogPostInput } from '@/ai/schemas/blog-post-schemas';

// Input schema for this API route
const ApiInputSchema = z.object({
  topic: z.string().min(3, { message: 'Topic must be at least 3 characters long.' }),
});
// type ApiInput = z.infer<typeof ApiInputSchema>; // Not directly used as validationResult.data is typed

// Interface for the expected successful response structure from this API
// This matches what GenerateBlogDialog expects for `result.post`
interface GenerateBlogSuccessResponse {
  message: string;
  post: IMongoBlogPost; // Using IMongoBlogPost as it's what's saved and returned
}

interface GenerateBlogErrorResponse {
  message: string;
  error?: string;
  errors?: unknown; // For Zod error formatting
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<GenerateBlogSuccessResponse | GenerateBlogErrorResponse>> {
  try {
    const body: unknown = await request.json(); // Parse as unknown, Zod will validate
    const validationResult = ApiInputSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { message: 'Invalid input.', errors: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { topic } = validationResult.data;

    // 1. Call the Genkit flow to generate content
    const generatedData = await generateBlogPost({ topic } as GenerateBlogPostInput); // Cast to ensure type match

    if (!generatedData) {
      return NextResponse.json(
        { message: 'AI failed to generate blog post content.' },
        { status: 500 }
      );
    }

    // 2. Connect to MongoDB
    await connectDB();

    // 3. Prepare data for MongoDB
    const categoryDetails = categories.find((c) => c.slug === generatedData.categorySlug);

    const categoryName =
      categoryDetails?.name || categories.find((c) => c.slug === 'general')?.name || 'General';
    const finalCategorySlug =
      categoryDetails?.slug || categories.find((c) => c.slug === 'general')?.slug || 'general';

    // Simple slug generation
    let slug = generatedData.title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');

    const existingPostWithSlug = await BlogPostModel.findOne({ slug });
    if (existingPostWithSlug) {
      slug = `${slug}-${Date.now()}`;
    }

    const newPostData: Omit<IMongoBlogPost, '_id' | 'createdAt' | 'updatedAt'> = {
      slug: slug,
      title: generatedData.title,
      summary: generatedData.summary,
      content: generatedData.content,
      imageUrl: generatedData.imageUrl,
      imageAiHint: generatedData.imageAiHint,
      categorySlug: finalCategorySlug,
      categoryName: categoryName,
      author: 'MarketPulse AI',
      publishedAt: new Date(),
      tags: generatedData.tags,
      isAiGenerated: true,
    };

    const newPost = new BlogPostModel(newPostData);

    // 4. Save to MongoDB
    const savedPost = (await newPost.save()) as IMongoBlogPost;

    return NextResponse.json(
      { message: 'Blog post generated and saved successfully!', post: savedPost.toObject() },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('API Error generating and saving blog post:', error);

    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      (error as { code: unknown }).code === 11000
    ) {
      return NextResponse.json(
        {
          message:
            'Error saving blog post. A post with a similar title (slug) might already exist. Try a different topic.',
          error: 'Duplicate slug error',
        },
        { status: 409 }
      );
    }
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return NextResponse.json(
      { message: 'Error generating or saving blog post.', error: errorMessage },
      { status: 500 }
    );
  }
}
