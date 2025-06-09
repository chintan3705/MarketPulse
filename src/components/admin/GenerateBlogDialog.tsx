'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
// import type { GenerateBlogPostOutput } from '@/ai/schemas/blog-post-schemas'; // No longer directly used for output display
import { Loader2, PlusCircle, Wand2, DatabaseZap, AlertTriangle } from 'lucide-react';
// import { ScrollArea } from '../ui/scroll-area'; // Not used
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import type { BlogPost } from '@/types'; // For type of savedPost

interface SavedPostResponseType {
  // Type for the API response containing the saved post
  _id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  imageUrl?: string;
  imageAiHint?: string;
  categorySlug: string;
  tags: string[];
  // Add other fields if you want to display them
}

export function GenerateBlogDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [topic, setTopic] = useState('');
  const [savedPostData, setSavedPostData] = useState<SavedPostResponseType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!topic.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a topic for the blog post.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setSavedPostData(null);
    setError(null);

    try {
      const response = await fetch('/api/admin/generate-blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
      });

      const result = (await response.json()) as {
        message: string;
        post?: SavedPostResponseType;
        error?: string;
        errors?: unknown;
      };

      if (!response.ok || !result.post) {
        throw new Error(result.message || result.error || 'Failed to generate and save blog post');
      }

      setSavedPostData(result.post);
      toast({
        title: 'Blog Post Generated & Saved to DB!',
        description: `"${result.post.title}" has been saved to the database. It will appear on the site after next data fetch/rebuild.`,
        duration: 7000,
      });
      // setTopic(''); // Clear topic on success, or keep it for minor edits
    } catch (err) {
      const catchedError = err as Error;
      console.error('Error generating blog post:', catchedError);
      const errorMessage = catchedError.message || 'An unexpected error occurred.';
      setError(errorMessage);
      toast({
        title: 'Error Generating Blog Post',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          setSavedPostData(null);
          setError(null);
          // Optionally reset topic: setTopic('');
        }
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className='mr-2 h-4 w-4' /> Generate & Save Blog
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center'>
            <Wand2 className='mr-2 h-5 w-5 text-primary' />
            Generate & Save AI Blog Post to Database
          </DialogTitle>
          <DialogDescription>
            Enter a topic. AI will generate a blog post and save it directly to the database. The
            new post will then be available on the main website.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='topic' className='text-right'>
                Topic
              </Label>
              <Input
                id='topic'
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className='col-span-3'
                placeholder='e.g., Future of Renewable Energy Stocks'
              />
            </div>
          </div>
          <DialogFooter className='mt-4'>
            <DialogClose asChild>
              <Button type='button' variant='outline' disabled={isLoading}>
                Cancel
              </Button>
            </DialogClose>
            <Button type='submit' disabled={isLoading || !topic.trim()}>
              {isLoading ? (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              ) : (
                <DatabaseZap className='mr-2 h-4 w-4' />
              )}
              Generate & Save
            </Button>
          </DialogFooter>
        </form>

        {error && !isLoading && (
          <Card className='mt-6 border-destructive bg-destructive/10'>
            <CardHeader>
              <div className='flex items-center gap-2 text-destructive'>
                <AlertTriangle size={20} />
                <CardTitle className='text-lg'>Generation/Save Failed</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-destructive-foreground'>{error}</p>
            </CardContent>
          </Card>
        )}

        {savedPostData && !isLoading && !error && (
          <Card className='mt-6 border-green-500 bg-green-500/10'>
            <CardHeader>
              <div className='flex items-center gap-2 text-green-700 dark:text-green-400'>
                <DatabaseZap size={20} />
                <CardTitle className='text-lg'>Successfully Saved to Database!</CardTitle>
              </div>
            </CardHeader>
            <CardContent className='space-y-2 text-sm'>
              <p>
                <strong>Title:</strong> {savedPostData.title}
              </p>
              <p>
                <strong>Slug:</strong> <code>{savedPostData.slug}</code>
              </p>
              <p>
                The post is now in the database. You can view it at:
                <Link
                  href={`/blog/${savedPostData.slug}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='ml-1 text-primary hover:underline'
                >
                  /blog/{savedPostData.slug}
                </Link>
              </p>
              <Button
                variant='outline'
                size='sm'
                className='mt-2'
                onClick={() => {
                  setSavedPostData(null);
                  setTopic('');
                }}
              >
                Generate Another
              </Button>
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
}
