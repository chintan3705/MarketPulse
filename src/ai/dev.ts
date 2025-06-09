import { config } from "dotenv";
config();

// Schemas (these don't need to be imported here as they are not flows themselves)
// import '@/ai/schemas/blog-post-schemas.ts';
// import '@/ai/schemas/multiple-blog-posts-schemas.ts';

// Flows
import "@/ai/flows/summarize-article.ts";
import "@/ai/flows/generate-blog-post-flow.ts";
import "@/ai/flows/market-lens-digest-flow.ts";
import "@/ai/flows/generate-multiple-blog-posts-flow.ts";
