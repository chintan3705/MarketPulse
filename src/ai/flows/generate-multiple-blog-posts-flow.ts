
'use server';
/**
 * @fileOverview A Genkit flow to generate a list of multiple blog posts, including AI-generated images.
 *
 * - generateMultipleBlogPosts - A function that handles the generation of multiple blog posts.
 * - GenerateMultipleBlogPostsInput - The input type for the generateMultipleBlogPosts function.
 * - GenerateMultipleBlogPostsOutput - The return type for the generateMultipleBlogPosts function. (Internal flow output)
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { generateBlogPost, type GenerateBlogPostOutput } from './generate-blog-post-flow';
import { categories } from '@/lib/data';
import type { BlogPost } from '@/types';

const GenerateMultipleBlogPostsInputSchema = z.object({
  count: z.number().min(1).max(3).describe('The number of blog posts to generate (max 3 due to performance).'), // Reduced max for performance
  topics: z.array(z.string()).optional().describe('Optional list of specific topics. If not provided, diverse financial topics will be chosen.'),
});
export type GenerateMultipleBlogPostsInput = z.infer<typeof GenerateMultipleBlogPostsInputSchema>;

// Internal flow output - matches GenerateBlogPostOutput for each item
const FlowOutputSchema = z.array(GenerateBlogPostOutputSchema);

export async function generateMultipleBlogPosts(
  input: GenerateMultipleBlogPostsInput
): Promise<BlogPost[]> {
  const results = await generateMultipleBlogPostsFlow(input);
  
  // Map to BlogPost structure
  return results.map((item, index) => {
    const chosenCategory = categories.find(c => c.slug === item.categorySlug) || (categories.length > 0 ? categories[0] : { id: 'general', name: 'General', slug: 'general' });
    return {
      id: `ai-generated-${Date.now()}-${index}`,
      slug: item.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').substring(0, 70), // Ensure slug is derived here too
      title: item.title,
      summary: item.summary,
      content: item.content,
      category: chosenCategory,
      author: 'MarketPulse AI',
      publishedAt: new Date().toISOString(),
      tags: item.tags,
      isAiGenerated: true,
      imageUrl: item.imageUrl, 
      imageAiHint: item.imageAiHint || item.tags.slice(0,2).join(' ') || 'financial news',
    };
  });
}

const generateMultipleBlogPostsFlow = ai.defineFlow(
  {
    name: 'generateMultipleBlogPostsFlow',
    inputSchema: GenerateMultipleBlogPostsInputSchema,
    outputSchema: FlowOutputSchema, // Output an array of full GenerateBlogPostOutput
  },
  async (input) => {
    const { count, topics } = input;
    const generatedPosts: GenerateBlogPostOutput[] = [];

    const topicsToGenerate = topics && topics.length > 0 
      ? topics.slice(0, count) 
      : Array(count).fill(null).map((_, i) => `a trending financial news topic, different from others in this list ${i+1}`);

    for (let i = 0; i < topicsToGenerate.length; i++) {
      try {
        const topic = topicsToGenerate[i] || `a diverse financial news topic suitable for a blog (e.g., stock market analysis, IPO news, economic trends) - variation ${i+1}`;
        // generateBlogPost now returns title, summary, content, categorySlug, tags, AND imageUrl, imageAiHint
        const singlePostOutput: GenerateBlogPostOutput = await generateBlogPost({ topic });
        
        generatedPosts.push(singlePostOutput);

      } catch (error) {
        console.error(`Error generating blog post (and image) for topic "${topicsToGenerate[i]}":`, error);
        // Optionally, skip this post or add a placeholder with no image
        // For simplicity, we'll skip if there's a major error in generating the post itself.
        // The generateBlogPost flow itself handles optional image, so it should return text content even if image fails.
      }
    }
    return generatedPosts;
  }
);
