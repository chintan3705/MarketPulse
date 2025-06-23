"use server";
/**
 * @fileOverview A Genkit flow to regenerate an image for a blog post.
 *
 * Exports:
 * - regenerateImage - A function that handles image regeneration and upload.
 * - type RegenerateImageInput - The input type.
 * - type RegenerateImageOutput - The output type.
 */

import { ai } from "@/ai/genkit";
import {
  RegenerateImageInputSchema,
  RegenerateImageOutputSchema,
  type RegenerateImageInput,
  type RegenerateImageOutput,
} from "../schemas/regenerate-image-schemas";
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

export type { RegenerateImageInput, RegenerateImageOutput };

// Ensure Cloudinary is configured (copied from generate-blog-post-flow.ts)
if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  console.warn(
    "❌ [Cloudinary Setup Warning - Regenerate Image] Cloudinary environment variables are not fully set. Image uploads will fail.",
  );
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

async function uploadImageToCloudinary(
  imageDataUri: string,
  fileNamePrefix: string = "marketpulse-regen-image",
): Promise<string | undefined> {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    console.error("❌ Cloudinary credentials not configured. Skipping upload.");
    return undefined;
  }
  try {
    const sanitizedPrefix = fileNamePrefix
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, "-")
      .substring(0, 50);
    const uniqueFileName = `${sanitizedPrefix}-${Date.now()}`;
    const result: UploadApiResponse = await cloudinary.uploader.upload(
      imageDataUri,
      {
        public_id: uniqueFileName,
        folder: "marketpulse_blog_images", // Keep same folder
        overwrite: true,
        transformation: [{ width: 1200, quality: "auto:good" }],
      },
    );
    return result.secure_url;
  } catch (uploadError: unknown) {
    console.error("❌ Error during Cloudinary upload:", uploadError);
    return undefined;
  }
}

export async function regenerateImage(
  input: RegenerateImageInput,
): Promise<RegenerateImageOutput> {
  return regenerateImageFlow(input);
}

const regenerateImageFlow = ai.defineFlow(
  {
    name: "regenerateImageFlow",
    inputSchema: RegenerateImageInputSchema,
    outputSchema: RegenerateImageOutputSchema,
  },
  async (input) => {
    const imageAiHintBase =
      input.title.substring(0, 30) ||
      (input.currentTags && input.currentTags.length > 0
        ? input.currentTags.slice(0, 2).join(" ")
        : "financial markets");
    const newImageAiHint = `regenerated ${imageAiHintBase}`;

    const imagePromptText = `Generate a new, visually appealing, modern, professional, financial-style image.
The image is for a blog post titled "${input.title}" with summary: "${input.summary.substring(0, 100)}...".
Category focus (if provided): ${input.categoryName || "General Finance"}.
Keywords to inspire: ${input.currentTags ? input.currentTags.join(", ") : newImageAiHint}.
Avoid text in the image. Focus on conceptual or abstract representations. Overall tone should be informative and professional for a share market news website MarketPulse.`;

    console.log(
      `🖼️ [regenerateImageFlow] Generating image with prompt (first 150 chars): ${imagePromptText.substring(0, 150)}...`,
    );

    const { media } = await ai.generate({
      model: "googleai/gemini-2.0-flash-exp",
      prompt: imagePromptText,
      config: {
        responseModalities: ["IMAGE", "TEXT"],
      },
    });

    if (!media || !media.url) {
      throw new Error("Image generation by Genkit did not return a media URL.");
    }

    console.log(
      `🖼️ [regenerateImageFlow] Image data URI generated. Uploading to Cloudinary...`,
    );
    const newImageUrl = await uploadImageToCloudinary(media.url, input.title);

    if (!newImageUrl) {
      throw new Error("Failed to upload regenerated image to Cloudinary.");
    }
    console.log(
      `✅ [regenerateImageFlow] Image regenerated and uploaded: ${newImageUrl}`,
    );

    return {
      newImageUrl,
      newImageAiHint,
    };
  },
);
