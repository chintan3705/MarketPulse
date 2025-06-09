
import type { BlogPost, TrendingHeadline, Category, AdConfig } from '@/types';

export const categories: Category[] = [
  { id: '1', name: 'Stocks', slug: 'stocks' },
  { id: '2', name: 'IPOs', slug: 'ipos' },
  { id: '3', name: 'Mutual Funds', slug: 'mutual-funds' },
  { id: '4', name: 'Economy', slug: 'economy' },
  { id: '5', name: 'Global Markets', slug: 'global-markets' },
  { id: '6', name: 'Crypto', slug: 'crypto' },
  { id: '7', name: 'Personal Finance', slug: 'personal-finance' },
  { id: '8', name: 'General', slug: 'general'} 
];

// IMPORTANT: Blog posts are now managed in MongoDB.
// The `latestBlogPosts` array below is no longer the primary source for blog content
// on the live site. It can be kept for local testing or completely removed.
// New AI-generated blog posts are added to MongoDB via the Admin Panel.
// Statically defined posts here will NOT appear on the site if pages fetch from the DB.

export const latestBlogPosts: BlogPost[] = [
  // {
  //   id: '1', // This ID might conflict if also used in MongoDB. Consider removing static posts or ensuring unique IDs.
  //   slug: 'nifty-hits-all-time-high',
  //   title: 'Nifty Soars to New All-Time High: What\'s Fueling the Rally?',
  //   summary: 'The Indian stock market benchmark Nifty 50 reached a historic peak today, driven by strong global cues and robust domestic inflows. Analysts predict further upside potential amidst positive economic indicators.',
  //   imageUrl: 'https://placehold.co/800x450.png',
  //   imageAiHint: 'stock chart upward',
  //   category: categories[0], // Stocks
  //   categorySlug: categories[0].slug,
  //   categoryName: categories[0].name,
  //   author: 'Priya Sharma',
  //   publishedAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
  //   tags: ['Nifty', 'Stock Market', 'Bull Run', 'Investing'],
  //   isAiGenerated: false,
  //   content: `
  //     <p>The Indian equity markets continued their upward trajectory on Tuesday, with the Nifty 50 index scaling a fresh record high of 2X,XXX.XX, surpassing its previous lifetime peak. The Sensex also traded firmly in the green, nearing its all-time high. This bullish momentum is attributed to a confluence of positive factors, including sustained foreign institutional investor (FII) inflows, encouraging domestic macroeconomic data, and favorable global market sentiment.</p>
  //     <h3 class="text-xl font-semibold mt-4 mb-2">Key Drivers of the Rally:</h3>
  //     <ul class="list-disc list-inside space-y-1 mb-4">
  //       <li><strong>Strong Global Cues:</strong> Positive trends in Asian and US markets provided a supportive backdrop for Indian equities.</li>
  //       <li><strong>Robust FII Inflows:</strong> Foreign investors have shown renewed confidence in the Indian market, pumping in significant capital over the past few weeks.</li>
  //       <li><strong>Positive Economic Indicators:</strong> Recent data on GST collections, PMI manufacturing, and services activity have painted a healthy picture of the Indian economy.</li>
  //       <li><strong>Corporate Earnings:</strong> While mixed, the overall corporate earnings season for Q1 has been largely in line with expectations, with several sectors reporting strong growth.</li>
  //     </ul>
  //     <p>Market analysts remain optimistic about the near-term outlook, citing strong fundamentals and a resilient domestic economy. However, they also advise caution, pointing to potential risks from global geopolitical tensions and rising inflation in some developed economies. Investors are advised to maintain a diversified portfolio and adopt a stock-specific approach.</p>
  //     <p>The rally was broad-based, with banking, IT, and auto stocks leading the gains. Mid-cap and small-cap indices also participated in the upward move, indicating healthy market breadth.</p>
  //   `,
  // },
  // ... other static posts can be commented out or removed
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
    publishedAt: new Date(Date.now() - 3600000).toISOString(), 
  },
  {
    id: '3',
    title: 'Gold prices hit 2-week low on strong US dollar.',
    source: 'Commodity Times',
    url: '#',
    publishedAt: new Date(Date.now() - 2 * 3600000).toISOString(), 
    isGain: false,
  },
  {
    id: '4',
    title: 'Tech Mahindra Q2 results beat estimates, stock up 5%.',
    source: 'StockWatch',
    url: '#',
    publishedAt: new Date(Date.now() - 3 * 3600000).toISOString(), 
    isGain: true,
  },
   {
    id: '5',
    title: 'Global markets choppy ahead of Fed Chair testimony.',
    source: 'Global Investor',
    url: '#',
    publishedAt: new Date(Date.now() - 4 * 3600000).toISOString(), 
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
  },
  {
    id: 'tradingview-chart-example',
    type: 'tradingview-widget',
    width: '100%',
    height: 400,
    className: 'mx-auto my-4',
    tradingViewWidgetConfig: {
      symbol: 'NASDAQ:AAPL',
      theme: 'light', 
    }
  }
];
