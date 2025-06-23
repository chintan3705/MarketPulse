import { config } from "dotenv";
config();

// Schemas
// import '@/ai/schemas/blog-post-schemas.ts'; // Indirectly used by flows
// import '@/ai/schemas/multiple-blog-posts-schemas.ts'; // Indirectly used by flows
import "@/ai/schemas/regenerate-summary-schemas.ts";
import "@/ai/schemas/regenerate-tags-schemas.ts";
import "@/ai/schemas/regenerate-image-schemas.ts";
import "@/ai/schemas/regenerate-content-schemas.ts";

// Flows
import "@/ai/flows/summarize-article.ts";
import "@/ai/flows/generate-blog-post-flow.ts";
import "@/ai/flows/market-lens-digest-flow.ts";
import "@/ai/flows/generate-multiple-blog-posts-flow.ts";
import "@/ai/flows/regenerate-summary-flow.ts";
import "@/ai/flows/regenerate-tags-flow.ts";
import "@/ai/flows/regenerate-image-flow.ts";
import "@/ai/flows/regenerate-content-flow.ts";
