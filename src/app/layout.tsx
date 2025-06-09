import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster";
import './globals.css';

export const metadata: Metadata = {
  title: 'MarketPulse – Your Daily Lens on the Share Market',
  description: 'Real-time Share Market News Blog Platform delivering timely updates, financial insights, and stock analysis.',
  // Basic SEO - can be expanded with OpenGraph, etc.
  keywords: ['stock market', 'share market', 'finance', 'investing', 'news', 'analysis', 'IPO', 'Nifty', 'Sensex'],
  authors: [{ name: 'MarketPulse Team' }],
  // Add more structured data here if needed for sitewide context
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
