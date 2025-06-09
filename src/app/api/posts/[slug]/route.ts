
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import BlogPostModel from '@/models/BlogPost';
import type { BlogPost, Category } from '@/types';
import { categories as staticCategories } from '@/lib/data'; // For populating category object

// Helper function to transform MongoDB document to BlogPost type
function transformPost(doc: any): BlogPost {
   const category = staticCategories.find(c => c.slug === doc.categorySlug) || 
                   staticCategories.find(c => c.slug === 'general') || 
                   { id: doc.categorySlug, name: doc.categoryName || 'General', slug: doc.categorySlug };
  return {
    _id: doc._id.toString(),
    slug: doc.slug,
    title: doc.title,
    summary: doc.summary,
    imageUrl: doc.imageUrl,
    imageAiHint: doc.imageAiHint,
    category: category,
    categorySlug: doc.categorySlug,
    categoryName: doc.categoryName,
    author: doc.author,
    publishedAt: doc.publishedAt.toISOString(),
    tags: doc.tags,
    content: doc.content,
    isAiGenerated: doc.isAiGenerated,
  };
}

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();
    const slug = params.slug;

    if (!slug) {
      return NextResponse.json({ message: 'Slug parameter is missing.' }, { status: 400 });
    }

    const postDoc = await BlogPostModel.findOne({ slug: slug });

    if (!postDoc) {
      return NextResponse.json({ message: 'Blog post not found.' }, { status: 404 });
    }
    
    const post: BlogPost = transformPost(postDoc);

    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    console.error(`API Error fetching post with slug ${params.slug}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return NextResponse.json({ message: 'Error fetching blog post.', error: errorMessage }, { status: 500 });
  }
}
