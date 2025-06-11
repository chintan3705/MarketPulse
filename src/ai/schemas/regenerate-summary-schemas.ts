
/**
 * @fileOverview Zod schemas and TypeScript types for regenerating a blog post summary.
 */
import { z } from "genkit";

export const RegenerateSummaryInputSchema = z.object({
  title: z.string().describe("The title of the blog post."),
  currentContent: z
    .string()
    .describe(
      "The current content or description of the blog post to base the new summary on.",
    ),
  existingSummary: z
    .string()
    .optional()
    .describe("The existing summary, if any, to be improved or replaced."),
});
export type RegenerateSummaryInput = z.infer<
  typeof RegenerateSummaryInputSchema
>;

export const RegenerateSummaryOutputSchema = z.object({
  newSummary: z
    .string()
    .describe("The newly generated concise 2-3 sentence summary."),
});
export type RegenerateSummaryOutput = z.infer<
  typeof RegenerateSummaryOutputSchema
>;
