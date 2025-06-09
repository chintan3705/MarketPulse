
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


export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('categorySlug');
    const tagSlug = searchParams.get('tagSlug'); // e.g. "stock-market"
    const limit = parseInt(searchParams.get('limit') || '0', 10); // 0 for no limit
    const page = parseInt(searchParams.get('page') || '1', 10);

    let query = BlogPostModel.find({});

    if (categorySlug) {
      query = query.where('categorySlug').equals(categorySlug);
    }

    if (tagSlug) {
      // Convert tag slug back to potential tag name format for querying
      // This assumes tags are stored as "Actual Tag Name" not "actual-tag-name"
      // If tags are stored as slugs, this needs adjustment or tags array needs to be indexed carefully in MongoDB.
      // For simplicity, let's assume tags are stored as they are displayed/generated (e.g., "Stock Market")
      const tagName = tagSlug.replace(/-/g, ' ');
      query = query.where('tags').regex(new RegExp(`^${tagName}$`, 'i')); // Case-insensitive match for the tag
    }
    
    query = query.sort({ publishedAt: -1 });

    if (limit > 0) {
      const skip = (page - 1) * limit;
      query = query.skip(skip).limit(limit);
    }

    const postsDocs = await query.exec();
    const posts: BlogPost[] = postsDocs.map(transformPost);

    // Get total count for pagination if limit is applied
    let totalPosts = 0;
    if (limit > 0) {
        let countQuery = BlogPostModel.countDocuments({});
        if (categorySlug) countQuery = countQuery.where('categorySlug').equals(categorySlug);
        if (tagSlug) {
            const tagName = tagSlug.replace(/-/g, ' ');
            countQuery = countQuery.where('tags').regex(new RegExp(`^${tagName}$`, 'i'));
        }
        totalPosts = await countQuery.exec();
    } else {
        totalPosts = posts.length;
    }


    return NextResponse.json({ posts, totalPosts, page, limit: limit > 0 ? limit : posts.length, totalPages: limit > 0 ? Math.ceil(totalPosts / limit) : 1 }, { status: 200 });
  } catch (error) {
    console.error('API Error fetching posts:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return NextResponse.json({ message: 'Error fetching posts.', error: errorMessage }, { status: 500 });
  }
}
