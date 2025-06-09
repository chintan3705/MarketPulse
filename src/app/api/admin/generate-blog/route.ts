
import { NextResponse } from 'next/server';
import { generateBlogPost, type GenerateBlogPostInput } from '@/ai/flows/generate-blog-post-flow';
import { z } from 'genkit'; // Corrected import path

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

    // Call the Genkit flow
    const blogPostOutput = await generateBlogPost({ topic });

    if (!blogPostOutput) {
      return NextResponse.json({ message: 'AI failed to generate blog post content.' }, { status: 500 });
    }

    return NextResponse.json(blogPostOutput, { status: 200 });

  } catch (error) {
    console.error('API Error generating blog post:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return NextResponse.json({ message: 'Error generating blog post.', error: errorMessage }, { status: 500 });
  }
}

    