
"use server";
/**
 * @fileOverview A Genkit flow to regenerate blog post tags.
 *
 * Exports:
 * - regenerateTags - A function that handles tag regeneration.
 * - type RegenerateTagsInput - The input type.
 * - type RegenerateTagsOutput - The output type.
 */

import { ai } from "@/ai/genkit";
import {
  RegenerateTagsInputSchema,
  RegenerateTagsOutputSchema,
  type RegenerateTagsInput,
  type RegenerateTagsOutput,
} from "../schemas/regenerate-tags-schemas";

export type { RegenerateTagsInput, RegenerateTagsOutput };

export async function regenerateTags(
  input: RegenerateTagsInput,
): Promise<RegenerateTagsOutput> {
  return regenerateTagsFlow(input);
}

const regenerateTagsPrompt = ai.definePrompt({
  name: "regenerateTagsPrompt",
  input: { schema: RegenerateTagsInputSchema },
  output: { schema: RegenerateTagsOutputSchema },
  prompt: `You are an expert financial news tagger for MarketPulse.
Your task is to generate 2-5 new, highly relevant tags (keywords) for a blog post.

Blog Post Title: {{{title}}}
Summary: {{{summary}}}
Full Content/Context:
{{{currentContent}}}

Analyze the provided information and generate tags that are specific, relevant to the financial markets, and useful for categorizing this article.
`,
});

const regenerateTagsFlow = ai.defineFlow(
  {
    name: "regenerateTagsFlow",
    inputSchema: RegenerateTagsInputSchema,
    outputSchema: RegenerateTagsOutputSchema,
  },
  async (input) => {
    const { output } = await regenerateTagsPrompt(input);
    if (!output) {
      throw new Error("Failed to regenerate tags.");
    }
    return output;
  },
);
