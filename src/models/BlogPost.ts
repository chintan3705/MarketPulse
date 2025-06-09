import mongoose, { Schema, Document } from 'mongoose';
import type { BlogPost as BlogPostType } from '@/types';

// We'll store categorySlug and categoryName directly.
// The full Category object will be reconstructed at the API layer if needed.
export interface IMongoBlogPost extends Omit<BlogPostType, '_id' | 'id' | 'category'>, Document {}

const BlogPostSchema: Schema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    summary: { type: String, required: true },
    imageUrl: { type: String },
    imageAiHint: { type: String },
    categorySlug: { type: String, required: true, index: true },
    categoryName: { type: String, required: true }, // Storing name for easier display if needed directly from DB
    author: { type: String, required: true },
    publishedAt: { type: Date, default: Date.now, index: true },
    tags: [{ type: String }],
    content: { type: String },
    isAiGenerated: { type: Boolean, default: false },
  },
  { timestamps: true }
); // Adds createdAt and updatedAt timestamps

export default mongoose.models.BlogPost ||
  mongoose.model<IMongoBlogPost>('BlogPost', BlogPostSchema);
