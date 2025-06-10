
import { NextResponse, type NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import BlogPostModel, { type IMongoBlogPost } from "@/models/BlogPost";
import type { BlogPost, Category } from "@/types";
import { categories as staticCategories } from "@/lib/data";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary (ensure environment variables are set)
if (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
} else {
  console.warn(
    "❌ [Cloudinary Config Warning - API /posts/[slug]] Cloudinary environment variables not fully set. Image deletion might fail.",
  );
}

// Helper function to transform MongoDB document to BlogPost type
function transformPost(doc: IMongoBlogPost): BlogPost {
  const categoryObject: Category = staticCategories.find(
    (c) => c.slug === doc.categorySlug,
  ) ||
    staticCategories.find((c) => c.slug === "general") || {
      id: doc.categorySlug,
      name: doc.categoryName || "General",
      slug: doc.categorySlug,
    };
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
    chartType: doc.chartType,
    chartDataJson: doc.chartDataJson,
    detailedInformation: doc.detailedInformation,
  };
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } },
): Promise<NextResponse> {
  try {
    await connectDB();
    const slug = params.slug;

    if (!slug) {
      return NextResponse.json(
        { message: "Slug parameter is missing." },
        { status: 400 },
      );
    }

    const postDoc = await BlogPostModel.findOne({ slug: slug });

    if (!postDoc) {
      return NextResponse.json(
        { message: "Blog post not found." },
        { status: 404 },
      );
    }

    const post: BlogPost = transformPost(postDoc);

    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    console.error(`API Error fetching post with slug ${params.slug}:`, error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json(
      { message: "Error fetching blog post.", error: errorMessage },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { slug: string } },
): Promise<NextResponse> {
  try {
    await connectDB();
    const slug = params.slug;

    if (!slug) {
      return NextResponse.json(
        { message: "Slug parameter is missing for deletion." },
        { status: 400 },
      );
    }

    const postToDelete = await BlogPostModel.findOne({ slug: slug });

    if (!postToDelete) {
      return NextResponse.json(
        { message: "Blog post not found for deletion." },
        { status: 404 },
      );
    }

    // Attempt to delete image from Cloudinary if imageUrl exists
    if (postToDelete.imageUrl) {
      if (
        !process.env.CLOUDINARY_CLOUD_NAME ||
        !process.env.CLOUDINARY_API_KEY ||
        !process.env.CLOUDINARY_API_SECRET
      ) {
        console.warn(
          `[API DELETE /posts/${slug}] Cloudinary credentials not set. Skipping image deletion for ${postToDelete.imageUrl}.`,
        );
      } else {
        try {
          const publicIdMatch = postToDelete.imageUrl.match(
            /marketpulse_blog_images\/([^/.]+)/,
          );
          if (publicIdMatch && publicIdMatch[1]) {
            const publicId = `marketpulse_blog_images/${publicIdMatch[1]}`;
            console.log(
              `[API DELETE /posts/${slug}] Attempting to delete image from Cloudinary with public_id: ${publicId}`,
            );
            await cloudinary.uploader.destroy(publicId);
            console.log(
              `[API DELETE /posts/${slug}] Successfully deleted image from Cloudinary: ${publicId}`,
            );
          } else {
            console.warn(
              `[API DELETE /posts/${slug}] Could not extract public_id from imageUrl: ${postToDelete.imageUrl}. Skipping Cloudinary deletion.`,
            );
          }
        } catch (cloudinaryError) {
          console.error(
            `[API DELETE /posts/${slug}] Error deleting image from Cloudinary: `,
            cloudinaryError,
          );
          // Continue with DB deletion even if Cloudinary deletion fails
        }
      }
    }

    await BlogPostModel.deleteOne({ slug: slug });

    return NextResponse.json(
      { message: `Blog post "${postToDelete.title}" deleted successfully.` },
      { status: 200 },
    );
  } catch (error) {
    console.error(`API Error deleting post with slug ${params.slug}:`, error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json(
      { message: "Error deleting blog post.", error: errorMessage },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } },
): Promise<NextResponse> {
  try {
    await connectDB();
    const slug = params.slug;
    // const body = await request.json(); // Placeholder for updated data

    if (!slug) {
      return NextResponse.json(
        { message: "Slug parameter is missing for update." },
        { status: 400 },
      );
    }

    // Placeholder: Find and update logic
    // const updatedPost = await BlogPostModel.findOneAndUpdate({ slug: slug }, body, { new: true });
    // if (!updatedPost) {
    //   return NextResponse.json({ message: "Blog post not found for update." }, { status: 404 });
    // }
    // return NextResponse.json(transformPost(updatedPost), { status: 200 });

    console.log(
      `PUT request received for slug: ${slug}. Edit functionality not fully implemented.`,
    );
    return NextResponse.json(
      { message: "Edit functionality is under development." },
      { status: 501 },
    );
  } catch (error) {
    console.error(`API Error updating post with slug ${params.slug}:`, error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json(
      { message: "Error updating blog post.", error: errorMessage },
      { status: 500 },
    );
  }
}
