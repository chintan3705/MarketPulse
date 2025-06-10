"use server";
/**
 * @fileOverview A Genkit flow to generate a list of multiple blog posts, including AI-generated images.
 *
 * Exports:
 * - generateMultipleBlogPostsFlow - The Genkit flow function.
 * - type GenerateMultipleBlogPostsInput - The input type.
 * - type GenerateMultipleBlogPostsFlowOutput - The output type of the flow.
 */

import { ai } from "@/ai/genkit";
import {
  generateBlogPost,
  type GenerateBlogPostInput,
  type GenerateBlogPostOutput,
} from "./generate-blog-post-flow";
import {
  GenerateMultipleBlogPostsInputSchema,
  type GenerateMultipleBlogPostsInput,
  GenerateMultipleBlogPostsFlowOutputSchema,
  type GenerateMultipleBlogPostsFlowOutput,
} from "../schemas/multiple-blog-posts-schemas";

export type {
  GenerateMultipleBlogPostsInput,
  GenerateMultipleBlogPostsFlowOutput,
};

// This is the direct Genkit flow. The API route will handle saving to DB.
export const generateMultipleBlogPostsFlow = ai.defineFlow(
  {
    name: "generateMultipleBlogPostsFlow",
    inputSchema: GenerateMultipleBlogPostsInputSchema,
    outputSchema: GenerateMultipleBlogPostsFlowOutputSchema,
  },
  async (input): Promise<GenerateMultipleBlogPostsFlowOutput> => {
    const { count, topics, categorySlug } = input;
    const generatedPostsOutput: GenerateBlogPostOutput[] = [];

    console.log(
      `[generateMultipleBlogPostsFlow] Starting generation for ${count} posts. Topics provided: ${topics?.length || 0}. Global category: ${categorySlug || "AI per post"}`,
    );

    const topicsToGenerate: string[] = [];
    if (topics && topics.length > 0) {
      topicsToGenerate.push(...topics.slice(0, count));
    }
    // Fill remaining slots with generic topic prompts if not enough topics provided
    const remainingCount = count - topicsToGenerate.length;
    if (remainingCount > 0) {
      for (let i = 0; i < remainingCount; i++) {
        topicsToGenerate.push(
          `a trending financial news topic, distinct from others previously generated in this batch (variation ${topicsToGenerate.length + 1})`,
        );
      }
    }

    for (let i = 0; i < topicsToGenerate.length; i++) {
      const topic = topicsToGenerate[i];
      console.log(
        `[generateMultipleBlogPostsFlow] Generating post ${i + 1}/${count} for topic: "${topic}"`,
      );
      try {
        const singlePostInput: GenerateBlogPostInput = { topic };
        if (categorySlug && categorySlug !== "ai-choose-per-post") {
          singlePostInput.categorySlug = categorySlug;
        }

        const singlePostOutput = await generateBlogPost(singlePostInput);
        generatedPostsOutput.push(singlePostOutput);
        console.log(
          `[generateMultipleBlogPostsFlow] Successfully generated post for topic: "${topic}"`,
        );
      } catch (error) {
        console.error(
          `[generateMultipleBlogPostsFlow] Error generating blog post for topic "${topic}":`,
          error,
        );
        // Optionally, decide if you want to throw or continue generating others.
        // For now, we continue, and the API can report partial success/failure.
      }
    }
    console.log(
      `[generateMultipleBlogPostsFlow] Finished. Generated ${generatedPostsOutput.length} posts.`,
    );
    return generatedPostsOutput;
  },
);
