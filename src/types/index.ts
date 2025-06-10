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
  _id?: string; // From MongoDB
  id?: string; // Kept for potential frontend compatibility, maps to _id
  slug: string;
  title: string;
  summary: string;
  imageUrl?: string;
  imageAiHint?: string;
  category: Category; // Populated by API based on categorySlug
  categorySlug: string; // Stored in DB
  categoryName: string; // Stored in DB for convenience
  author: string;
  publishedAt: string; // ISO date string
  tags: string[];
  content?: string; // Full HTML content
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
  theme?: "light" | "dark";
  interval?: string;
  // Allow any other string/number/boolean properties
  [key: string]: string | number | boolean | undefined;
}

export interface AdConfig {
  id: string;
  type: "image" | "script" | "tradingview-widget";
  src?: string; // For image type
  tradingViewWidgetConfig?: TradingViewWidgetConfig; // For TradingView widget type
  altText?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  imageAiHint?: string; // For image type, used in data-ai-hint
}
