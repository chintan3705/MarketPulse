
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
// import { Textarea } from '@/components/ui/textarea'; // Textarea for direct content display removed
import { useToast } from '@/hooks/use-toast';
import type { GenerateBlogPostOutput } from '@/ai/schemas/blog-post-schemas';
import { Loader2, PlusCircle, Wand2, Copy } from 'lucide-react';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader } from '../ui/card';


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
      const response = await fetch('/api/admin/generate-blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate blog post');
      }

      const result: GenerateBlogPostOutput = await response.json();
      setGeneratedContent(result);
      toast({
        title: 'Blog Post Generated!',
        description: 'Review the content below. Manually add it to src/lib/data.ts to publish.',
        duration: 10000, // Longer duration for this important message
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

  const handleCopyToClipboard = (text: string | string[], fieldName: string) => {
    const textToCopy = Array.isArray(text) ? JSON.stringify(text, null, 2) : text;
    navigator.clipboard.writeText(textToCopy).then(() => {
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
  
  const formatDataForManualEntry = (content: GenerateBlogPostOutput | null): string => {
    if (!content) return "No content to display.";
    const newId = `ai-${Date.now()}`; // Example ID generation
    const slug = content.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').substring(0, 70);

    return `
{
  id: '${newId}',
  slug: '${slug}',
  title: \`${content.title.replace(/`/g, '\\`')}\`,
  summary: \`${content.summary.replace(/`/g, '\\`')}\`,
  imageUrl: '${content.imageUrl || 'https://placehold.co/800x450.png'}',
  imageAiHint: '${content.imageAiHint || content.tags.slice(0,2).join(' ') || 'financial news'}',
  // Find the correct category object from categories array in data.ts based on this slug:
  // category: categories.find(c => c.slug === '${content.categorySlug}'), 
  // If not found, or for simplicity in manual entry, you might pick a default or ensure slug exists:
  // Example: category: categories[0], // Make sure this maps to the correct one based on slug
  categorySlugForLookup: '${content.categorySlug}', // Use this to find the category object
  author: 'MarketPulse AI',
  publishedAt: new Date().toISOString(),
  tags: ${JSON.stringify(content.tags, null, 2)},
  content: \`
    ${content.content.replace(/`/g, '\\`').split('\n').map(line => `    ${line}`).join('\n')}
  \`,
  isAiGenerated: true,
},
// Add this object to the 'latestBlogPosts' array in src/lib/data.ts
// Ensure 'category' field is correctly assigned by finding the category object using 'categorySlugForLookup'.
    `;
  };


  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) {
        setGeneratedContent(null); // Reset content when dialog closes
        setTopic(''); // Reset topic
      }
    }}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Generate Blog Post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] md:max-w-[800px] lg:max-w-[1000px] xl:max-w-[1200px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Wand2 className="mr-2 h-5 w-5 text-primary" />
            Generate AI Blog Post
          </DialogTitle>
          <DialogDescription>
            Enter a topic. AI will generate a draft. Copy the result and manually add it to <code>src/lib/data.ts</code> to publish.
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
          <ScrollArea className="mt-6 max-h-[calc(80vh-280px)] pr-4">
            <Card className="my-4">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-primary">Manual Entry Data for <code>src/lib/data.ts</code></h3>
                        <Button variant="outline" size="sm" onClick={() => handleCopyToClipboard(formatDataForManualEntry(generatedContent), "Full Data Object")}>
                            <Copy size={14} className="mr-2"/> Copy Object
                        </Button>
                    </div>
                    <CardDescription>
                        Copy the object below and paste it into the `latestBlogPosts` array in `src/lib/data.ts`.
                        You will need to find the correct `category` object using the `categorySlugForLookup` field.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <pre className="p-3 rounded-md bg-muted/50 text-xs overflow-x-auto">
                        {formatDataForManualEntry(generatedContent)}
                    </pre>
                </CardContent>
            </Card>

            <div className="space-y-6 p-1">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-lg font-semibold">Generated Title</h3>
                  <Button variant="outline" size="sm" onClick={() => handleCopyToClipboard(generatedContent.title, "Title")}><Copy size={12} className="mr-1"/>Copy</Button>
                </div>
                <p className="text-xl font-headline border p-3 rounded-md bg-muted/30">{generatedContent.title}</p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                   <h3 className="text-lg font-semibold">Generated Summary</h3>
                   <Button variant="outline" size="sm" onClick={() => handleCopyToClipboard(generatedContent.summary, "Summary")}><Copy size={12} className="mr-1"/>Copy</Button>
                </div>
                <p className="border p-3 rounded-md bg-muted/30">{generatedContent.summary}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-1">Generated Category Slug</h3>
                <Badge variant="secondary">{generatedContent.categorySlug}</Badge>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-1">Generated Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {generatedContent.tags.map(tag => (
                    <Badge key={tag} variant="outline"># {tag}</Badge>
                  ))}
                </div>
                <Button variant="link" size="sm" className="p-0 h-auto mt-1" onClick={() => handleCopyToClipboard(JSON.stringify(generatedContent.tags), "Tags JSON")}><Copy size={12} className="mr-1"/>Copy Tags Array</Button>
              </div>
              
              {generatedContent.imageUrl && (
                 <div>
                    <h3 className="text-lg font-semibold mb-1">Generated Image</h3>
                    <img src={generatedContent.imageUrl} alt="AI Generated for blog post" className="max-w-xs rounded-md border shadow"/>
                    <p className="text-xs text-muted-foreground mt-1">Image URL (data URI): <Button variant="link" size="sm" className="p-0 h-auto" onClick={() => handleCopyToClipboard(generatedContent.imageUrl!, "Image URL")}><Copy size={12} className="mr-1"/>Copy URL</Button></p>
                    <p className="text-xs text-muted-foreground mt-1">Image AI Hint: {generatedContent.imageAiHint} <Button variant="link" size="sm" className="p-0 h-auto" onClick={() => handleCopyToClipboard(generatedContent.imageAiHint || '', "Image AI Hint")}><Copy size={12} className="mr-1"/>Copy Hint</Button></p>
                 </div>
              )}

              <div>
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-lg font-semibold">Generated HTML Content</h3>
                  <Button variant="outline" size="sm" onClick={() => handleCopyToClipboard(generatedContent.content, "HTML Content")}><Copy size={12} className="mr-1"/>Copy HTML</Button>
                </div>
                <div
                  className="prose prose-sm dark:prose-invert max-w-none border p-3 rounded-md bg-muted/30 h-64 overflow-y-auto"
                  dangerouslySetInnerHTML={{ __html: generatedContent.content }}
                />
              </div>
              <p className="text-sm text-muted-foreground italic mt-4">
                Remember to review and edit the generated content. After copying the data object above, paste it into the <code>latestBlogPosts</code> array in <code>src/lib/data.ts</code>.
                You'll need to manually look up the correct category object based on the <code>categorySlugForLookup</code>.
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

    