import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

const MARKETAUX_API_TOKEN = process.env.MARKETAUX_API_TOKEN;
const MARKETAUX_BASE_URL = "https://api.marketaux.com/v1/news/all";

const MarketAuxParamsSchema = z.object({
  queryType: z.enum(["general", "symbols", "positive", "neutral", "negative"]),
  limit: z.coerce.number().min(1).max(10).default(3),
  symbols: z.string().optional(), // Comma-separated string
});

interface MarketAuxNewsItem {
  uuid: string;
  title: string;
  description: string;
  url: string;
  image_url: string; // If available
  language: string;
  published_at: string;
  source: string;
  relevance_score: number | null;
  entities: Array<{
    symbol: string;
    name: string;
    exchange: string | null;
    type: string;
    industry: string;
    score: string;
    sentiment: string;
    is_lead: boolean;
  }>;
  similar: Array<unknown>; // Define further if needed
}

interface MarketAuxApiResponse {
  meta: {
    found: number;
    returned: number;
    limit: number;
    page: number;
  };
  data: MarketAuxNewsItem[];
}

export async function GET(request: NextRequest) {
  if (!MARKETAUX_API_TOKEN) {
    console.error(
      "❌ MarketAux API Token (MARKETAUX_API_TOKEN) is not configured in environment variables.",
    );
    return NextResponse.json(
      {
        message:
          "MarketAux API token is not configured. Please set MARKETAUX_API_TOKEN in your .env file.",
      },
      { status: 500 },
    );
  }

  const { searchParams } = new URL(request.url);
  const queryParams = Object.fromEntries(searchParams.entries());

  const validationResult = MarketAuxParamsSchema.safeParse(queryParams);

  if (!validationResult.success) {
    return NextResponse.json(
      {
        message: "Invalid query parameters.",
        errors: validationResult.error.format(),
      },
      { status: 400 },
    );
  }

  const { queryType, limit, symbols } = validationResult.data;

  const apiParams: Record<string, string> = {
    api_token: MARKETAUX_API_TOKEN,
    limit: limit.toString(),
    language: "en", // Default to English for now
    filter_entities: "true", // Usually good to have
  };

  switch (queryType) {
    case "general":
      apiParams.group = "true"; // Try to get diverse news
      apiParams.countries = "us,gb,in"; // Focus on some major English financial markets
      break;
    case "symbols":
      if (!symbols || symbols.trim() === "") {
        return NextResponse.json(
          { message: "Symbols are required for this query type." },
          { status: 400 },
        );
      }
      apiParams.symbols = symbols.trim().toUpperCase();
      break;
    case "positive":
      apiParams.sentiment_gte = "0.1";
      break;
    case "neutral":
      apiParams.sentiment_gte = "0";
      apiParams.sentiment_lte = "0";
      break;
    case "negative":
      apiParams.sentiment_lte = "-0.1";
      break;
    default:
      return NextResponse.json(
        { message: "Invalid query type." },
        { status: 400 },
      );
  }

  const esc = encodeURIComponent;
  const queryString = Object.keys(apiParams)
    .map((k) => `${esc(k)}=${esc(apiParams[k])}`)
    .join("&");

  const marketAuxUrl = `${MARKETAUX_BASE_URL}?${queryString}`;
  console.log(
    `[MarketAux API Proxy] Fetching: ${marketAuxUrl.replace(MARKETAUX_API_TOKEN, "REDACTED_TOKEN")}`,
  );

  try {
    const response = await fetch(marketAuxUrl, {
      method: "GET",
      headers: {
        // MarketAux uses token in query param, so no specific headers needed usually
      },
    });

    if (!response.ok) {
      let errorBody;
      try {
        errorBody = await response.json();
      } catch (e) {
        errorBody = { message: await response.text() };
      }
      console.error(`MarketAux API Error (${response.status}):`, errorBody);
      return NextResponse.json(
        {
          message: `Error from MarketAux API: ${errorBody?.message || response.statusText}`,
          details: errorBody,
        },
        { status: response.status },
      );
    }

    const data: MarketAuxApiResponse = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    const catchedError = error as Error;
    console.error("Error calling MarketAux API:", catchedError);
    return NextResponse.json(
      {
        message: "Failed to fetch news from MarketAux.",
        error: catchedError.message,
      },
      { status: 500 },
    );
  }
}
