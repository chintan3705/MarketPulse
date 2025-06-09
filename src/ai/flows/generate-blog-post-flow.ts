
"use server";
/**
 * @fileOverview A Genkit flow to generate a blog post based on a topic, including an AI-generated image.
 *
 * Exports:
 * - generateBlogPost - A function that handles the blog post generation with image.
 * - type GenerateBlogPostInput - The input type for the generateBlogPost function.
 * - type GenerateBlogPostOutput - The return type for the generateBlogPost function.
 */

import { ai } from "@/ai/genkit";
import { categories } from "@/lib/data";
import {
  GenerateBlogPostInputSchema,
  type GenerateBlogPostInput,
  GenerateBlogPostOutputSchema, // This schema is used internally by the flow
  type GenerateBlogPostOutput,
} from "../schemas/blog-post-schemas";

// Do not re-export the schema object from a 'use server' file.
// Types can be re-exported.
export type { GenerateBlogPostInput, GenerateBlogPostOutput };

export async function generateBlogPost(
  input: GenerateBlogPostInput,
): Promise<GenerateBlogPostOutput> {
  return generateBlogPostFlow(input);
}

const systemInstruction = `You are an expert financial news writer for a blog called MarketPulse. Your task is to generate a blog post based on the provided topic.

The blog post should be engaging, informative, and suitable for an audience interested in stock markets, finance, and investments.

Available Categories (choose the most relevant one and return its slug):
${categories.map((cat) => `- Name: ${cat.name}, Slug: ${cat.slug}`).join("\n")}

Topic: {{{topic}}}

Please generate the following:
1. A catchy title.
2. A concise summary (2-3 sentences).
3. The full blog post content in HTML format. The content should be well-structured with multiple paragraphs. You can use <h3> for subheadings, and <ul>/<li> for lists where appropriate. Aim for around 300-500 words for the main content.
4. The slug of the most relevant category from the list provided above.
5. An array of 2-4 relevant tags (keywords).

Ensure the output strictly follows the JSON schema provided for the output, excluding imageUrl and imageAiHint which will be handled separately.
`;

const generateBlogPostTextPrompt = ai.definePrompt({
  name: "generateBlogPostTextPrompt",
  input: { schema: GenerateBlogPostInputSchema },
  output: {
    schema: GenerateBlogPostOutputSchema.omit({
      imageUrl: true,
      imageAiHint: true,
    }),
  },
  prompt: systemInstruction,
});

const generateBlogPostFlow = ai.defineFlow(
  {
    name: "generateBlogPostFlow",
    inputSchema: GenerateBlogPostInputSchema,
    outputSchema: GenerateBlogPostOutputSchema,
  },
  async (input) => {
    let textOutput;
    try {
      console.log(
        `[generateBlogPostFlow] Calling generateBlogPostTextPrompt for topic: ${input.topic}`,
      );
      const { output } = await generateBlogPostTextPrompt(input);
      textOutput = output;
      console.log("[generateBlogPostFlow] Successfully received textOutput.");
    } catch (flowError: unknown) {
      console.error(
        "[generateBlogPostFlow] Error calling generateBlogPostTextPrompt:",
        flowError,
      );
      throw new Error(
        `Failed to generate blog post text content: ${
          flowError instanceof Error ? flowError.message : String(flowError)
        }`,
      );
    }

    if (!textOutput) {
      console.error(
        "[generateBlogPostFlow] textOutput is null or undefined after prompt call.",
      );
      throw new Error(
        "Failed to generate blog post text content: received no output.",
      );
    }

    const isValidCategory = categories.some(
      (cat) => cat.slug === textOutput.categorySlug,
    );
    if (!isValidCategory && categories.length > 0) {
      console.warn(`[generateBlogPostFlow] AI generated an invalid category slug: ${textOutput.categorySlug}. Defaulting to ${categories[0].slug}.`);
      textOutput.categorySlug = categories[0].slug; // Default to first category if AI hallucinates
    } else if (categories.length === 0) {
      console.warn(`[generateBlogPostFlow] No categories defined. Defaulting categorySlug to "general".`);
      textOutput.categorySlug = "general"; // Fallback if no categories defined
    }

    let imageUrl: string | undefined = undefined;
    // Define imageAiHint here as it's used in the image prompt log
    const imageAiHint =
      textOutput.tags && textOutput.tags.length > 0
        ? textOutput.tags.slice(0, 2).join(" ")
        : input.topic || "financial news";

    try {
      const categoryNameForImage =
        categories.find((c) => c.slug === textOutput.categorySlug)?.name ||
        "financial";
      const imagePromptText = `A visually appealing blog post illustration for an article in the "${categoryNameForImage}" category, titled "${textOutput.title}". The article is about: ${textOutput.summary.substring(0, 100)}... Focus on themes like: ${imageAiHint}. Financial, modern, abstract or conceptual style.`;

      console.log(
        `[generateBlogPostFlow] Attempting to generate image with prompt (first 100 chars): ${imagePromptText.substring(0, 100)}...`,
      );

      // TODO: Check if GOOGLE_API_KEY is actually available to the Genkit instance.
      // This often requires the key to be present in the environment where Genkit runs.

      const { media } = await ai.generate({
        model: "googleai/gemini-2.0-flash-exp",
        prompt: imagePromptText,
        config: {
          responseModalities: ["IMAGE", "TEXT"], // Ensure TEXT is included
        },
      });

      if (media && media.url) {
        console.log(
          "[generateBlogPostFlow] Image generated successfully by Genkit (as data URI).",
        );
        // TODO: Upload image data to a third-party service (e.g., Cloudinary, Firebase Storage)
        // const imageDataUri = media.url;
        // const uploadedImageUrl = await uploadToThirdParty(imageDataUri);
        // imageUrl = uploadedImageUrl;
        imageUrl = `https://placehold.co/800x450.png`; // Using placeholder for now
        console.log(
          `[generateBlogPostFlow] Using placeholder URL: ${imageUrl}. AI hint: "${imageAiHint}"`,
        );
      } else {
        console.warn(
          "[generateBlogPostFlow] Image generation did not return a media URL. Using default placeholder.",
        );
        imageUrl = `https://placehold.co/800x450.png`;
      }
    } catch (imageGenError: unknown) {
      console.error(
        "[generateBlogPostFlow] Error during image generation:",
        imageGenError,
      );
      // Check if it's an API key related error (this is a common pattern for Google AI)
      if (imageGenError instanceof Error && (imageGenError.message.toLowerCase().includes("api key not valid") || imageGenError.message.toLowerCase().includes("permission denied"))) {
          console.error("[generateBlogPostFlow] Potentially an API key issue or Gemini API not enabled for project. Please check GOOGLE_API_KEY and API enablement in Google Cloud Console.");
      }
      console.warn(
        "[generateBlogPostFlow] Falling back to a default placeholder image due to error.",
      );
      imageUrl = `https://placehold.co/800x450.png`;
    }

    return {
      ...textOutput,
      imageUrl: imageUrl,
      imageAiHint: imageAiHint, // Ensure imageAiHint is consistently returned
    };
  },
);
