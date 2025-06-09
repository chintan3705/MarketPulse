
import { NextResponse, type NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import BlogPostModel, { type IMongoBlogPost } from '@/models/BlogPost';
import type { BlogPost, Category } from '@/types';
import { categories as staticCategories } from '@/lib/data'; 

// Helper function to transform MongoDB document to BlogPost type
function transformPost(doc: IMongoBlogPost): BlogPost {
  const categoryObject: Category = staticCategories.find(c => c.slug === doc.categorySlug) || 
                                   staticCategories.find(c => c.slug === 'general') || 
                                   { id: doc.categorySlug, name: doc.categoryName || 'General', slug: doc.categorySlug };
  return {
    _id: doc._id.toString(),
    slug: doc.slug,
    title: doc.title,
    summary: doc.summary,
    imageUrl: doc.imageUrl,
    imageAiHint: doc.imageAiHint,
    category: categoryObject,
    categorySlug: doc.categorySlug,
    categoryName: doc.categoryName,
    author: doc.author,
    publishedAt: doc.publishedAt.toISOString(),
    tags: doc.tags,
    content: doc.content,
    isAiGenerated: doc.isAiGenerated,
  };
}

interface GetPostsResponse {
  posts: BlogPost[];
  totalPosts: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function GET(request: NextRequest): Promise<NextResponse<GetPostsResponse | { message: string; error?: string }>> {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('categorySlug');
    const tagSlug = searchParams.get('tagSlug'); 
    const limitParam = searchParams.get('limit');
    const pageParam = searchParams.get('page');
    
    const limit = limitParam ? parseInt(limitParam, 10) : 0; // 0 for no limit
    const page = pageParam ? parseInt(pageParam, 10) : 1;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {};
    if (categorySlug) {
      filter.categorySlug = categorySlug;
    }
    if (tagSlug) {
      const tagName = tagSlug.replace(/-/g, ' ');
      filter.tags = { $regex: new RegExp(`^${tagName}$`, 'i') };
    }
    
    let query = BlogPostModel.find(filter).sort({ publishedAt: -1 });

    if (limit > 0) {
      const skip = (page - 1) * limit;
      query = query.skip(skip).limit(limit);
    }

    const postsDocs = await query.exec();
    const posts: BlogPost[] = postsDocs.map(transformPost);
    
    const totalPosts = await BlogPostModel.countDocuments(filter);


    return NextResponse.json({ 
        posts, 
        totalPosts, 
        page, 
        limit: limit > 0 ? limit : posts.length, 
        totalPages: limit > 0 ? Math.ceil(totalPosts / limit) : 1 
    }, { status: 200 });

  } catch (error) {
    console.error('API Error fetching posts:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return NextResponse.json({ message: 'Error fetching posts.', error: errorMessage }, { status: 500 });
  }
}
