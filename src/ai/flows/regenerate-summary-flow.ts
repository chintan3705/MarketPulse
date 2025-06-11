
"use server";
/**
 * @fileOverview A Genkit flow to regenerate a blog post summary.
 *
 * Exports:
 * - regenerateSummary - A function that handles summary regeneration.
 * - type RegenerateSummaryInput - The input type.
 * - type RegenerateSummaryOutput - The output type.
 */

import { ai } from "@/ai/genkit";
import {
  RegenerateSummaryInputSchema,
  RegenerateSummaryOutputSchema,
  type RegenerateSummaryInput,
  type RegenerateSummaryOutput,
} from "../schemas/regenerate-summary-schemas";

export type { RegenerateSummaryInput, RegenerateSummaryOutput };

export async function regenerateSummary(
  input: RegenerateSummaryInput,
): Promise<RegenerateSummaryOutput> {
  return regenerateSummaryFlow(input);
}

const regenerateSummaryPrompt = ai.definePrompt({
  name: "regenerateSummaryPrompt",
  input: { schema: RegenerateSummaryInputSchema },
  output: { schema: RegenerateSummaryOutputSchema },
  prompt: `You are an expert financial news editor for MarketPulse.
Your task is to generate a new, concise (2-3 sentences) summary for a blog post.

Blog Post Title: {{{title}}}
{{#if existingSummary}}
Existing Summary (for improvement or rephrasing): {{{existingSummary}}}
{{/if}}
Full Content/Context to base the summary on:
{{{currentContent}}}

Generate a compelling and accurate summary.
Focus on the key financial takeaways.
`,
});

const regenerateSummaryFlow = ai.defineFlow(
  {
    name: "regenerateSummaryFlow",
    inputSchema: RegenerateSummaryInputSchema,
    outputSchema: RegenerateSummaryOutputSchema,
  },
  async (input) => {
    const { output } = await regenerateSummaryPrompt(input);
    if (!output) {
      throw new Error("Failed to regenerate summary.");
    }
    return output;
  },
);
