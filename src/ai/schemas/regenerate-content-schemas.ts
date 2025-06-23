/**
 * @fileOverview Zod schemas and TypeScript types for regenerating blog post content.
 */
import { z } from "genkit";

export const RegenerateContentInputSchema = z.object({
  title: z.string().describe("The title of the blog post."),
  summary: z.string().describe("The summary of the blog post."),
  existingContent: z
    .string()
    .optional()
    .describe(
      "Optional existing content to provide context or indicate it's a regeneration task.",
    ),
});
export type RegenerateContentInput = z.infer<
  typeof RegenerateContentInputSchema
>;

export const RegenerateContentOutputSchema = z.object({
  newContent: z
    .string()
    .describe(
      "The newly generated, comprehensive blog post content in HTML format.",
    ),
});
export type RegenerateContentOutput = z.infer<
  typeof RegenerateContentOutputSchema
>;
