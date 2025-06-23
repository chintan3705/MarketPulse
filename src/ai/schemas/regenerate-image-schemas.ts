/**
 * @fileOverview Zod schemas and TypeScript types for regenerating a blog post image.
 */
import { z } from "genkit";

export const RegenerateImageInputSchema = z.object({
  title: z.string().describe("The title of the blog post."),
  summary: z.string().describe("The summary of the blog post."),
  currentTags: z
    .array(z.string())
    .optional()
    .describe("Optional current tags to help guide image generation."),
  categoryName: z
    .string()
    .optional()
    .describe("Optional category name to guide image generation."),
});
export type RegenerateImageInput = z.infer<typeof RegenerateImageInputSchema>;

export const RegenerateImageOutputSchema = z.object({
  newImageUrl: z
    .string()
    .url()
    .describe(
      "The URL of the newly generated and uploaded image (Cloudinary URL).",
    ),
  newImageAiHint: z
    .string()
    .describe("A hint derived from the input for the AI-generated image."),
});
export type RegenerateImageOutput = z.infer<typeof RegenerateImageOutputSchema>;
