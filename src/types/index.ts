
export interface NavItem {
  label: string;
  href: string;
  isExternal?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  summary: string; // AI-generated or manual
  imageUrl?: string;
  imageAiHint?: string;
  category: Category;
  author: string;
  publishedAt: string; // ISO date string
  tags: string[];
  content?: string; // Full content for blog post page
  isAiGenerated?: boolean; // To distinguish AI-generated posts
}

export interface TrendingHeadline {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string; // ISO date string
  isGain?: boolean; // Optional: to color code if it's a stock price movement
}

export interface AdConfig {
  id: string;
  type: 'image' | 'script' | 'tradingview-widget';
  src?: string; // For image or script URL
  tradingViewWidgetConfig?: any; // For TradingView specific config
  altText?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  imageAiHint?: string;
}
