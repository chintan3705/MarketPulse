import { NextResponse, type NextRequest } from "next/server";
import { textToSpeech } from "@/ai/flows/text-to-speech-flow";
import { z } from "zod";

const TtsApiInputSchema = z.object({
  text: z
    .string()
    .min(1, { message: "Text is required." })
    .max(5000, { message: "Text cannot exceed 5000 characters." }), // Safety limit
});

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const validationResult = TtsApiInputSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { message: "Invalid input.", errors: validationResult.error.format() },
        { status: 400 },
      );
    }

    const { text } = validationResult.data;

    // Call the Genkit flow
    const result = await textToSpeech({ text });

    if (!result || !result.audioDataUri) {
      throw new Error("Failed to generate audio.");
    }

    return NextResponse.json(
      { audioDataUri: result.audioDataUri },
      { status: 200 },
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    console.error("[API /api/tts Error]:", error);
    return NextResponse.json(
      { message: "Error generating audio.", error: errorMessage },
      { status: 500 },
    );
  }
}
