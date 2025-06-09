
/**
 * @fileOverview Zod schemas and TypeScript types for single blog post generation.
 *
 * - GenerateBlogPostInputSchema - Zod schema for the input of blog post generation.
 * - GenerateBlogPostInput - TypeScript type for the input.
 * - GenerateBlogPostOutputSchema - Zod schema for the output of blog post generation.
 * - GenerateBlogPostOutput - TypeScript type for the output.
 */
import {z} from 'genkit';
import { categories } from '@/lib/data'; // Import categories for the prompt in the flow

export const GenerateBlogPostInputSchema = z.object({
  topic: z.string().describe('The topic or keywords for the blog post.'),
});
export type GenerateBlogPostInput = z.infer<typeof GenerateBlogPostInputSchema>;

export const GenerateBlogPostOutputSchema = z.object({
  title: z.string().describe('The catchy title of the blog post.'),
  summary: z.string().describe('A concise 2-3 sentence summary of the blog post.'),
  content: z.string().describe('The full blog post content in HTML format. Should include multiple paragraphs, <h3> for subheadings, and <ul>/<li> for lists where appropriate. Aim for 300-500 words.'),
  categorySlug: z.string().describe(`The slug of the most relevant category for this blog post from the available list. Available slugs: ${categories.map(c => c.slug).join(', ')}`),
  tags: z.array(z.string()).describe('An array of 2-4 relevant tags (keywords) for the blog post.'),
  imageUrl: z.string().optional().describe('The data URI of the AI-generated image for the blog post, if available. Expected format: "data:image/png;base64,<encoded_data>".'),
  imageAiHint: z.string().optional().describe('A hint derived from the topic or tags for the AI-generated image.')
});
export type GenerateBlogPostOutput = z.infer<typeof GenerateBlogPostOutputSchema>;
