
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
  GenerateBlogPostOutputSchema,
  type GenerateBlogPostOutput,
} from "../schemas/blog-post-schemas";

export type { GenerateBlogPostInput, GenerateBlogPostOutput };

export async function generateBlogPost(
  input: GenerateBlogPostInput,
): Promise<GenerateBlogPostOutput> {
  console.log("[generateBlogPostFlow] Flow started with input:", input);
  return generateBlogPostFlow(input);
}

const generateSystemInstruction = (userCategorySlug?: string) => {
  let categoryInstruction =
    "Choose the most relevant category from the list provided below and return its slug.";
  if (userCategorySlug) {
    const userCategory = categories.find((c) => c.slug === userCategorySlug);
    if (userCategory) {
      categoryInstruction = `The user has suggested the category '${userCategory.name}' (slug: ${userCategory.slug}). Prioritize generating content relevant to this category and ensure the output categorySlug is '${userCategory.slug}'.`;
    } else {
      categoryInstruction = `The user suggested an invalid category slug ('${userCategorySlug}'). Please choose the most relevant category from the list provided below and return its slug.`;
    }
  }

  return `You are an expert financial news writer for a blog called MarketPulse. Your task is to generate a blog post based on the provided topic.

The blog post should be engaging, informative, and suitable for an audience interested in stock markets, finance, and investments.

${categoryInstruction}

Available Categories (if not user-specified or user-specified is invalid):
${categories.map((cat) => `- Name: ${cat.name}, Slug: ${cat.slug}`).join("\n")}

Topic: {{{topic}}}

Please generate the following:
1. A catchy title.
2. A concise summary (2-3 sentences).
3. The full blog post content in HTML format. The content should be well-structured with multiple paragraphs. You can use <h3> for subheadings, and <ul>/<li> for lists where appropriate. Aim for around 300-500 words for the main content.
4. The slug of the most relevant category (must be one from the 'Available Categories' list).
5. An array of 2-4 relevant tags (keywords).

Ensure the output strictly follows the JSON schema provided for the output, excluding imageUrl and imageAiHint which will be handled separately.
`;
};

const generateBlogPostTextPrompt = ai.definePrompt({
  name: "generateBlogPostTextPrompt",
  input: { schema: GenerateBlogPostInputSchema },
  output: {
    schema: GenerateBlogPostOutputSchema.omit({
      imageUrl: true,
      imageAiHint: true,
    }),
  },
  // prompt is dynamically generated inside the flow
});

const generateBlogPostFlow = ai.defineFlow(
  {
    name: "generateBlogPostFlow",
    inputSchema: GenerateBlogPostInputSchema,
    outputSchema: GenerateBlogPostOutputSchema,
  },
  async (input) => {
    console.log("[generateBlogPostFlow] Inside flow execution. Input:", input);
    let textOutput;
    try {
      console.log(
        `[generateBlogPostFlow] Calling generateBlogPostTextPrompt for topic: ${input.topic}, userCategorySlug: ${input.categorySlug || "none"}`,
      );
      // Dynamically set the prompt for the text generation
      const systemInstruction = generateSystemInstruction(input.categorySlug);
      const { output } = await generateBlogPostTextPrompt(input, {
        prompt: systemInstruction,
      });

      textOutput = output;
      console.log("[generateBlogPostFlow] Successfully received textOutput:", textOutput ? "Data received" : "No data");
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
      textOutput.categorySlug = categories[0].slug;
    } else if (categories.length === 0) {
      console.warn(`[generateBlogPostFlow] No categories defined. Defaulting categorySlug to "general".`);
      textOutput.categorySlug = "general";
    }

    let imageUrl: string | undefined = undefined;
    const imageAiHint =
      textOutput.tags && textOutput.tags.length > 0
        ? textOutput.tags.slice(0, 2).join(" ")
        : input.topic || "financial news";

    try {
      const categoryForImage =
        categories.find((c) => c.slug === textOutput.categorySlug) ||
        categories.find((c) => c.slug === "general") || { name: "Financial", slug: "general" };
      
      const imagePromptText = `A visually appealing blog post illustration for an article in the "${categoryForImage.name}" category, titled "${textOutput.title}". The article is about: ${textOutput.summary.substring(0, 150)}... Focus on themes like: ${imageAiHint}. Style: Modern, professional, financial, potentially conceptual or abstract.`;

      console.log(
        `[generateBlogPostFlow] Attempting to generate image with prompt (first 150 chars): ${imagePromptText.substring(0, 150)}...`,
      );
      
      const { media } = await ai.generate({
        model: "googleai/gemini-2.0-flash-exp",
        prompt: imagePromptText,
        config: {
          responseModalities: ["IMAGE", "TEXT"],
        },
      });

      if (media && media.url) {
        console.log(
          "[generateBlogPostFlow] Image generated successfully by Genkit (as data URI).",
        );
        // TODO: Upload image data to a third-party service (e.g., Cloudinary, Firebase Storage)
        // const imageDataUri = media.url; // This is the base64 data URI from Genkit
        // const uploadedImageUrl = await uploadImageToThirdParty(imageDataUri);
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
      if (imageGenError instanceof Error && (imageGenError.message.toLowerCase().includes("api key not valid") || imageGenError.message.toLowerCase().includes("permission denied") || imageGenError.message.toLowerCase().includes("api_key"))) {
          console.error("[generateBlogPostFlow] Potentially an API key issue or Gemini API not enabled for project. Please check GOOGLE_API_KEY and API enablement in Google Cloud Console.");
      }
      console.warn(
        "[generateBlogPostFlow] Falling back to a default placeholder image due to error.",
      );
      imageUrl = `https://placehold.co/800x450.png`;
    }

    console.log("[generateBlogPostFlow] Preparing final output with image URL and hint.");
    return {
      ...textOutput,
      imageUrl: imageUrl,
      imageAiHint: imageAiHint,
    };
  },
);
