/**
 * @fileOverview Zod schemas and TypeScript types for regenerating blog post tags.
 */
import { z } from "genkit";

export const RegenerateTagsInputSchema = z.object({
  title: z.string().describe("The title of the blog post."),
  summary: z.string().describe("The summary of the blog post."),
  currentContent: z
    .string()
    .describe(
      "The current content or description of the blog post to base tags on.",
    ),
});
export type RegenerateTagsInput = z.infer<typeof RegenerateTagsInputSchema>;

export const RegenerateTagsOutputSchema = z.object({
  newTags: z
    .array(z.string())
    .min(2)
    .max(5)
    .describe(
      "An array of 2-5 newly generated, highly relevant tags (keywords).",
    ),
});
export type RegenerateTagsOutput = z.infer<typeof RegenerateTagsOutputSchema>;
