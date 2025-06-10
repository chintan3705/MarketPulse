/**
 * @fileOverview Zod schemas and TypeScript types for multiple blog post generation.
 *
 * - GenerateMultipleBlogPostsInputSchema - Zod schema for the input.
 * - GenerateMultipleBlogPostsInput - TypeScript type for the input.
 */
import { z } from "genkit";
import {
  GenerateBlogPostOutputSchema,
  type GenerateBlogPostOutput,
} from "./blog-post-schemas";

export const GenerateMultipleBlogPostsInputSchema = z.object({
  count: z
    .number()
    .min(1)
    .max(10) // Increased max count
    .describe(
      "The number of blog posts to generate (min 1, max 10). Image generation for many posts can be slow.",
    ),
  topics: z
    .array(z.string().min(3)) // Ensure topics are somewhat meaningful
    .optional()
    .describe(
      "Optional list of specific topics. If not provided, or if fewer topics than count, diverse financial topics will be chosen for the remainder.",
    ),
  categorySlug: z
    .string()
    .optional()
    .describe(
      "Optional global category slug for all generated posts. If not provided or set to 'ai-choose-per-post', AI will choose a category for each post individually.",
    ),
});
export type GenerateMultipleBlogPostsInput = z.infer<
  typeof GenerateMultipleBlogPostsInputSchema
>;

// This schema is used internally by the flow, and the API will map its output.
export const GenerateMultipleBlogPostsFlowOutputSchema = z.array(
  GenerateBlogPostOutputSchema,
);
export type GenerateMultipleBlogPostsFlowOutput = GenerateBlogPostOutput[];
