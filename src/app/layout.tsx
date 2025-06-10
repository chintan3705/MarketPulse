import type { Metadata } from "next";
import { Inter, Space_Grotesk as SpaceGroteskFont } from "next/font/google"; // Renamed for clarity
import { Toaster } from "@/components/ui/toaster";
import { SmoothScroller } from "@/components/common/SmoothScroller";
import "./globals.css";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.marketpulse.example.com";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter", // CSS variable for Tailwind
});

const spaceGrotesk = SpaceGroteskFont({
  // Renamed import
  subsets: ["latin"],
  weight: ["500", "700"], // Specify desired weights
  display: "swap",
  variable: "--font-space-grotesk", // CSS variable for Tailwind
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "MarketPulse – Your Daily Lens on the Share Market",
    template: "%s | MarketPulse",
  },
  description:
    "Real-time Share Market News Blog Platform delivering timely updates, financial insights, and stock analysis.",
  keywords: [
    "stock market",
    "share market",
    "finance",
    "investing",
    "news",
    "analysis",
    "IPO",
    "Nifty",
    "Sensex",
    "MarketPulse",
  ],
  authors: [{ name: "MarketPulse Team", url: `${SITE_URL}/about` }],
  creator: "MarketPulse Team",
  publisher: "MarketPulse",
  openGraph: {
    title: "MarketPulse – Your Daily Lens on the Share Market",
    description:
      "Real-time Share Market News Blog Platform delivering timely updates, financial insights, and stock analysis.",
    url: SITE_URL,
    siteName: "MarketPulse",
    images: [
      {
        url: "/og-image.png", // Relative path for /public
        width: 1200,
        height: 630,
        alt: "MarketPulse Logo and Tagline",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MarketPulse – Your Daily Lens on the Share Market",
    description:
      "Real-time Share Market News Blog Platform delivering timely updates, financial insights, and stock analysis.",
    // siteId: 'YourTwitterSiteId', // Optional: Your Twitter Site ID
    // creator: '@YourTwitterHandle', // Optional: Your Twitter Handle
    // creatorId: 'YourTwitterCreatorId', // Optional: Your Twitter Creator ID
    images: [`${SITE_URL}/twitter-image.png`], // Needs to be absolute for Twitter
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // Add icons and manifest if you have them in /public
  // icons: {
  //   icon: '/favicon.ico',
  //   shortcut: '/favicon-16x16.png',
  //   apple: '/apple-touch-icon.png',
  // },
  // manifest: '/site.webmanifest',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} dark`} // Apply font variables and default to dark
      suppressHydrationWarning // Suppress warning for theme toggle script
    >
      <head>
        {/* Initial theme setup script to prevent FOUC */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const preference = localStorage.getItem('theme');
                  if (preference === 'light') {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                  } else {
                    // Default to dark if no preference or preference is 'dark'
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                  }
                } catch (e) {
                  // If localStorage is not available (e.g., SSR or restricted environment), default to dark
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen bg-background text-foreground">
        <SmoothScroller />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
