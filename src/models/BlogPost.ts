import mongoose, { Schema, Document } from "mongoose";
import type { BlogPost as BlogPostType } from "@/types";

export interface IMongoBlogPost
  extends Omit<BlogPostType, "_id" | "id" | "category">,
    Document {
  _id: mongoose.Types.ObjectId; // Ensure _id is properly typed for MongoDB
}

const BlogPostSchema: Schema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    imageUrl: { type: String },
    imageAiHint: { type: String },
    categorySlug: { type: String, required: true, index: true },
    categoryName: { type: String, required: true },
    author: { type: String, required: true },
    publishedAt: { type: Date, default: Date.now, index: true },
    tags: [{ type: String }],
    isAiGenerated: { type: Boolean, default: false },
    chartType: { type: String },
    chartDataJson: { type: String },
    detailedInformation: { type: String },
  },
  { timestamps: true },
);

export default mongoose.models.BlogPost ||
  mongoose.model<IMongoBlogPost>("BlogPost", BlogPostSchema);
