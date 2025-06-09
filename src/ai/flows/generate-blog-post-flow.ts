
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

// Types can be exported from "use server" files
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

// --- START: USER INTEGRATION POINT for Third-Party Upload ---
// This is an example stub. You need to implement this function
// to upload the image data to your chosen third-party service.
/*
async function uploadImageToThirdParty(
  imageDataUri: string,
  fileNamePrefix: string = "blog-image",
): Promise<string | undefined> {
  console.log(
    `[uploadImageToThirdParty] Called with imageDataUri (length: ${imageDataUri.length})`,
  );

  // **1. Choose your service and get credentials (e.g., ImgBB, Cloudinary, Firebase Storage)**
  //    Store credentials securely (e.g., in .env.local).
  //    const YOUR_SERVICE_API_KEY = process.env.IMAGE_UPLOAD_API_KEY;
  //    const YOUR_SERVICE_UPLOAD_ENDPOINT = "https://api.yourchosenervice.com/upload";

  // **2. Prepare the data for upload**
  //    This often involves converting the data URI to a Blob or using the base64 string directly,
  //    depending on the service's API.

  //    Example: Converting data URI to Blob
  //    const fetchResponse = await fetch(imageDataUri);
  //    const blob = await fetchResponse.blob();
  //    const uniqueFileName = `${fileNamePrefix}-${Date.now()}.${blob.type.split('/')[1] || 'png'}`;

  // **3. Make the API request to your chosen service**
  //    Use `fetch` or the service's SDK.

  //    Example using FormData with `fetch` (common for many services):
  //    const formData = new FormData();
  //    formData.append('image', blob, uniqueFileName); // 'image' is often the field name
  //    // formData.append('key', YOUR_SERVICE_API_KEY); // If API key is sent in form data
  //
  //    try {
  //      const response = await fetch(YOUR_SERVICE_UPLOAD_ENDPOINT, {
  //        method: 'POST',
  //        body: formData,
  //        // headers: { 'Authorization': `Bearer ${YOUR_SERVICE_API_KEY}` }, // If API key is in header
  //      });
  //
  //      if (!response.ok) {
  //        const errorBody = await response.text();
  //        console.error(
  //         `[uploadImageToThirdParty] Upload failed: ${response.status}`,
  //          errorBody,
  //        );
  //        return undefined;
  //      }
  //
  //      const result = await response.json(); // Response format depends on the service
  //      // Assuming the service returns a JSON object with a 'data.url' or similar field
  //      const publicUrl = result?.data?.url || result?.link || result?.secure_url;
  //
  //      if (publicUrl) {
  //        console.log(
  //          `[uploadImageToThirdParty] Image uploaded successfully. URL: ${publicUrl}`,
  //        );
  //        return publicUrl;
  //      } else {
  //        console.error(
  //          "[uploadImageToThirdParty] Upload successful, but no URL found in response:",
  //          result,
  //        );
  //        return undefined;
  //      }
  //    } catch (uploadError) {
  //      console.error(
  //        "[uploadImageToThirdParty] Error during upload API call:",
  //        uploadError,
  //      );
  //      return undefined;
  //    }

  // **IF YOU ARE NOT READY TO IMPLEMENT, COMMENT OUT THE CALL TO THIS FUNCTION BELOW**
  // **OR RETURN A PLACEHOLDER FOR DEVELOPMENT**
  console.warn(
    "[uploadImageToThirdParty] STUB FUNCTION: Actual image upload not implemented. Returning undefined.",
  );
  return undefined; // Or return a placeholder like "https://placehold.co/800x450.png/0e1a2b/d3dce6?text=Upload+Failed"
}
*/
// --- END: USER INTEGRATION POINT ---

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

    let imageUrl: string | undefined = undefined;
    const imageAiHint =
      textOutput.tags && textOutput.tags.length > 0
        ? textOutput.tags.slice(0, 2).join(" ")
        : input.topic.substring(0, 50) || "financial news article"; // Use part of topic if tags are sparse

    try {
      const categoryForImage =
        categories.find((c) => c.slug === textOutput.categorySlug) ||
        categories.find((c) => c.slug === "general") || {
          name: "Financial",
          slug: "general",
        };

      const imagePromptText = `Generate an image primarily themed around "${imageAiHint}". This image is for a blog post in the "${categoryForImage.name}" category, titled "${textOutput.title}", which is about "${textOutput.summary.substring(0, 120)}...". The image should be visually appealing, modern, professional, and financial in style, possibly conceptual or abstract. Avoid text in the image.`;

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
        const imageDataUri = media.url;
        console.log(
          `[generateBlogPostFlow] Image data URI generated by Genkit. Length: ${imageDataUri.length}. Hint: "${imageAiHint}"`,
        );

        // --- USER INTEGRATION: Call your upload function here ---
        // Uncomment and implement the `uploadImageToThirdParty` function above,
        // then uncomment the line below to call it.
        /*
        try {
          const uploadedPublicUrl = await uploadImageToThirdParty(
            imageDataUri,
            textOutput.title.toLowerCase().replace(/\s+/g, "-").substring(0,30) // pass a sanitized title as part of filename
          );
          if (uploadedPublicUrl) {
            imageUrl = uploadedPublicUrl;
            console.log(`[generateBlogPostFlow] Image successfully uploaded. URL: ${imageUrl}`);
          } else {
            console.warn("[generateBlogPostFlow] Image upload failed or was skipped. No image URL will be saved.");
          }
        } catch (uploadError) {
          console.error("[generateBlogPostFlow] Error calling uploadImageToThirdParty:", uploadError);
        }
        */
        // --- END USER INTEGRATION ---

        // Fallback/Placeholder logic (optional, for development if upload isn't implemented yet)
        // If you want a placeholder *during development* while actual upload is pending,
        // and your upload function isn't setting imageUrl, uncomment the block below.
        // Make sure to remove or comment this out for production if you want `undefined` when upload fails.
        /*
        if (!imageUrl && process.env.NODE_ENV === 'development') {
          imageUrl = `https://placehold.co/800x450.png/0e1a2b/d3dce6?text=${encodeURIComponent(imageAiHint)}`;
          console.log(
            `[generateBlogPostFlow] DEVELOPMENT: Using placeholder image URL as actual upload is not implemented/failed. URL: ${imageUrl}.`
          );
        }
        */

        if (imageUrl) {
          console.log(
            `[generateBlogPostFlow] Using image URL: ${imageUrl}.`,
          );
        } else {
           console.log(
            `[generateBlogPostFlow] No image URL set. This means either the 'uploadImageToThirdParty' function was not implemented, it failed, or development placeholder logic is not active. Image URL will be undefined for this post.`,
          );
        }

      } else {
        console.warn(
          "[generateBlogPostFlow] Image generation by Genkit did not return a media URL. No image will be used.",
        );
      }
    } catch (imageGenError: unknown) {
      const errorMessage =
        imageGenError instanceof Error
          ? imageGenError.message
          : String(imageGenError);
      console.error(
        "[generateBlogPostFlow] Error during image generation or upload phase:",
        errorMessage,
        imageGenError,
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
        "[generateBlogPostFlow] Falling back to no image due to an error during generation/upload.",
      );
    }

    console.log(
      "[generateBlogPostFlow] Preparing final output. Image URL (if any):",
      imageUrl,
    );
    return {
      ...textOutput,
      imageUrl: imageUrl, // This will be undefined if no image was generated/uploaded or if upload failed
      imageAiHint: imageAiHint,
    };
  },
);
