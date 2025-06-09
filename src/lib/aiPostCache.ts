
import type { BlogPost } from '@/types';

const cache = new Map<string, BlogPost>();
const timeouts = new Map<string, NodeJS.Timeout>();

const DEFAULT_TTL_MINUTES = 15; // Cache posts for 15 minutes by default

/**
 * Retrieves a blog post from the cache.
 * @param slug The slug of the blog post.
 * @returns The cached BlogPost object or null if not found.
 */
export function getPost(slug: string): BlogPost | null {
  return cache.get(slug) || null;
}

/**
 * Stores a blog post in the cache with a Time-To-Live (TTL).
 * @param slug The slug of the blog post.
 * @param post The BlogPost object to cache.
 * @param ttlInMinutes The time-to-live for the cache entry in minutes.
 */
export function setPost(slug: string, post: BlogPost, ttlInMinutes: number = DEFAULT_TTL_MINUTES): void {
  // If there's an existing timeout for this slug, clear it
  if (timeouts.has(slug)) {
    clearTimeout(timeouts.get(slug)!);
  }

  cache.set(slug, post);

  // Set a new timeout to remove the post from cache after TTL
  const timeoutId = setTimeout(() => {
    cache.delete(slug);
    timeouts.delete(slug);
    // console.log(`Cache expired and removed for slug: ${slug}`);
  }, ttlInMinutes * 60 * 1000);

  timeouts.set(slug, timeoutId);
  // console.log(`Post cached for slug: ${slug} with TTL: ${ttlInMinutes} minutes`);
}

/**
 * Clears a specific post from the cache.
 * @param slug The slug of the post to clear.
 */
export function clearPost(slug: string): void {
  if (timeouts.has(slug)) {
    clearTimeout(timeouts.get(slug)!);
    timeouts.delete(slug);
  }
  cache.delete(slug);
}

/**
 * Clears the entire blog post cache.
 */
export function clearAllPosts(): void {
  timeouts.forEach(timeoutId => clearTimeout(timeoutId));
  timeouts.clear();
  cache.clear();
  // console.log('All AI blog posts cleared from cache.');
}
