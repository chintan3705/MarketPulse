/**
 * @fileOverview Zod schemas and TypeScript types for multiple blog post generation.
 *
 * - GenerateMultipleBlogPostsInputSchema - Zod schema for the input.
 * - GenerateMultipleBlogPostsInput - TypeScript type for the input.
 */
import { z } from "genkit";
import { GenerateBlogPostOutputSchema } from "./blog-post-schemas";

export const GenerateMultipleBlogPostsInputSchema = z.object({
  count: z
    .number()
    .min(1)
    .max(2)
    .describe(
      "The number of blog posts to generate (max 2 due to performance with images).",
    ),
  topics: z
    .array(z.string())
    .optional()
    .describe(
      "Optional list of specific topics. If not provided, diverse financial topics will be chosen.",
    ),
});
export type GenerateMultipleBlogPostsInput = z.infer<
  typeof GenerateMultipleBlogPostsInputSchema
>;

// This schema is used internally by the flow, but the function output type is BlogPost[]
export const GenerateMultipleBlogPostsFlowOutputSchema = z.array(
  GenerateBlogPostOutputSchema,
);
export type GenerateMultipleBlogPostsFlowOutput = z.infer<
  typeof GenerateMultipleBlogPostsFlowOutputSchema
>;
