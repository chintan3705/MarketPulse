
'use server';
/**
 * @fileOverview A Genkit flow to generate a blog post based on a topic, including an AI-generated image.
 *
 * - generateBlogPost - A function that handles the blog post generation with image.
 * - GenerateBlogPostInput - The input type for the generateBlogPost function.
 * - GenerateBlogPostOutput - The return type for the generateBlogPost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { categories } from '@/lib/data'; // Import categories for the prompt

const GenerateBlogPostInputSchema = z.object({
  topic: z.string().describe('The topic or keywords for the blog post.'),
});
export type GenerateBlogPostInput = z.infer<typeof GenerateBlogPostInputSchema>;

const GenerateBlogPostOutputSchema = z.object({
  title: z.string().describe('The catchy title of the blog post.'),
  summary: z.string().describe('A concise 2-3 sentence summary of the blog post.'),
  content: z.string().describe('The full blog post content in HTML format. Should include multiple paragraphs, <h3> for subheadings, and <ul>/<li> for lists where appropriate. Aim for 300-500 words.'),
  categorySlug: z.string().describe('The slug of the most relevant category for this blog post from the provided list.'),
  tags: z.array(z.string()).describe('An array of 2-4 relevant tags (keywords) for the blog post.'),
  imageUrl: z.string().optional().describe('The data URI of the AI-generated image for the blog post, if available. Expected format: "data:image/png;base64,<encoded_data>".'),
  imageAiHint: z.string().optional().describe('A hint derived from the topic or tags for the AI-generated image.')
});
export type GenerateBlogPostOutput = z.infer<typeof GenerateBlogPostOutputSchema>;

export async function generateBlogPost(input: GenerateBlogPostInput): Promise<GenerateBlogPostOutput> {
  return generateBlogPostFlow(input);
}

const systemInstruction = `You are an expert financial news writer for a blog called MarketPulse. Your task is to generate a blog post based on the provided topic.

The blog post should be engaging, informative, and suitable for an audience interested in stock markets, finance, and investments.

Available Categories (choose the most relevant one and return its slug):
${categories.map(cat => `- Name: ${cat.name}, Slug: ${cat.slug}`).join('\n')}

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
  output: { schema: GenerateBlogPostOutputSchema.omit({ imageUrl: true, imageAiHint: true }) }, // AI generates text part first
  prompt: systemInstruction,
});

const generateBlogPostFlow = ai.defineFlow(
  {
    name: 'generateBlogPostFlow',
    inputSchema: GenerateBlogPostInputSchema,
    outputSchema: GenerateBlogPostOutputSchema,
  },
  async (input) => {
    // 1. Generate Text Content
    const { output: textOutput } = await generateBlogPostTextPrompt(input);
    if (!textOutput) {
      throw new Error('Failed to generate blog post text content.');
    }

    // Ensure the category slug is valid
    const isValidCategory = categories.some(cat => cat.slug === textOutput.categorySlug);
    if (!isValidCategory && categories.length > 0) {
      textOutput.categorySlug = categories[0].slug;
    } else if (categories.length === 0) {
      textOutput.categorySlug = 'general';
    }

    // 2. Generate Image (Optional)
    let imageUrl: string | undefined = undefined;
    const imageAiHint = textOutput.tags.length > 0 ? textOutput.tags.slice(0,2).join(' ') : input.topic;

    try {
      // Use a concise prompt for the image based on the generated title and summary
      const imagePromptText = `A visually appealing blog post illustration for an article titled "${textOutput.title}". The article is about: ${textOutput.summary.substring(0, 100)}... Focus on themes like: ${imageAiHint}. Financial, modern, abstract or conceptual style.`;
      
      console.log(`Generating image with prompt: ${imagePromptText.substring(0,100)}...`);

      const { media } = await ai.generate({
        model: 'googleai/gemini-2.0-flash-exp', // Explicitly use image-capable model
        prompt: imagePromptText,
        config: {
          responseModalities: ['IMAGE', 'TEXT'], // Must request IMAGE
        },
      });

      if (media && media.url) {
        imageUrl = media.url; // This will be a data URI
        console.log('Image generated successfully.');
      } else {
        console.warn('Image generation did not return a media URL.');
      }
    } catch (imageError) {
      console.error('Error generating image for blog post:', imageError);
      // Proceed without an image if generation fails
    }

    return {
      ...textOutput,
      imageUrl: imageUrl,
      imageAiHint: imageAiHint,
    };
  }
);
