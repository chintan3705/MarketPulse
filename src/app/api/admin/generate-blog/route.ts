
import { NextResponse } from 'next/server';
import { generateBlogPost } from '@/ai/flows/generate-blog-post-flow';
import { z } from 'genkit';
import connectDB from '@/lib/mongodb';
import BlogPostModel from '@/models/BlogPost';
import { categories } from '@/lib/data'; // To find category name

// Input schema for this API route
const ApiInputSchema = z.object({
  topic: z.string().min(3, { message: "Topic must be at least 3 characters long." }),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validationResult = ApiInputSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({ message: 'Invalid input.', errors: validationResult.error.format() }, { status: 400 });
    }

    const { topic } = validationResult.data;

    // 1. Call the Genkit flow to generate content
    const generatedData = await generateBlogPost({ topic });

    if (!generatedData) {
      return NextResponse.json({ message: 'AI failed to generate blog post content.' }, { status: 500 });
    }

    // 2. Connect to MongoDB
    await connectDB();

    // 3. Prepare data for MongoDB
    const categoryDetails = categories.find(c => c.slug === generatedData.categorySlug);
    if (!categoryDetails) {
      // Fallback or error if category slug from AI is not in our static list
      console.warn(`Category slug "${generatedData.categorySlug}" not found in static categories. Falling back to 'general'.`);
      const generalCategory = categories.find(c => c.slug === 'general') || { id: 'error', name: 'Unknown', slug: 'unknown'};
      generatedData.categorySlug = generalCategory.slug;
      // categoryName will be derived from the found category or fallback
    }
    
    const categoryName = categories.find(c => c.slug === generatedData.categorySlug)?.name || 'General';


    // Simple slug generation (consider a more robust slugify library for production)
    let slug = generatedData.title.toLowerCase()
      .replace(/\s+/g, '-')       // Replace spaces with -
      .replace(/[^\w-]+/g, '')    // Remove all non-word chars
      .replace(/--+/g, '-')       // Replace multiple - with single -
      .replace(/^-+/, '')          // Trim - from start of text
      .replace(/-+$/, '');         // Trim - from end of text
    
    // Ensure slug uniqueness by appending a timestamp if it already exists
    // (A more robust solution might involve a loop and checking DB)
    const existingPost = await BlogPostModel.findOne({ slug });
    if (existingPost) {
      slug = `${slug}-${Date.now()}`;
    }

    const newPost = new BlogPostModel({
      slug: slug,
      title: generatedData.title,
      summary: generatedData.summary,
      content: generatedData.content,
      imageUrl: generatedData.imageUrl,
      imageAiHint: generatedData.imageAiHint,
      categorySlug: generatedData.categorySlug,
      categoryName: categoryName,
      author: 'MarketPulse AI', // Or make this configurable
      publishedAt: new Date().toISOString(),
      tags: generatedData.tags,
      isAiGenerated: true,
    });

    // 4. Save to MongoDB
    const savedPost = await newPost.save();

    return NextResponse.json({ message: 'Blog post generated and saved successfully!', post: savedPost }, { status: 201 });

  } catch (error) {
    console.error('API Error generating and saving blog post:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    // Check for MongoDB duplicate key error (slug)
    if (error instanceof Error && 'code' in error && (error as any).code === 11000) {
      return NextResponse.json({ message: 'Error saving blog post. A post with a similar title (slug) might already exist. Try a different topic.', error: 'Duplicate slug error' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Error generating or saving blog post.', error: errorMessage }, { status: 500 });
  }
}
