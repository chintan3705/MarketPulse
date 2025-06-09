
import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster";
import './globals.css';

// Define a base URL for your site. Replace with your actual domain.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.marketpulse.example.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'MarketPulse – Your Daily Lens on the Share Market',
    template: '%s | MarketPulse',
  },
  description: 'Real-time Share Market News Blog Platform delivering timely updates, financial insights, and stock analysis.',
  keywords: ['stock market', 'share market', 'finance', 'investing', 'news', 'analysis', 'IPO', 'Nifty', 'Sensex', 'MarketPulse'],
  authors: [{ name: 'MarketPulse Team', url: `${SITE_URL}/about` }],
  creator: 'MarketPulse Team',
  publisher: 'MarketPulse',
  openGraph: {
    title: 'MarketPulse – Your Daily Lens on the Share Market',
    description: 'Real-time Share Market News Blog Platform delivering timely updates, financial insights, and stock analysis.',
    url: SITE_URL,
    siteName: 'MarketPulse',
    images: [
      {
        url: `${SITE_URL}/og-image.png`, // Replace with your actual OG image path
        width: 1200,
        height: 630,
        alt: 'MarketPulse Logo and Tagline',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MarketPulse – Your Daily Lens on the Share Market',
    description: 'Real-time Share Market News Blog Platform delivering timely updates, financial insights, and stock analysis.',
    // siteId: 'YourTwitterSiteId', // Optional: Your Twitter user ID
    creator: '@YourTwitterHandle', // Optional: Your Twitter handle
    // creatorId: 'YourTwitterCreatorId', // Optional: Your Twitter user ID for the creator
    images: [`${SITE_URL}/twitter-image.png`], // Replace with your actual Twitter image path
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // Optional: Add icons, manifest if you have them
  // icons: {
  //   icon: '/favicon.ico', // Temporarily commented out
  //   shortcut: '/favicon-16x16.png',
  //   apple: '/apple-touch-icon.png',
  // },
  // manifest: `${SITE_URL}/site.webmanifest`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
