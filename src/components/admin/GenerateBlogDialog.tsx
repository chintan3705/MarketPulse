
'use client';

import { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { generateBlogPost, GenerateBlogPostOutput } from '@/ai/flows/generate-blog-post-flow';
import { Loader2, PlusCircle, Wand2 } from 'lucide-react';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';

export function GenerateBlogDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [topic, setTopic] = useState('');
  const [generatedContent, setGeneratedContent] = useState<GenerateBlogPostOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
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
    setGeneratedContent(null);

    try {
      const result = await generateBlogPost({ topic });
      setGeneratedContent(result);
      toast({
        title: 'Blog Post Generated!',
        description: 'Review the content below. You can copy it to manually add to your blog data.',
      });
    } catch (error) {
      console.error('Error generating blog post:', error);
      toast({
        title: 'Error Generating Blog Post',
        description: error instanceof Error ? error.message : 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: 'Copied to Clipboard!',
        description: `${fieldName} has been copied.`,
      });
    }).catch(err => {
      console.error('Failed to copy:', err);
      toast({
        title: 'Copy Failed',
        description: `Could not copy ${fieldName}. Please copy manually.`,
        variant: 'destructive',
      });
    });
  };


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Generate Blog Post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] md:max-w-[800px] lg:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Wand2 className="mr-2 h-5 w-5 text-primary" />
            Generate AI Blog Post
          </DialogTitle>
          <DialogDescription>
            Enter a topic or keywords, and AI will generate a draft blog post.
            You can then copy the generated content.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="topic" className="text-right">
                Topic
              </Label>
              <Input
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="col-span-3"
                placeholder="e.g., Future of Renewable Energy Stocks"
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              Generate Content
            </Button>
          </DialogFooter>
        </form>

        {generatedContent && (
          <ScrollArea className="mt-6 max-h-[calc(80vh-250px)] pr-4">
            <div className="space-y-6 p-1">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-lg font-semibold text-primary">Generated Title</h3>
                  <Button variant="outline" size="sm" onClick={() => handleCopyToClipboard(generatedContent.title, "Title")}>Copy Title</Button>
                </div>
                <p className="text-xl font-headline border p-3 rounded-md bg-muted/30">{generatedContent.title}</p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                   <h3 className="text-lg font-semibold text-primary">Generated Summary</h3>
                   <Button variant="outline" size="sm" onClick={() => handleCopyToClipboard(generatedContent.summary, "Summary")}>Copy Summary</Button>
                </div>
                <p className="border p-3 rounded-md bg-muted/30">{generatedContent.summary}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-primary mb-1">Generated Category</h3>
                <Badge variant="secondary">{generatedContent.categorySlug}</Badge>
                 <p className="text-xs text-muted-foreground mt-1">You can copy this slug: <Button variant="link" size="sm" className="p-0 h-auto" onClick={() => handleCopyToClipboard(generatedContent.categorySlug, "Category Slug")}>{generatedContent.categorySlug}</Button></p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-primary mb-1">Generated Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {generatedContent.tags.map(tag => (
                    <Badge key={tag} variant="outline"># {tag}</Badge>
                  ))}
                </div>
                 <p className="text-xs text-muted-foreground mt-1">You can copy tags (comma-separated): <Button variant="link" size="sm" className="p-0 h-auto" onClick={() => handleCopyToClipboard(generatedContent.tags.join(', '), "Tags")}>{generatedContent.tags.join(', ')}</Button></p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-lg font-semibold text-primary">Generated HTML Content</h3>
                  <Button variant="outline" size="sm" onClick={() => handleCopyToClipboard(generatedContent.content, "HTML Content")}>Copy HTML</Button>
                </div>
                <div
                  className="prose prose-sm dark:prose-invert max-w-none border p-3 rounded-md bg-muted/30 h-64 overflow-y-auto"
                  dangerouslySetInnerHTML={{ __html: generatedContent.content }}
                />
              </div>
              <p className="text-sm text-muted-foreground italic">
                Remember to review and edit the generated content before use. To add this to your site, copy the fields and manually update your blog data source.
              </p>
            </div>
             <DialogFooter className="mt-4 sm:justify-start">
                <DialogClose asChild>
                    <Button type="button" variant="outline">Close</Button>
                </DialogClose>
            </DialogFooter>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
