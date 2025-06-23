import { NextResponse, type NextRequest } from "next/server";
import {
  regenerateTags,
  type RegenerateTagsInput,
} from "@/ai/flows/regenerate-tags-flow";
import { RegenerateTagsInputSchema } from "@/ai/schemas/regenerate-tags-schemas";

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const validationResult = RegenerateTagsInputSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { message: "Invalid input.", errors: validationResult.error.format() },
        { status: 400 },
      );
    }

    const input: RegenerateTagsInput = validationResult.data;
    const output = await regenerateTags(input);

    return NextResponse.json(output, { status: 200 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    console.error("[API Regenerate Tags Error]:", error);
    return NextResponse.json(
      { message: "Error regenerating tags.", error: errorMessage },
      { status: 500 },
    );
  }
}
