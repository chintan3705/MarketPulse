import { NextResponse, type NextRequest } from "next/server";
import {
  regenerateContent,
  type RegenerateContentInput,
} from "@/ai/flows/regenerate-content-flow";
import { RegenerateContentInputSchema } from "@/ai/schemas/regenerate-content-schemas";

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const validationResult = RegenerateContentInputSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { message: "Invalid input.", errors: validationResult.error.format() },
        { status: 400 },
      );
    }

    const input: RegenerateContentInput = validationResult.data;
    const output = await regenerateContent(input);

    return NextResponse.json(output, { status: 200 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    console.error("[API Regenerate Content Error]:", error);
    return NextResponse.json(
      { message: "Error regenerating content.", error: errorMessage },
      { status: 500 },
    );
  }
}
