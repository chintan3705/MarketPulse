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
  content: string; // Made content non-optional as it's a core part
  imageUrl?: string;
  imageAiHint?: string;
  category: Category;
  categorySlug: string;
  categoryName: string;
  author: string;
  publishedAt: string; // ISO date string
  updatedAt: string; // ISO date string - ADDED
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
