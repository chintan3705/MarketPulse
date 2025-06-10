
import { NextResponse, type NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import BlogPostModel, { type IMongoBlogPost } from "@/models/BlogPost";
import type { BlogPost, Category } from "@/types";
import { categories as staticCategories } from "@/lib/data";
import { v2 as cloudinary } from "cloudinary";
import { z } from "zod";

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
    "❌ [Cloudinary Config Warning - API /posts/[slug]] Cloudinary environment variables not fully set. Image deletion/update might fail.",
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
    id: doc._id.toString(),
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
    updatedAt: doc.updatedAt
      ? doc.updatedAt.toISOString()
      : doc.publishedAt.toISOString(),
    tags: doc.tags,
    content: doc.content,
    isAiGenerated: doc.isAiGenerated,
    chartType: doc.chartType,
    chartDataJson: doc.chartDataJson,
    detailedInformation: doc.detailedInformation,
  };
}

const UpdateBlogPostSchema = z.object({
  title: z.string().min(5).optional(),
  summary: z.string().min(10).optional(),
  content: z.string().min(50).optional(),
  categorySlug: z.string().min(1).optional(),
  tags: z.array(z.string().min(1)).optional(),
  imageUrl: z.string().url().optional().or(z.literal("")).nullable(), // Allow null or empty string
  imageAiHint: z.string().optional().nullable(),
});

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
  } catch (error: unknown) {
    console.error(`API Error fetching post with slug ${params.slug}:`, error);
    const catchedError = error as Error;
    return NextResponse.json(
      { message: "Error fetching blog post.", error: catchedError.message },
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

    if (postToDelete.imageUrl) {
      if (
        process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET
      ) {
        try {
          const publicIdMatch = postToDelete.imageUrl.match(
            /marketpulse_blog_images\/([^/.]+)/,
          );
          if (publicIdMatch && publicIdMatch[1]) {
            const publicId = `marketpulse_blog_images/${publicIdMatch[1]}`;
            await cloudinary.uploader.destroy(publicId);
            console.log(
              `[API DELETE /posts/${slug}] Successfully deleted image from Cloudinary: ${publicId}`,
            );
          }
        } catch (cloudinaryError: unknown) {
          const catchedCloudinaryError = cloudinaryError as Error;
          console.error(
            `[API DELETE /posts/${slug}] Error deleting image from Cloudinary: `,
            catchedCloudinaryError.message,
          );
        }
      } else {
        console.warn(
          `[API DELETE /posts/${slug}] Cloudinary credentials not set. Skipping image deletion for ${postToDelete.imageUrl}.`,
        );
      }
    }

    await BlogPostModel.deleteOne({ slug: slug });

    return NextResponse.json(
      { message: `Blog post "${postToDelete.title}" deleted successfully.` },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error(`API Error deleting post with slug ${params.slug}:`, error);
    const catchedError = error as Error;
    return NextResponse.json(
      { message: "Error deleting blog post.", error: catchedError.message },
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
    const currentSlug = params.slug;
    const body: unknown = await request.json();

    const validationResult = UpdateBlogPostSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { message: "Invalid input.", errors: validationResult.error.format() },
        { status: 400 },
      );
    }

    const updateData = validationResult.data;

    const postBeingUpdated = await BlogPostModel.findOne({ slug: currentSlug });
    if (!postBeingUpdated) {
      return NextResponse.json(
        { message: "Blog post not found for update." },
        { status: 404 },
      );
    }

    // Use a type that reflects the fields allowed for $set
    const updateFields: Partial<Omit<IMongoBlogPost, "_id" | "createdAt">> = {};
    let hasChanges = false;

    if (updateData.title && updateData.title !== postBeingUpdated.title) {
      updateFields.title = updateData.title;
      hasChanges = true;
      let newSlug = updateData.title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")
        .replace(/--+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "");

      if (newSlug !== currentSlug) {
        const conflictingPost = await BlogPostModel.findOne({
          slug: newSlug,
          _id: { $ne: postBeingUpdated._id },
        });
        if (conflictingPost) {
          newSlug = `${newSlug}-${Date.now().toString().slice(-5)}`;
        }
        updateFields.slug = newSlug;
      }
    }

    if (updateData.summary && updateData.summary !== postBeingUpdated.summary) {
      updateFields.summary = updateData.summary;
      hasChanges = true;
    }
    if (updateData.content && updateData.content !== postBeingUpdated.content) {
      updateFields.content = updateData.content;
      hasChanges = true;
    }

    if (updateData.categorySlug && updateData.categorySlug !== postBeingUpdated.categorySlug) {
      updateFields.categorySlug = updateData.categorySlug;
      const categoryDetails = staticCategories.find(
        (c) => c.slug === updateData.categorySlug,
      );
      updateFields.categoryName = categoryDetails?.name || "General";
      hasChanges = true;
    }

    if (updateData.tags) {
      // Simple assignment, or could implement deep array comparison if needed
      updateFields.tags = updateData.tags;
      hasChanges = true; // Assume change if tags field is present in payload
    }

    if (updateData.imageUrl !== undefined && updateData.imageUrl !== postBeingUpdated.imageUrl) {
      updateFields.imageUrl = updateData.imageUrl === "" || updateData.imageUrl === null ? undefined : updateData.imageUrl;
      hasChanges = true;
    }
    if (updateData.imageAiHint !== undefined && updateData.imageAiHint !== postBeingUpdated.imageAiHint) {
      updateFields.imageAiHint = updateData.imageAiHint === "" || updateData.imageAiHint === null ? undefined : updateData.imageAiHint;
      hasChanges = true;
    }

    if (!hasChanges) {
      return NextResponse.json(transformPost(postBeingUpdated), { status: 200 });
    }
    
    updateFields.updatedAt = new Date();

    const updatedPostDoc = await BlogPostModel.findByIdAndUpdate(
      postBeingUpdated._id,
      { $set: updateFields },
      { new: true, runValidators: true },
    );

    if (!updatedPostDoc) {
      // Should not happen if postBeingUpdated was found, but as a safeguard
      return NextResponse.json(
        { message: "Failed to update post after finding it." },
        { status: 500 },
      );
    }

    return NextResponse.json(transformPost(updatedPostDoc), { status: 200 });
  } catch (error: unknown) {
    console.error(`API Error updating post with slug ${params.slug}:`, error);
    const catchedError = error as Error;
    return NextResponse.json(
      { message: "Error updating blog post.", error: catchedError.message },
      { status: 500 },
    );
  }
}
