'use server';
/**
 * @fileOverview A Genkit flow to generate a blog post based on a topic, including an AI-generated image.
 *
 * Exports:
 * - generateBlogPost - A function that handles the blog post generation with image.
 * - type GenerateBlogPostInput - The input type for the generateBlogPost function.
 * - type GenerateBlogPostOutput - The return type for the generateBlogPost function.
 * - GenerateBlogPostOutputSchema - Zod schema for the output.
 */

import { ai } from '@/ai/genkit';
import { categories } from '@/lib/data';
import {
  GenerateBlogPostInputSchema,
  type GenerateBlogPostInput,
  GenerateBlogPostOutputSchema, // Exporting the schema
  type GenerateBlogPostOutput,
} from '../schemas/blog-post-schemas';

export { GenerateBlogPostOutputSchema }; // Explicitly export the schema
export type { GenerateBlogPostInput, GenerateBlogPostOutput }; // Re-export types

export async function generateBlogPost(
  input: GenerateBlogPostInput
): Promise<GenerateBlogPostOutput> {
  return generateBlogPostFlow(input);
}

const systemInstruction = `You are an expert financial news writer for a blog called MarketPulse. Your task is to generate a blog post based on the provided topic.

The blog post should be engaging, informative, and suitable for an audience interested in stock markets, finance, and investments.

Available Categories (choose the most relevant one and return its slug):
${categories.map((cat) => `- Name: ${cat.name}, Slug: ${cat.slug}`).join('\n')}

Topic: {{{topic}}}

Please generate the following:
1. A catchy title.
2. A concise summary (2-3 sentences).
3. The full blog post content in HTML format. The content should be well-structured with multiple paragraphs. You can use <h3> for subheadings, and <ul>/<li> for lists where appropriate. Aim for around 300-500 words for the main content.
4. The slug of the most relevant category from the list provided above.
5. An array of 2-4 relevant tags (keywords).

Ensure the output strictly follows the JSON schema provided for the output, excluding imageUrl and imageAiHint which will be handled separately.
`;

const generateBlogPostTextPrompt = ai.definePrompt({
  name: 'generateBlogPostTextPrompt',
  input: { schema: GenerateBlogPostInputSchema },
  output: { schema: GenerateBlogPostOutputSchema.omit({ imageUrl: true, imageAiHint: true }) },
  prompt: systemInstruction,
});

const generateBlogPostFlow = ai.defineFlow(
  {
    name: 'generateBlogPostFlow',
    inputSchema: GenerateBlogPostInputSchema,
    outputSchema: GenerateBlogPostOutputSchema,
  },
  async (input) => {
    const { output: textOutput } = await generateBlogPostTextPrompt(input);
    if (!textOutput) {
      throw new Error('Failed to generate blog post text content.');
    }

    const isValidCategory = categories.some((cat) => cat.slug === textOutput.categorySlug);
    if (!isValidCategory && categories.length > 0) {
      textOutput.categorySlug = categories[0].slug; // Default to first category if AI hallucinates
    } else if (categories.length === 0) {
      textOutput.categorySlug = 'general'; // Fallback if no categories defined
    }

    const categoryNameForImage =
      categories.find((c) => c.slug === textOutput.categorySlug)?.name || 'financial';
    const imageAiHint =
      textOutput.tags.length > 0 ? textOutput.tags.slice(0, 2).join(' ') : input.topic;
    let imageUrl: string | undefined = undefined;

    try {
      const imagePromptText = `A visually appealing blog post illustration for an article in the "${categoryNameForImage}" category, titled "${textOutput.title}". The article is about: ${textOutput.summary.substring(0, 100)}... Focus on themes like: ${imageAiHint}. Financial, modern, abstract or conceptual style.`;

      console.log(`Generating image with prompt: ${imagePromptText.substring(0, 100)}...`);

      const { media } = await ai.generate({
        model: 'googleai/gemini-2.0-flash-exp',
        prompt: imagePromptText,
        config: {
          responseModalities: ['IMAGE', 'TEXT'],
        },
      });

      if (media && media.url) {
        console.log('Image generated successfully by Genkit (as data URI).');
        // In a real application, you would upload this data URI to a third-party image service.
        // const imageDataUri = media.url;
        // const uploadedImageUrl = await uploadToThirdPartyService(imageDataUri); // Your custom upload function
        // imageUrl = uploadedImageUrl;

        // For this prototype, we'll use a placeholder and save the AI hint.
        // The actual data URI (media.url) is not being stored in the DB.
        imageUrl = `https://placehold.co/800x450.png`;
        console.log(
          `Using placeholder URL for now: ${imageUrl}. AI hint for image: "${imageAiHint}"`
        );
      } else {
        console.warn('Image generation did not return a media URL. Using default placeholder.');
        imageUrl = `https://placehold.co/800x450.png`;
      }
    } catch (imageError) {
      console.error('Error generating image for blog post:', imageError);
      console.warn('Falling back to a default placeholder image due to error.');
      imageUrl = `https://placehold.co/800x450.png`;
    }

    return {
      ...textOutput,
      imageUrl: imageUrl, // This will be the placeholder URL or undefined
      imageAiHint: imageAiHint,
    };
  }
);
