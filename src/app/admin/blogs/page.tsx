import Link from 'next/link';
import { latestBlogPosts } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit3, Trash2, Eye } from 'lucide-react';

export default async function AdminBlogsPage() {
  const posts = latestBlogPosts; // In a real app, fetch from a database

  return (
    <div className="animate-slide-in" style={{animationDelay: '0.1s', animationFillMode: 'backwards'}}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold font-headline">Manage Blogs</h1>
        <Button disabled> {/* Disabled as functionality is not implemented */}
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Blog
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Blog Posts</CardTitle>
          <CardDescription>
            A list of all blog posts. Editing and Deleting are placeholders and not functional.
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
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">
                    <Link href={`/blog/${post.slug}`} target="_blank" className="hover:underline" title="View live post">
                      {post.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{post.category.name}</Badge>
                  </TableCell>
                  <TableCell>{post.author}</TableCell>
                  <TableCell>
                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="icon" asChild title="View live post">
                       <Link href={`/blog/${post.slug}`} target="_blank"><Eye className="h-4 w-4" /></Link>
                    </Button>
                    <Button variant="outline" size="icon" disabled title="Edit (Placeholder)"> {/* Disabled */}
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="icon" disabled title="Delete (Placeholder)"> {/* Disabled */}
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {posts.length === 0 && (
        <p className="text-center text-muted-foreground mt-6">No blog posts found.</p>
      )}
    </div>
  );
}
