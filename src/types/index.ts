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
  id?: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  imageUrl?: string;
  imageAiHint?: string;
  category: Category;
  categorySlug: string;
  categoryName: string;
  author: string;
  publishedAt: string; // ISO date string
  updatedAt: string; // ISO date string
  tags: string[];
  isAiGenerated?: boolean;
  chartType?: "bar" | "line" | "pie" | "table";
  chartDataJson?: string;
  detailedInformation?: string;
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
  [key: string]: string | number | boolean | undefined;
}

export interface AdConfig {
  id: string;
  type: "image" | "script" | "tradingview-widget";
  src?: string;
  tradingViewWidgetConfig?: TradingViewWidgetConfig;
  altText?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  imageAiHint?: string;
}

// Added for MarketAux API integration
export interface MarketAuxNewsItem {
  uuid: string;
  title: string;
  description: string;
  url: string;
  image_url?: string; // Optional
  source: string;
  published_at: string; // ISO date string
  language: string;
  // Add other fields if needed, e.g., entities
}
