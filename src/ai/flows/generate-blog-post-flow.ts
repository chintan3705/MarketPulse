
'use server';
/**
 * @fileOverview A Genkit flow to generate a blog post based on a topic.
 *
 * - generateBlogPost - A function that handles the blog post generation.
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

Ensure the output strictly follows the JSON schema provided for the output.
`;

const generateBlogPostPrompt = ai.definePrompt({
  name: 'generateBlogPostPrompt',
  input: { schema: GenerateBlogPostInputSchema },
  output: { schema: GenerateBlogPostOutputSchema },
  prompt: systemInstruction,
});

const generateBlogPostFlow = ai.defineFlow(
  {
    name: 'generateBlogPostFlow',
    inputSchema: GenerateBlogPostInputSchema,
    outputSchema: GenerateBlogPostOutputSchema,
  },
  async (input) => {
    const { output } = await generateBlogPostPrompt(input);
    if (!output) {
      throw new Error('Failed to generate blog post content.');
    }
    // Ensure the category slug is valid
    const isValidCategory = categories.some(cat => cat.slug === output.categorySlug);
    if (!isValidCategory && categories.length > 0) {
      // Default to the first category if the AI hallucinates one
      output.categorySlug = categories[0].slug;
    } else if (categories.length === 0) {
      output.categorySlug = 'general'; // Fallback if no categories exist
    }
    return output;
  }
);
