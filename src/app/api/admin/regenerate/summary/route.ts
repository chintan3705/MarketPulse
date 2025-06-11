
import { NextResponse, type NextRequest } from "next/server";
import {
  regenerateSummary,
  type RegenerateSummaryInput,
} from "@/ai/flows/regenerate-summary-flow";
import { RegenerateSummaryInputSchema } from "@/ai/schemas/regenerate-summary-schemas";

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const validationResult = RegenerateSummaryInputSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { message: "Invalid input.", errors: validationResult.error.format() },
        { status: 400 },
      );
    }

    const input: RegenerateSummaryInput = validationResult.data;
    const output = await regenerateSummary(input);

    return NextResponse.json(output, { status: 200 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    console.error("[API Regenerate Summary Error]:", error);
    return NextResponse.json(
      { message: "Error regenerating summary.", error: errorMessage },
      { status: 500 },
    );
  }
}
