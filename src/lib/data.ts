import type { BlogPost, TrendingHeadline, Category, AdConfig } from '@/types';

export const categories: Category[] = [
  { id: '1', name: 'Stocks', slug: 'stocks' },
  { id: '2', name: 'IPOs', slug: 'ipos' },
  { id: '3', name: 'Mutual Funds', slug: 'mutual-funds' },
  { id: '4', name: 'Economy', slug: 'economy' },
  { id: '5', name: 'Global Markets', slug: 'global-markets' },
  { id: '6', name: 'Crypto', slug: 'crypto' },
  { id: '7', name: 'Personal Finance', slug: 'personal-finance' },
];

export const latestBlogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'nifty-hits-all-time-high',
    title: 'Nifty Soars to New All-Time High: What\'s Fueling the Rally?',
    summary: 'The Indian stock market benchmark Nifty 50 reached a historic peak today, driven by strong global cues and robust domestic inflows. Analysts predict further upside potential amidst positive economic indicators.',
    imageUrl: 'https://placehold.co/600x400.png',
    imageAiHint: 'stock chart upward',
    category: categories[0], // Stocks
    author: 'Priya Sharma',
    publishedAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    tags: ['Nifty', 'Stock Market', 'Bull Run'],
  },
  {
    id: '2',
    slug: 'understanding-ipo-investing',
    title: 'The Ultimate Guide to IPO Investing for Beginners',
    summary: 'Initial Public Offerings (IPOs) can be exciting investment opportunities, but they come with risks. This guide breaks down everything you need to know before diving into the IPO market.',
    imageUrl: 'https://placehold.co/600x400.png',
    imageAiHint: 'investment growth',
    category: categories[1], // IPOs
    author: 'Rohan Mehra',
    publishedAt: new Date(Date.now() - 2 * 86400000).toISOString(), // 2 days ago
    tags: ['IPO', 'Investing', 'Beginners Guide'],
  },
  {
    id: '3',
    slug: 'rbi-monetary-policy-outlook',
    title: 'RBI Monetary Policy: What to Expect and Its Impact on Your Finances',
    summary: 'The Reserve Bank of India is set to announce its next monetary policy. We explore potential outcomes and how changes in interest rates could affect loans, FDs, and overall market sentiment.',
    imageUrl: 'https://placehold.co/600x400.png',
    imageAiHint: 'bank building finance',
    category: categories[3], // Economy
    author: 'Anita Desai',
    publishedAt: new Date(Date.now() - 3 * 86400000).toISOString(), // 3 days ago
    tags: ['RBI', 'Monetary Policy', 'Interest Rates', 'Economy'],
  },
    {
    id: '4',
    slug: 'top-mutual-funds-2024',
    title: 'Top Performing Mutual Funds to Watch in Q3 2024',
    summary: 'Discover the mutual funds that have shown consistent growth and are recommended by experts for the upcoming quarter. Understand their strategies and risk profiles.',
    imageUrl: 'https://placehold.co/600x400.png',
    imageAiHint: 'financial report charts',
    category: categories[2], // Mutual Funds
    author: 'Vikram Singh',
    publishedAt: new Date(Date.now() - 4 * 86400000).toISOString(), // 4 days ago
    tags: ['Mutual Funds', 'Investment', 'Top Picks'],
  },
];

export const trendingHeadlines: TrendingHeadline[] = [
  {
    id: '1',
    title: 'Sensex jumps 500 points in early trade; IT stocks lead gains.',
    source: 'MarketFeed',
    url: '#',
    publishedAt: new Date().toISOString(),
    isGain: true,
  },
  {
    id: '2',
    title: 'New SEBI regulations for small-cap funds: A deep dive.',
    source: 'FinNews Daily',
    url: '#',
    publishedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  },
  {
    id: '3',
    title: 'Gold prices hit 2-week low on strong US dollar.',
    source: 'Commodity Times',
    url: '#',
    publishedAt: new Date(Date.now() - 2 * 3600000).toISOString(), // 2 hours ago
    isGain: false,
  },
  {
    id: '4',
    title: 'Tech Mahindra Q2 results beat estimates, stock up 5%.',
    source: 'StockWatch',
    url: '#',
    publishedAt: new Date(Date.now() - 3 * 3600000).toISOString(), // 3 hours ago
    isGain: true,
  },
   {
    id: '5',
    title: 'Global markets choppy ahead of Fed Chair testimony.',
    source: 'Global Investor',
    url: '#',
    publishedAt: new Date(Date.now() - 4 * 3600000).toISOString(), // 4 hours ago
  },
];

export const adSlots: AdConfig[] = [
  {
    id: 'top-banner',
    type: 'image',
    src: 'https://placehold.co/728x90.png',
    altText: 'Advertisement Banner',
    imageAiHint: 'advertisement banner',
    width: '100%',
    height: 90,
    className: 'mx-auto',
  },
  {
    id: 'sidebar-ad',
    type: 'image',
    src: 'https://placehold.co/300x250.png',
    altText: 'Advertisement Sidebar',
    imageAiHint: 'advertisement sidebar',
    width: 300,
    height: 250,
    className: 'mx-auto',
  },
  {
    id: 'inline-ad-1',
    type: 'image',
    src: 'https://placehold.co/468x60.png',
    altText: 'Inline Advertisement',
    imageAiHint: 'advertisement inline',
    width: '100%',
    height: 60,
    className: 'mx-auto my-4',
  }
];
