
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

// export { GenerateBlogPostOutputSchema }; // This was removed as it caused "use server" export issues
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
      const systemInstruction = generateSystemInstruction(input.categorySlug);
      const { output } = await generateBlogPostTextPrompt(input, {
        prompt: systemInstruction,
      });

      textOutput = output;
      console.log(
        "[generateBlogPostFlow] Successfully received textOutput:",
        textOutput ? "Data received" : "No data",
      );
    } catch (flowError: unknown) {
      const errorMessage =
        flowError instanceof Error ? flowError.message : String(flowError);
      console.error(
        "[generateBlogPostFlow] Error calling generateBlogPostTextPrompt:",
        flowError,
      );
      throw new Error(
        `Failed to generate blog post text content: ${errorMessage}`,
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
      console.warn(
        `[generateBlogPostFlow] AI generated an invalid category slug: ${textOutput.categorySlug}. Defaulting to ${categories[0].slug}.`,
      );
      textOutput.categorySlug = categories[0].slug;
    } else if (categories.length === 0) {
      console.warn(
        `[generateBlogPostFlow] No categories defined. Defaulting categorySlug to "general".`,
      );
      textOutput.categorySlug = "general";
    }

    // --- Image Generation and Upload Section ---
    let imageUrl: string | undefined = undefined; // Initialize imageUrl as undefined
    const imageAiHint =
      textOutput.tags && textOutput.tags.length > 0
        ? textOutput.tags.slice(0, 2).join(" ")
        : input.topic || "financial news article";

    try {
      const categoryForImage =
        categories.find((c) => c.slug === textOutput.categorySlug) ||
        categories.find((c) => c.slug === "general") || {
          name: "Financial",
          slug: "general",
        };

      const imagePromptText = `A visually appealing blog post illustration for an article in the "${categoryForImage.name}" category, titled "${textOutput.title}". The article is about: ${textOutput.summary.substring(0, 150)}... Focus on themes like: ${imageAiHint}. Style: Modern, professional, financial, potentially conceptual or abstract. Avoid text in the image.`;

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
        const imageDataUri = media.url; // This is the base64 data URI from Genkit
        console.log(
          "[generateBlogPostFlow] Image data URI generated successfully by Genkit. Length:",
          imageDataUri.length,
        );

        // --- START: USER INTEGRATION POINT for Third-Party Upload ---
        // TODO: Implement your image upload logic here.
        // 1. Choose a third-party image hosting service (e.g., Cloudinary free tier, Firebase Storage, ImgBB).
        // 2. Create an async helper function (e.g., `async function uploadImageToThirdParty(dataUri: string): Promise<string | undefined>`)
        //    that takes `imageDataUri`, uploads it to your chosen service, and returns the public URL or undefined if upload fails.
        //    Remember to handle API keys and potential errors within that function.
        // 3. Uncomment and use the lines below to call your function and set the `imageUrl`.

        /*
        try {
          const uploadedPublicUrl = await uploadImageToThirdParty(imageDataUri);
          if (uploadedPublicUrl) {
            imageUrl = uploadedPublicUrl;
            console.log(`[generateBlogPostFlow] Image successfully uploaded to third-party. URL: ${imageUrl}`);
          } else {
            console.warn("[generateBlogPostFlow] Image upload to third-party service failed or was skipped. No image URL will be saved for this post.");
            // imageUrl remains undefined
          }
        } catch (uploadError) {
          console.error("[generateBlogPostFlow] Error uploading image to third-party service:", uploadError);
          // imageUrl remains undefined
        }
        */
        // --- END: USER INTEGRATION POINT ---

        // If the TODO section above is not implemented, or if an implemented upload fails and
        // does not set `imageUrl`, then `imageUrl` will remain `undefined`.

        // FOR DEVELOPMENT/TESTING WITHOUT ACTUAL UPLOAD:
        // If you want to use a placeholder when your upload logic isn't ready,
        // you can uncomment and use the block below.
        /*
        if (!imageUrl) { // Only set placeholder if no actual URL was obtained
          imageUrl = `https://placehold.co/800x450.png`;
          console.log(
            `[generateBlogPostFlow] DEVELOPMENT: Using placeholder image URL as actual upload is not implemented/failed. URL: ${imageUrl}. AI hint: "${imageAiHint}"`,
          );
        }
        */
        if (imageUrl) {
          console.log(
            `[generateBlogPostFlow] Using image URL: ${imageUrl}. AI hint for placeholder: "${imageAiHint}"`,
          );
        } else {
           console.log(
            `[generateBlogPostFlow] No image URL set. This means either the //TODO: upload section was not implemented, or it failed to return a URL. Image URL will be undefined for this post.`,
          );
        }


      } else {
        console.warn(
          "[generateBlogPostFlow] Image generation by Genkit did not return a media URL. No image will be used.",
        );
        // imageUrl remains undefined
      }
    } catch (imageGenError: unknown) {
      const errorMessage =
        imageGenError instanceof Error
          ? imageGenError.message
          : String(imageGenError);
      console.error(
        "[generateBlogPostFlow] Error during image generation or upload phase:",
        errorMessage,
        imageGenError, // log the full error object
      );
      if (
        errorMessage.toLowerCase().includes("api key not valid") ||
        errorMessage.toLowerCase().includes("permission denied") ||
        errorMessage.toLowerCase().includes("api_key")
      ) {
        console.error(
          "[generateBlogPostFlow] Potentially an API key issue or Gemini API not enabled for project. Please check GOOGLE_API_KEY and API enablement in Google Cloud Console.",
        );
      }
      console.warn(
        "[generateBlogPostFlow] Falling back to no image due to an error during generation/upload phase.",
      );
      // imageUrl remains undefined
    }

    console.log(
      "[generateBlogPostFlow] Preparing final output. Image URL (if any):",
      imageUrl,
    );
    return {
      ...textOutput,
      imageUrl: imageUrl, // This will be undefined if no image was generated or uploaded
      imageAiHint: imageAiHint,
    };
  },
);

// Example of what your upload function might look like (conceptual):
/*
async function uploadImageToThirdParty(dataUri: string): Promise<string | undefined> {
  // 1. Parse the dataUri to get the base64 data and mime type
  //    const matches = dataUri.match(/^data:(.+);base64,(.+)$/);
  //    if (!matches || matches.length !== 3) {
  //      console.error('Invalid data URI format');
  //      return undefined;
  //    }
  //    const mimeType = matches[1];
  //    const base64Data = matches[2];
  //    // const buffer = Buffer.from(base64Data, 'base64'); // If you need a buffer

  // 2. Use the SDK of your chosen service (e.g., Cloudinary, Firebase Storage, ImgBB)
  //    Example with a hypothetical fetch to a service like ImgBB (you'd need its actual API & key)
  //    const formData = new FormData();
  //    formData.append('image', base64Data); // ImgBB expects base64 string
  //    formData.append('key', process.env.IMGBB_API_KEY); // Store your key in .env.local
  //
  //    try {
  //      const response = await fetch('https://api.imgbb.com/1/upload', {
  //        method: 'POST',
  //        body: formData,
  //      });
  //      if (!response.ok) {
  //        const errorData = await response.json();
  //        console.error(`ImgBB Upload failed: ${errorData.error?.message || response.statusText}`);
  //        return undefined;
  //      }
  //      const result = await response.json();
  //      return result.data.url; // This is the public URL of the uploaded image
  //    } catch (uploadApiError) {
  //      console.error("Error calling third-party upload API:", uploadApiError);
  //      return undefined;
  //    }

  // For testing without actual upload, you can return the data URI itself (though data URIs are not ideal for DB storage and can be very long)
  // console.warn("uploadImageToThirdParty is a stub. Returning undefined.");
  // return undefined;
  // Or, to test with the data URI directly (not recommended for production):
  // return dataUri;
}
*/


