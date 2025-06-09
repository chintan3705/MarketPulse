import { NextResponse, type NextRequest } from 'next/server';
import { generateBlogPost } from '@/ai/flows/generate-blog-post-flow';
import { z } from 'genkit';
import connectDB from '@/lib/mongodb';
import BlogPostModel, { type IMongoBlogPost } from '@/models/BlogPost';
import { categories } from '@/lib/data'; // To find category name

// Input schema for this API route
const ApiInputSchema = z.object({
  topic: z.string().min(3, { message: 'Topic must be at least 3 characters long.' }),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as { topic: string };
    const validationResult = ApiInputSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { message: 'Invalid input.', errors: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { topic } = validationResult.data;

    // 1. Call the Genkit flow to generate content
    const generatedData = await generateBlogPost({ topic });

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
    // if (!categoryDetails) { // This check is handled by the fallback logic below
    // Fallback or error if category slug from AI is not in our static list
    // console.warn(`Category slug "${generatedData.categorySlug}" not found in static categories. Falling back to 'general'.`);
    // const generalCategory = categories.find(c => c.slug === 'general') || { id: 'error', name: 'Unknown', slug: 'unknown'};
    // generatedData.categorySlug = generalCategory.slug;
    // categoryName will be derived from the found category or fallback
    // }

    const categoryName =
      categoryDetails?.name || categories.find((c) => c.slug === 'general')?.name || 'General';
    const finalCategorySlug =
      categoryDetails?.slug || categories.find((c) => c.slug === 'general')?.slug || 'general';

    // Simple slug generation (consider a more robust slugify library for production)
    let slug = generatedData.title
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w-]+/g, '') // Remove all non-word chars
      .replace(/--+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, ''); // Trim - from end of text

    const existingPostWithSlug = await BlogPostModel.findOne({ slug });
    if (existingPostWithSlug) {
      slug = `${slug}-${Date.now()}`;
    }

    const newPostData: Omit<IMongoBlogPost, '_id' | 'createdAt' | 'updatedAt'> = {
      slug: slug,
      title: generatedData.title,
      summary: generatedData.summary,
      content: generatedData.content,
      imageUrl: generatedData.imageUrl, // This will be the placeholder URL
      imageAiHint: generatedData.imageAiHint,
      categorySlug: finalCategorySlug,
      categoryName: categoryName,
      author: 'MarketPulse AI', // Or make this configurable
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
  } catch (error) {
    console.error('API Error generating and saving blog post:', error);

    // Check for MongoDB duplicate key error (slug)
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
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
