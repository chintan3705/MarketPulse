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
  weight: ["400", "500", "700"], // Added 400 for more flexibility
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
  // icons: { // Example, ensure these files exist in /public if uncommented
  //   icon: '/favicon.ico',
  //   shortcut: '/favicon-16x16.png',
  //   apple: '/apple-touch-icon.png',
  // },
  // manifest: '/site.webmanifest', // Ensure this file exists in /public if uncommented
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} light`} // Default to light theme
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
                  if (preference === 'dark') {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                  } else {
                    // Default to light if no preference or preference is 'light'
                    document.documentElement.classList.add('light');
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {
                  // If localStorage is not available, default to light
                  document.documentElement.classList.add('light');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
        <SmoothScroller />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
