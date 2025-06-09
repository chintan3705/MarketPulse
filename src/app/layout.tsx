
import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster";
import { SmoothScroller } from '@/components/common/SmoothScroller'; // Import SmoothScroller
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
        url: `${SITE_URL}/og-image.png`, 
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
    // siteId: 'YourTwitterSiteId', 
    creator: '@YourTwitterHandle', 
    // creatorId: 'YourTwitterCreatorId', 
    images: [`${SITE_URL}/twitter-image.png`], 
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
  // icons: { 
  //   icon: '/favicon.ico',
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
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
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
                    document.documentElement.classList.add('dark');
                     document.documentElement.classList.remove('light');
                  }
                } catch (e) {
                  // If localStorage is not available, default to dark
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen bg-background text-foreground">
        <SmoothScroller /> {/* Initialize Lenis smooth scrolling */}
        {children}
        <Toaster />
      </body>
    </html>
  );
}
