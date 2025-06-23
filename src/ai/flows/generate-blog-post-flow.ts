"use server";
/**
 * @fileOverview A Genkit flow to generate a blog post based on a topic, including an AI-generated image uploaded to Cloudinary.
 *
 * Exports:
 * - generateBlogPost - A function that handles the blog post generation with image.
 * - type GenerateBlogPostInput - The input type for the generateBlogPost function.
 * - type GenerateBlogPostOutput - The return type for the generateBlogPost function.
 */

import { ai } from "@/ai/genkit";
import { googleAI } from "@genkit-ai/googleai";
import { categories } from "@/lib/data";
import {
  GenerateBlogPostInputSchema,
  GenerateBlogPostOutputSchema,
  type GenerateBlogPostInput,
  type GenerateBlogPostOutput,
} from "../schemas/blog-post-schemas";
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

export type { GenerateBlogPostInput, GenerateBlogPostOutput };

if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  console.warn(
    "❌ [Cloudinary Setup Warning] Cloudinary environment variables (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) are not fully set. Image uploads will fail. Ensure they are in your .env file and the server is restarted.",
  );
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  console.log("✅ [Cloudinary Setup] Cloudinary configured successfully.");
}

export async function generateBlogPost(
  input: GenerateBlogPostInput,
): Promise<GenerateBlogPostOutput> {
  console.log("🚀 [generateBlogPostFlow] Flow started. Input:", input);
  return generateBlogPostFlow(input);
}

const generateSystemInstruction = (userCategorySlug?: string) => {
  let categoryInstruction =
    "Choose the most relevant category from the list provided below and return its slug. The blog post must be highly relevant to the chosen financial category.";
  if (userCategorySlug) {
    const userCategory = categories.find((c) => c.slug === userCategorySlug);
    if (userCategory) {
      categoryInstruction = `The user has specified the category as '${userCategory.name}' (slug: ${userCategory.slug}). Generate content specifically relevant to this share market category and ensure the output categorySlug is exactly '${userCategory.slug}'.`;
    } else {
      categoryInstruction = `The user suggested an invalid category slug ('${userCategorySlug}'). Please choose the most relevant share market category from the list provided below and return its slug. The blog post must be highly relevant to this chosen financial category.`;
    }
  }

  return `You are an expert financial news writer for a blog called MarketPulse. Your task is to generate a comprehensive, in-depth, and engaging blog post based on the provided share market topic.

The blog post should be well-researched, informative, and suitable for an audience interested in stock markets, finance, and investments. Aim for a word count of approximately 700-1000 words for the main content. Provide detailed explanations, statistical data where relevant, and interesting facts.

${categoryInstruction}

Available Share Market Categories (if not user-specified or if user-specified is invalid):
${categories.map((cat) => `- Name: ${cat.name}, Slug: ${cat.slug}`).join("\n")}

Topic: {{{topic}}}

Please generate the following:
1.  A catchy title for a share market news blog.
2.  A concise summary (2-3 sentences) for a share market news blog.
3.  The full blog post content in HTML format. The content should be well-structured with multiple paragraphs. Use <h3> for subheadings, and <ul>/<li> for lists where appropriate.
4.  Provide in-depth information, interesting facts, detailed explanations, and statistical data relevant to the share market topic to make the post highly informative. Include this in the 'detailedInformation' field.
5.  If you can identify data points from your generated content or the 'detailedInformation' that would be suitable for a simple visual representation (like a bar chart, line chart, pie chart, or a small data table), please provide this data in the 'chartDataJson' field as a valid JSON string. Also, suggest a 'chartType' (bar, line, pie, table). In the HTML content, insert a placeholder like "[CHART: A brief description of what the chart will show, e.g., 'Market Growth Over Past 5 Years']" where the chart would be thematically appropriate.
6.  The slug of the most relevant category (must be one from the 'Available Categories' list or the user-specified one if valid).
7.  An array of 3-5 highly relevant tags (keywords) for the blog post, thoroughly analyzed from the generated content, focusing on share market themes.

Ensure the output strictly follows the JSON schema provided for the output, excluding imageUrl and imageAiHint which will be handled separately.
The content must be exclusively focused on share market, finance, and investment topics relevant to MarketPulse.
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
  // Prompt is dynamically generated inside the flow
});

async function uploadImageToCloudinary(
  imageDataUri: string,
  fileNamePrefix: string = "marketpulse-blog-image",
): Promise<string | undefined> {
  console.log(
    `☁️ [uploadImageToCloudinary] Attempting to upload image. Data URI length: ${imageDataUri.length}, Prefix: "${fileNamePrefix}"`,
  );

  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    console.error(
      "❌ [uploadImageToCloudinary] Cloudinary credentials not configured. Skipping upload. Please check .env.",
    );
    return undefined;
  }

  try {
    const sanitizedPrefix = fileNamePrefix
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, "-") // Sanitize
      .substring(0, 50); // Limit length
    const uniqueFileName = `${sanitizedPrefix}-${Date.now()}`;

    console.log(
      `☁️ [uploadImageToCloudinary] Uploading with public_id: ${uniqueFileName}`,
    );
    const result: UploadApiResponse = await cloudinary.uploader.upload(
      imageDataUri,
      {
        public_id: uniqueFileName,
        folder: "marketpulse_blog_images",
        overwrite: true,
        transformation: [{ width: 1200, quality: "auto:good" }],
      },
    );
    console.log(
      `✅ [uploadImageToCloudinary] Image uploaded successfully to Cloudinary. URL: ${result.secure_url}`,
    );
    return result.secure_url;
  } catch (uploadError: unknown) {
    const errorMessage =
      uploadError instanceof Error ? uploadError.message : String(uploadError);
    console.error(
      "❌ [uploadImageToCloudinary] Error during Cloudinary upload:",
      errorMessage,
      uploadError,
    );
    if (errorMessage.includes("Must supply api_key")) {
      console.error(
        "❌ [uploadImageToCloudinary] Cloudinary Error Detail: API Key is likely missing or invalid.",
      );
    } else if (errorMessage.includes("Invalid Signature")) {
      console.error(
        "❌ [uploadImageToCloudinary] Cloudinary Error Detail: API Secret might be incorrect or timestamp issue.",
      );
    }
    return undefined;
  }
}

const generateBlogPostFlow = ai.defineFlow(
  {
    name: "generateBlogPostFlow",
    inputSchema: GenerateBlogPostInputSchema,
    outputSchema: GenerateBlogPostOutputSchema,
  },
  async (input) => {
    console.log(
      "🔄 [generateBlogPostFlow] Inside flow execution. Input:",
      input,
    );
    let textOutput: GenerateBlogPostOutput;
    try {
      console.log(
        `📝 [generateBlogPostFlow] Calling generateBlogPostTextPrompt for topic: "${input.topic}", userCategorySlug: "${input.categorySlug || "AI choice"}"`,
      );
      const systemInstruction = generateSystemInstruction(input.categorySlug);
      const { output } = await generateBlogPostTextPrompt(input, {
        prompt: systemInstruction,
      });

      if (!output) {
        throw new Error(
          "generateBlogPostTextPrompt returned null or undefined output.",
        );
      }
      textOutput = output as GenerateBlogPostOutput;
      console.log(
        "✅ [generateBlogPostFlow] Successfully received textOutput from AI. Chart Type:",
        textOutput.chartType,
        "Chart Data JSON provided:",
        !!textOutput.chartDataJson,
        "Detailed Info provided:",
        !!textOutput.detailedInformation,
      );
    } catch (flowError: unknown) {
      const errorMessage =
        flowError instanceof Error ? flowError.message : String(flowError);
      console.error(
        "❌ [generateBlogPostFlow] Error calling generateBlogPostTextPrompt:",
        errorMessage,
        flowError,
      );
      throw new Error(
        `Failed to generate blog post text content: ${errorMessage}`,
      );
    }

    const isValidCategory = categories.some(
      (cat) => cat.slug === textOutput.categorySlug,
    );
    if (!isValidCategory) {
      console.warn(
        `⚠️ [generateBlogPostFlow] AI generated an invalid category slug: "${textOutput.categorySlug}". Defaulting to "${categories[0]?.slug || "general"}".`,
      );
      textOutput.categorySlug = categories[0]?.slug || "general";
    }

    let imageUrl: string | undefined = undefined;
    const imageHintBase =
      textOutput.detailedInformation?.substring(0, 100) ||
      textOutput.title ||
      (textOutput.tags && textOutput.tags.length > 0
        ? textOutput.tags.slice(0, 2).join(" ")
        : input.topic.substring(0, 50));

    const imageAiHint = imageHintBase || "financial news article";

    try {
      const categoryForImage = categories.find(
        (c) => c.slug === textOutput.categorySlug,
      ) || { name: "Financial News", slug: "general" };

      const imagePromptText = `Generate a visually appealing, modern, professional, financial-style image primarily themed around "${imageAiHint}". This image is for a blog post in the "${categoryForImage.name}" category, titled "${textOutput.title}", which discusses "${textOutput.summary.substring(0, 120)}...". Avoid text in the image. Focus on conceptual or abstract representations if direct depiction is complex. The overall tone should be informative and professional for a share market news website.`;

      console.log(
        `🖼️ [generateBlogPostFlow] Attempting to generate image with prompt (first 150 chars): ${imagePromptText.substring(0, 150)}...`,
      );

      const { media } = await ai.generate({
        model: googleAI.model("gemini-2.0-flash-preview-image-generation"),
        prompt: imagePromptText,
        config: {
          responseModalities: ["IMAGE", "TEXT"],
        },
      });

      if (media && media.url) {
        const imageDataUri = media.url;
        console.log(
          `🖼️ [generateBlogPostFlow] Image data URI generated by Genkit. Length: ${imageDataUri.length}. Hint: "${imageAiHint}"`,
        );

        imageUrl = await uploadImageToCloudinary(
          imageDataUri,
          textOutput.title,
        );
        if (imageUrl) {
          console.log(
            `✅ [generateBlogPostFlow] Image successfully uploaded. Cloudinary URL: ${imageUrl}`,
          );
        } else {
          console.warn(
            "⚠️ [generateBlogPostFlow] Cloudinary upload failed or was skipped. No image URL will be saved for this post.",
          );
        }
      } else {
        console.warn(
          "⚠️ [generateBlogPostFlow] Image generation by Genkit did not return a media URL. No image will be used.",
        );
      }
    } catch (imageGenError: unknown) {
      const errorMessage =
        imageGenError instanceof Error
          ? imageGenError.message
          : String(imageGenError);
      console.error(
        "❌ [generateBlogPostFlow] Error during image generation or upload phase:",
        errorMessage,
        imageGenError,
      );
      if (
        errorMessage.toLowerCase().includes("api key not valid") ||
        errorMessage.toLowerCase().includes("permission denied") ||
        errorMessage.toLowerCase().includes("api_key")
      ) {
        console.error(
          "❌ [generateBlogPostFlow] Critical: Google AI API key issue or Gemini API not enabled. Check GOOGLE_API_KEY and API enablement in Google Cloud Console.",
        );
      }
      if (errorMessage.toLowerCase().includes("cloudinary")) {
        console.error(
          "❌ [generateBlogPostFlow] Critical: Cloudinary API issue. Check CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET environment variables.",
        );
      }
      imageUrl = undefined;
    }

    console.log(
      "🏁 [generateBlogPostFlow] Preparing final output. Image URL (if any):",
      imageUrl || "None",
    );
    return {
      ...textOutput,
      imageUrl: imageUrl,
      imageAiHint: imageAiHint,
    };
  },
);
