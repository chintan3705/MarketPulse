
"use server";
/**
 * @fileOverview A Genkit flow to regenerate comprehensive blog post content.
 *
 * Exports:
 * - regenerateContent - A function that handles content regeneration.
 * - type RegenerateContentInput - The input type.
 * - type RegenerateContentOutput - The output type.
 */

import { ai } from "@/ai/genkit";
import {
  RegenerateContentInputSchema,
  RegenerateContentOutputSchema,
  type RegenerateContentInput,
  type RegenerateContentOutput,
} from "../schemas/regenerate-content-schemas";

export type { RegenerateContentInput, RegenerateContentOutput };

export async function regenerateContent(
  input: RegenerateContentInput,
): Promise<RegenerateContentOutput> {
  return regenerateContentFlow(input);
}

const regenerateContentPrompt = ai.definePrompt({
  name: "regenerateContentPrompt",
  input: { schema: RegenerateContentInputSchema },
  output: { schema: RegenerateContentOutputSchema },
  prompt: `You are an expert financial news writer for MarketPulse, tasked with generating comprehensive and in-depth blog post content.

Blog Post Title: {{{title}}}
Summary/Key Points: {{{summary}}}

{{#if existingContent}}
The user has provided existing content, possibly as a base or for improvement:
{{{existingContent}}}
Please use this as context if helpful, but focus on generating a new, rich, and detailed article.
{{/if}}

Based on the title and summary, generate a full blog post content in HTML format.
The content should be well-researched, highly informative, and suitable for an audience interested in stock markets, finance, and investments.
Aim for a substantial word count (approximately 700-1200 words or more if the topic warrants it).
Provide detailed explanations, statistical data where relevant, interesting facts, and nuanced perspectives.
Structure the content with multiple paragraphs. Use <h3> for subheadings to break up the text logically. Use <ul>/<li> for lists where appropriate.
The content MUST be exclusively focused on share market, finance, and investment topics relevant to MarketPulse.
Ensure the output strictly follows the JSON schema provided for the output (just the 'newContent' field containing the HTML).
Do not include any preamble like "Here is the generated content:". Just provide the HTML for the 'newContent' field.
`,
});

const regenerateContentFlow = ai.defineFlow(
  {
    name: "regenerateContentFlow",
    inputSchema: RegenerateContentInputSchema,
    outputSchema: RegenerateContentOutputSchema,
  },
  async (input) => {
    console.log(
      "🔄 [regenerateContentFlow] Content regeneration flow started. Input:",
      input.title,
    );
    const { output } = await regenerateContentPrompt(input);
    if (!output) {
      throw new Error("Failed to regenerate content. AI returned no output.");
    }
    console.log(
      "✅ [regenerateContentFlow] Content regenerated successfully. Length:",
      output.newContent.length,
    );
    return output;
  },
);
