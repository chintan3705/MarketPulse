
'use server';
/**
 * @fileOverview A Genkit flow to generate a list of multiple blog posts, including AI-generated images.
 *
 * Exports:
 * - generateMultipleBlogPosts - A function that handles the generation of multiple blog posts.
 * - type GenerateMultipleBlogPostsInput - The input type.
 * - type GenerateMultipleBlogPostsOutput - The return type for the main exported function (mapped to BlogPost[]).
 */

import {ai} from '@/ai/genkit';
import { categories } from '@/lib/data';
import type { BlogPost } from '@/types';
import { generateBlogPost } from './generate-blog-post-flow';
import type { GenerateBlogPostOutput } from '../schemas/blog-post-schemas'; // Import type from schema file
import {
  GenerateMultipleBlogPostsInputSchema,
  type GenerateMultipleBlogPostsInput,
  GenerateMultipleBlogPostsFlowOutputSchema,
  // type GenerateMultipleBlogPostsFlowOutput // This type is for the internal flow, not the exported function
} from '../schemas/multiple-blog-posts-schemas';

export type { GenerateMultipleBlogPostsInput }; // Re-export input type

// The exported function returns Promise<BlogPost[]>
// The internal flow output type is GenerateMultipleBlogPostsFlowOutput

export async function generateMultipleBlogPosts(
  input: GenerateMultipleBlogPostsInput
): Promise<BlogPost[]> {
  const results = await generateMultipleBlogPostsFlow(input);
  
  return results.map((item, index) => {
    const chosenCategory = categories.find(c => c.slug === item.categorySlug) || 
                           (categories.length > 0 ? categories[0] : { id: 'general', name: 'General', slug: 'general' });
    return {
      id: `ai-generated-${Date.now()}-${index}`,
      slug: item.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').substring(0, 70),
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
    outputSchema: GenerateMultipleBlogPostsFlowOutputSchema,
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
        const singlePostOutput: GenerateBlogPostOutput = await generateBlogPost({ topic });
        
        generatedPosts.push(singlePostOutput);

      } catch (error) {
        console.error(`Error generating blog post (and image) for topic "${topicsToGenerate[i]}":`, error);
      }
    }
    return generatedPosts;
  }
);
