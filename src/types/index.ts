
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
  _id?: string;
  id?: string; // Kept for potential compatibility, but _id is primary for DB
  slug: string;
  title: string;
  summary: string;
  imageUrl?: string;
  imageAiHint?: string;
  category: Category; // This will be populated by API based on categorySlug
  categorySlug: string; // Stored in DB
  categoryName: string; // Stored in DB
  author: string;
  publishedAt: string; // ISO date string
  tags: string[];
  content?: string;
  isAiGenerated?: boolean;
}

export interface TrendingHeadline {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string; // ISO date string
  isGain?: boolean;
}

export interface TradingViewWidgetConfig {
  symbol?: string;
  theme?: 'light' | 'dark';
  interval?: string;
  // Allow any other string/number/boolean properties
  [key: string]: string | number | boolean | undefined;
}

export interface AdConfig {
  id: string;
  type: 'image' | 'script' | 'tradingview-widget';
  src?: string;
  tradingViewWidgetConfig?: TradingViewWidgetConfig;
  altText?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  imageAiHint?: string;
}
