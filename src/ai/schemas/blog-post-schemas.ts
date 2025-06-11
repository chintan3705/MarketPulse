/**
 * @fileOverview Zod schemas and TypeScript types for single blog post generation.
 *
 * - GenerateBlogPostInputSchema - Zod schema for the input of blog post generation.
 * - GenerateBlogPostInput - TypeScript type for the input.
 * - GenerateBlogPostOutputSchema - Zod schema for the output of blog post generation.
 * - GenerateBlogPostOutput - TypeScript type for the output.
 */
import { z } from "genkit";
import { categories } from "@/lib/data";

export const GenerateBlogPostInputSchema = z.object({
  topic: z.string().describe("The topic or keywords for the blog post."),
  categorySlug: z
    .string()
    .optional()
    .describe(
      "Optional slug of the category to guide the blog post generation.",
    ),
});
export type GenerateBlogPostInput = z.infer<typeof GenerateBlogPostInputSchema>;

export const GenerateBlogPostOutputSchema = z.object({
  title: z.string().describe("The catchy title of the blog post."),
  summary: z
    .string()
    .describe("A concise 2-3 sentence summary of the blog post."),
  content: z
    .string()
    .describe(
      "The full blog post content in HTML format. Should include multiple paragraphs, <h3> for subheadings, and <ul>/<li> for lists where appropriate. Aim for 700-1000 words. Include a placeholder like [CHART: Description of chart data] where a chart would be thematically appropriate if chartDataJson is provided.",
    ),
  categorySlug: z
    .string()
    .describe(
      `The slug of the most relevant category for this blog post from the available list. Available slugs: ${categories.map((c) => c.slug).join(", ")}`,
    ),
  tags: z
    .array(z.string())
    .describe("An array of 2-4 relevant tags (keywords) for the blog post, derived from the content."),
  imageUrl: z
    .string()
    .optional()
    .describe(
      "The URL of the AI-generated image for the blog post, if available. This will be the Cloudinary URL.",
    ),
  imageAiHint: z
    .string()
    .optional()
    .describe(
      "A hint derived from the topic or tags for the AI-generated image.",
    ),
  chartType: z
    .enum(["bar", "line", "pie", "table"])
    .optional()
    .describe(
      "Suggested type of chart if data is provided (bar, line, pie, or table).",
    ),
  chartDataJson: z
    .string()
    .optional()
    .describe(
      'A JSON string representing data suitable for the suggested chartType. E.g., for a bar chart: \'[{"name": "Category A", "value": 30}, ...]\' or for a table: \'[{"column1": "Row1Cell1", "column2": "Row1Cell2"}, ...]\'. This data should correspond to the [CHART: ...] placeholder in the content.',
    ),
  detailedInformation: z
    .string()
    .optional()
    .describe(
      "Additional detailed information, facts, or statistics related to the topic that could be used to enrich the post or as source for a chart.",
    ),
});
export type GenerateBlogPostOutput = z.infer<
  typeof GenerateBlogPostOutputSchema
>;
