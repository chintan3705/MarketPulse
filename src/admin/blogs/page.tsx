
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit3, Trash2, Eye } from 'lucide-react';
import { GenerateBlogDialog } from '@/components/admin/GenerateBlogDialog';
import type { BlogPost } from '@/types';
import { unstable_noStore as noStore } from 'next/cache';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002';

async function fetchAdminPosts(): Promise<BlogPost[]> {
  noStore();
  try {
    const res = await fetch(`${SITE_URL}/api/posts`, { cache: 'no-store' });
    if (!res.ok) {
      console.error('Admin: Failed to fetch posts:', res.status, await res.text());
      return [];
    }
    const data = (await res.json()) as { posts: BlogPost[] }; // Ensure posts is properly typed
    return data.posts || [];
  } catch (error) {
    console.error('Admin: Error fetching posts from API:', error);
    return [];
  }
}

export default async function AdminBlogsPage() {
  const posts = await fetchAdminPosts();

  return (
    <div
      className='animate-slide-in'
      style={{ animationDelay: '0.1s', animationFillMode: 'backwards' }}
    >
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl sm:text-3xl font-bold font-headline'>Manage Blogs</h1>
        <GenerateBlogDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Blog Posts from Database</CardTitle>
          <CardDescription>
            A list of all blog posts fetched from the database. Editing and Deleting are
            placeholders and not functional. Use &quot;Generate &amp; Save Blog&quot; to create new
            content.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Published At</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post._id || post.id}>
                  <TableCell className='font-medium'>
                    <Link
                      href={`/blog/${post.slug}`}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='hover:underline'
                      title='View live post'
                    >
                      {post.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {/* API ensures categoryName is present if category.name isn't directly on post */}
                    <Badge variant='outline'>{post.categoryName}</Badge>
                  </TableCell>
                  <TableCell>{post.author}</TableCell>
                  <TableCell>
                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </TableCell>
                  <TableCell className='text-right space-x-2'>
                    <Button variant='outline' size='icon' asChild title='View live post'>
                      <Link href={`/blog/${post.slug}`} target='_blank' rel='noopener noreferrer'>
                        <Eye className='h-4 w-4' />
                      </Link>
                    </Button>
                    <Button variant='outline' size='icon' disabled title='Edit (Placeholder)'>
                      <Edit3 className='h-4 w-4' />
                    </Button>
                    <Button variant='destructive' size='icon' disabled title='Delete (Placeholder)'>
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {posts.length === 0 && (
        <p className='text-center text-muted-foreground mt-6'>
          No blog posts found in the database.
        </p>
      )}
    </div>
  );
}
