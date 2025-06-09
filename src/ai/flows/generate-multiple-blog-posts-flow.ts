'use server';
/**
 * @fileOverview A Genkit flow to generate a list of multiple blog posts, including AI-generated images.
 *
 * Exports:
 * - generateMultipleBlogPosts - A function that handles the generation of multiple blog posts.
 * - type GenerateMultipleBlogPostsInput - The input type.
 * - type GenerateMultipleBlogPostsOutput - The return type for the main exported function (mapped to BlogPost[]).
 */

import { ai } from '@/ai/genkit';
import { categories } from '@/lib/data';
import type { BlogPost } from '@/types';
import { generateBlogPost } from './generate-blog-post-flow';
import type { GenerateBlogPostOutput } from '../schemas/blog-post-schemas';
import {
  GenerateMultipleBlogPostsInputSchema,
  type GenerateMultipleBlogPostsInput,
  GenerateMultipleBlogPostsFlowOutputSchema,
} from '../schemas/multiple-blog-posts-schemas';
import { setPost as cacheSetPost } from '@/lib/aiPostCache';

export type { GenerateMultipleBlogPostsInput }; // Re-export input type

// The exported function returns Promise<BlogPost[]>

export async function generateMultipleBlogPosts(
  input: GenerateMultipleBlogPostsInput
): Promise<BlogPost[]> {
  const flowResults = await generateMultipleBlogPostsFlow(input);

  const blogPosts: BlogPost[] = flowResults.map((item, index) => {
    const chosenCategory =
      categories.find((c) => c.slug === item.categorySlug) ||
      (categories.length > 0 ? categories[0] : { id: 'general', name: 'General', slug: 'general' });

    const postSlug =
      item.title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .substring(0, 70) + `-ai-${Date.now()}-${index}`;

    return {
      id: `ai-generated-${Date.now()}-${index}`,
      slug: postSlug,
      title: item.title,
      summary: item.summary,
      content: item.content,
      category: chosenCategory,
      author: 'MarketPulse AI',
      publishedAt: new Date().toISOString(),
      tags: item.tags,
      isAiGenerated: true,
      imageUrl: item.imageUrl,
      imageAiHint: item.imageAiHint || item.tags.slice(0, 2).join(' ') || 'financial news',
    };
  });

  // Cache the newly generated posts
  blogPosts.forEach((post) => {
    if (post.slug) {
      cacheSetPost(post.slug, post, 15); // Cache for 15 minutes
    }
  });

  return blogPosts;
}

const generateMultipleBlogPostsFlow = ai.defineFlow(
  {
    name: 'generateMultipleBlogPostsFlow',
    inputSchema: GenerateMultipleBlogPostsInputSchema,
    outputSchema: GenerateMultipleBlogPostsFlowOutputSchema,
  },
  async (input) => {
    const { count, topics } = input;
    const generatedPostsOutput: GenerateBlogPostOutput[] = [];

    const topicsToGenerate =
      topics && topics.length > 0
        ? topics.slice(0, count)
        : Array(count)
            .fill(null)
            .map(
              (_, i) =>
                `a trending financial news topic, different from others in this list ${i + 1}`
            );

    for (let i = 0; i < topicsToGenerate.length; i++) {
      try {
        const topic =
          topicsToGenerate[i] ||
          `a diverse financial news topic suitable for a blog (e.g., stock market analysis, IPO news, economic trends) - variation ${i + 1}`;
        const singlePostOutput: GenerateBlogPostOutput = await generateBlogPost({ topic });

        generatedPostsOutput.push(singlePostOutput);
      } catch (error) {
        console.error(
          `Error generating blog post (and image) for topic "${topicsToGenerate[i]}":`,
          error
        );
        // Optionally, decide if you want to throw or continue generating others
      }
    }
    return generatedPostsOutput;
  }
);
