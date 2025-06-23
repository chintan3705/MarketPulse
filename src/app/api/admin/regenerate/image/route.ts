import { NextResponse, type NextRequest } from "next/server";
import {
  regenerateImage,
  type RegenerateImageInput,
} from "@/ai/flows/regenerate-image-flow";
import { RegenerateImageInputSchema } from "@/ai/schemas/regenerate-image-schemas";

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const validationResult = RegenerateImageInputSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { message: "Invalid input.", errors: validationResult.error.format() },
        { status: 400 },
      );
    }

    const input: RegenerateImageInput = validationResult.data;
    const output = await regenerateImage(input);

    return NextResponse.json(output, { status: 200 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    console.error("[API Regenerate Image Error]:", error);
    return NextResponse.json(
      { message: "Error regenerating image.", error: errorMessage },
      { status: 500 },
    );
  }
}
