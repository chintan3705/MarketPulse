
'use server';
/**
 * @fileOverview A Genkit flow to generate a list of multiple blog posts.
 *
 * - generateMultipleBlogPosts - A function that handles the generation of multiple blog posts.
 * - GenerateMultipleBlogPostsInput - The input type for the generateMultipleBlogPosts function.
 * - GenerateMultipleBlogPostsOutput - The return type for the generateMultipleBlogPosts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { generateBlogPost, type GenerateBlogPostOutput, categories } from './generate-blog-post-flow';
import type { BlogPost, Category } from '@/types';

const GenerateMultipleBlogPostsInputSchema = z.object({
  count: z.number().min(1).max(5).describe('The number of blog posts to generate.'),
  topics: z.array(z.string()).optional().describe('Optional list of specific topics. If not provided, diverse financial topics will be chosen.'),
});
export type GenerateMultipleBlogPostsInput = z.infer<typeof GenerateMultipleBlogPostsInputSchema>;

// Output will be an array of objects that can be mapped to BlogPost type
// We'll use the GenerateBlogPostOutput schema for each item.
const GenerateMultipleBlogPostsOutputSchema = z.array(
  z.object({
    slug: z.string(), // Slug will be derived from the title
    title: z.string(),
    summary: z.string(),
    content: z.string(),
    categorySlug: z.string(),
    tags: z.array(z.string()),
  })
);

export type GenerateMultipleBlogPostsOutput = z.infer<typeof GenerateMultipleBlogPostsOutputSchema>;

export async function generateMultipleBlogPosts(
  input: GenerateMultipleBlogPostsInput
): Promise<BlogPost[]> {
  const results = await generateMultipleBlogPostsFlow(input);
  
  // Map to BlogPost structure
  return results.map((item, index) => {
    const chosenCategory = categories.find(c => c.slug === item.categorySlug) || categories[0];
    return {
      id: `ai-generated-${Date.now()}-${index}`, // Create a unique ID
      slug: item.slug,
      title: item.title,
      summary: item.summary,
      content: item.content,
      category: chosenCategory,
      author: 'MarketPulse AI',
      publishedAt: new Date().toISOString(),
      tags: item.tags,
      isAiGenerated: true,
      // imageUrl: 'https://placehold.co/800x450.png', // Add placeholder or implement image generation
      // imageAiHint: 'financial news technology',
    };
  });
}

const generateMultipleBlogPostsFlow = ai.defineFlow(
  {
    name: 'generateMultipleBlogPostsFlow',
    inputSchema: GenerateMultipleBlogPostsInputSchema,
    outputSchema: GenerateMultipleBlogPostsOutputSchema,
  },
  async (input) => {
    const { count, topics } = input;
    const generatedPosts: GenerateMultipleBlogPostsOutput = [];

    const topicsToGenerate = topics && topics.length > 0 
      ? topics.slice(0, count) 
      : Array(count).fill(null).map((_, i) => `a trending financial news topic, different from others in this list ${i+1}`); // Placeholder topics

    for (let i = 0; i < topicsToGenerate.length; i++) {
      try {
        const topic = topicsToGenerate[i] || `a diverse financial news topic suitable for a blog (e.g., stock market analysis, IPO news, economic trends) - variation ${i+1}`;
        const singlePostOutput: GenerateBlogPostOutput = await generateBlogPost({ topic });
        
        const slug = singlePostOutput.title
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]+/g, '')
          .substring(0, 50);

        generatedPosts.push({
            slug: slug,
            title: singlePostOutput.title,
            summary: singlePostOutput.summary,
            content: singlePostOutput.content,
            categorySlug: singlePostOutput.categorySlug,
            tags: singlePostOutput.tags,
        });
      } catch (error) {
        console.error(`Error generating blog post for topic "${topicsToGenerate[i]}":`, error);
        // Optionally, skip this post or add a placeholder
      }
    }
    return generatedPosts;
  }
);
