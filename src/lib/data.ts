import type { BlogPost, TrendingHeadline, Category, AdConfig } from '@/types';

export const categories: Category[] = [
  { id: '1', name: 'Stocks', slug: 'stocks' },
  { id: '2', name: 'IPOs', slug: 'ipos' },
  { id: '3', name: 'Mutual Funds', slug: 'mutual-funds' },
  { id: '4', name: 'Economy', slug: 'economy' },
  { id: '5', name: 'Global Markets', slug: 'global-markets' },
  { id: '6', name: 'Crypto', slug: 'crypto' },
  { id: '7', name: 'Personal Finance', slug: 'personal-finance' },
];

export const latestBlogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'nifty-hits-all-time-high',
    title: 'Nifty Soars to New All-Time High: What\'s Fueling the Rally?',
    summary: 'The Indian stock market benchmark Nifty 50 reached a historic peak today, driven by strong global cues and robust domestic inflows. Analysts predict further upside potential amidst positive economic indicators.',
    imageUrl: 'https://placehold.co/800x450.png',
    imageAiHint: 'stock chart upward',
    category: categories[0], // Stocks
    author: 'Priya Sharma',
    publishedAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    tags: ['Nifty', 'Stock Market', 'Bull Run'],
    content: `
      <p>The Indian equity markets continued their upward trajectory on Tuesday, with the Nifty 50 index scaling a fresh record high of 2X,XXX.XX, surpassing its previous lifetime peak. The Sensex also traded firmly in the green, nearing its all-time high. This bullish momentum is attributed to a confluence of positive factors, including sustained foreign institutional investor (FII) inflows, encouraging domestic macroeconomic data, and favorable global market sentiment.</p>
      <h3 class="text-xl font-semibold mt-4 mb-2">Key Drivers of the Rally:</h3>
      <ul class="list-disc list-inside space-y-1 mb-4">
        <li><strong>Strong Global Cues:</strong> Positive trends in Asian and US markets provided a supportive backdrop for Indian equities.</li>
        <li><strong>Robust FII Inflows:</strong> Foreign investors have shown renewed confidence in the Indian market, pumping in significant capital over the past few weeks.</li>
        <li><strong>Positive Economic Indicators:</strong> Recent data on GST collections, PMI manufacturing, and services activity have painted a healthy picture of the Indian economy.</li>
        <li><strong>Corporate Earnings:</strong> While mixed, the overall corporate earnings season for Q1 has been largely in line with expectations, with several sectors reporting strong growth.</li>
      </ul>
      <p>Market analysts remain optimistic about the near-term outlook, citing strong fundamentals and a resilient domestic economy. However, they also advise caution, pointing to potential risks from global geopolitical tensions and rising inflation in some developed economies. Investors are advised to maintain a diversified portfolio and adopt a stock-specific approach.</p>
      <p>The rally was broad-based, with banking, IT, and auto stocks leading the gains. Mid-cap and small-cap indices also participated in the upward move, indicating healthy market breadth.</p>
    `,
  },
  {
    id: '2',
    slug: 'understanding-ipo-investing',
    title: 'The Ultimate Guide to IPO Investing for Beginners',
    summary: 'Initial Public Offerings (IPOs) can be exciting investment opportunities, but they come with risks. This guide breaks down everything you need to know before diving into the IPO market.',
    imageUrl: 'https://placehold.co/800x450.png',
    imageAiHint: 'investment growth',
    category: categories[1], // IPOs
    author: 'Rohan Mehra',
    publishedAt: new Date(Date.now() - 2 * 86400000).toISOString(), // 2 days ago
    tags: ['IPO', 'Investing', 'Beginners Guide'],
    content: `
      <p>Initial Public Offerings (IPOs) often generate significant buzz in the investment world. The prospect of getting in on the ground floor of a promising company can be alluring. However, IPO investing is not without its complexities and risks. This guide aims to demystify IPOs for beginner investors.</p>
      <h3 class="text-xl font-semibold mt-4 mb-2">What is an IPO?</h3>
      <p>An IPO is the process by which a private company first sells its shares to the public, thereby becoming a publicly-traded company. Companies go public for various reasons, including raising capital for expansion, providing an exit for early investors, or increasing brand visibility.</p>
      <h3 class="text-xl font-semibold mt-4 mb-2">Things to Consider Before Investing in an IPO:</h3>
      <ul class="list-disc list-inside space-y-1 mb-4">
        <li><strong>Company Fundamentals:</strong> Thoroughly research the company's business model, financial health, growth prospects, and competitive landscape. Read the Draft Red Herring Prospectus (DRHP) carefully.</li>
        <li><strong>Valuation:</strong> IPOs can sometimes be overvalued due to hype. Compare the company's valuation metrics with its peers.</li>
        <li><strong>Use of Proceeds:</strong> Understand how the company plans to use the capital raised from the IPO.</li>
        <li><strong>Lock-in Periods:</strong> Be aware of lock-in periods for promoters and anchor investors, as their selling post-lock-in can impact share prices.</li>
        <li><strong>Market Sentiment:</strong> Broader market conditions can significantly affect an IPO's performance.</li>
      </ul>
      <p>Investing in IPOs can be rewarding, but it requires due diligence and a clear understanding of the risks involved. It's often advisable for beginners to start with small allocations and consult a financial advisor.</p>
    `,
  },
  {
    id: '3',
    slug: 'rbi-monetary-policy-outlook',
    title: 'RBI Monetary Policy: What to Expect and Its Impact on Your Finances',
    summary: 'The Reserve Bank of India is set to announce its next monetary policy. We explore potential outcomes and how changes in interest rates could affect loans, FDs, and overall market sentiment.',
    imageUrl: 'https://placehold.co/800x450.png',
    imageAiHint: 'bank building finance',
    category: categories[3], // Economy
    author: 'Anita Desai',
    publishedAt: new Date(Date.now() - 3 * 86400000).toISOString(), // 3 days ago
    tags: ['RBI', 'Monetary Policy', 'Interest Rates', 'Economy'],
    content: `
      <p>All eyes are on the Reserve Bank of India (RBI) as its Monetary Policy Committee (MPC) convenes for its bi-monthly review. The decisions made by the MPC regarding key interest rates, such as the repo rate, have far-reaching implications for the economy, financial markets, and individual finances.</p>
      <h3 class="text-xl font-semibold mt-4 mb-2">Factors Influencing the Policy Decision:</h3>
      <ul class="list-disc list-inside space-y-1 mb-4">
        <li><strong>Inflation Trajectory:</strong> Retail inflation (CPI) remains a key concern. The RBI will assess current inflation levels and future outlook.</li>
        <li><strong>Economic Growth:</strong> Balancing inflation control with supporting economic growth is a critical task for the MPC.</li>
        <li><strong>Global Economic Conditions:</strong> Monetary policy actions by major central banks worldwide, global commodity prices, and geopolitical developments also play a role.</li>
        <li><strong>Liquidity Conditions:</strong> The RBI monitors liquidity in the banking system and may take measures to manage it.</li>
      </ul>
      <h3 class="text-xl font-semibold mt-4 mb-2">Potential Impact on You:</h3>
      <ul class="list-disc list-inside space-y-1 mb-4">
        <li><strong>Loan EMIs:</strong> If the repo rate is hiked, banks may increase lending rates, leading to higher EMIs for home, auto, and personal loans. A rate cut could have the opposite effect.</li>
        <li><strong>Fixed Deposit (FD) Rates:</strong> Changes in policy rates can influence FD interest rates offered by banks.</li>
        <li><strong>Market Sentiment:</strong> The policy announcement often impacts stock market movements, particularly for rate-sensitive sectors like banking and real estate.</li>
      </ul>
      <p>Understanding the nuances of the RBI's monetary policy can help individuals make informed financial decisions. It's important to follow the MPC's commentary for insights into the central bank's assessment of the economy.</p>
    `,
  },
    {
    id: '4',
    slug: 'top-mutual-funds-2024',
    title: 'Top Performing Mutual Funds to Watch in Q3 2024',
    summary: 'Discover the mutual funds that have shown consistent growth and are recommended by experts for the upcoming quarter. Understand their strategies and risk profiles.',
    imageUrl: 'https://placehold.co/800x450.png',
    imageAiHint: 'financial report charts',
    category: categories[2], // Mutual Funds
    author: 'Vikram Singh',
    publishedAt: new Date(Date.now() - 4 * 86400000).toISOString(), // 4 days ago
    tags: ['Mutual Funds', 'Investment', 'Top Picks'],
    content: `
      <p>Choosing the right mutual fund can be a daunting task given the plethora of options available. This article highlights some of the top-performing mutual funds that investors could consider watching or adding to their portfolio in the third quarter of 2024, based on expert analysis and past performance. Remember, past performance is not indicative of future returns, and it's crucial to align investments with your financial goals and risk appetite.</p>
      <h3 class="text-xl font-semibold mt-4 mb-2">Key Categories to Consider:</h3>
      <ul class="list-disc list-inside space-y-1 mb-4">
        <li><strong>Large-Cap Funds:</strong> Known for stability, investing in established blue-chip companies.</li>
        <li><strong>Mid-Cap Funds:</strong> Offer a balance of growth potential and risk, investing in medium-sized companies.</li>
        <li><strong>Small-Cap Funds:</strong> High growth potential but come with higher risk, investing in smaller companies.</li>
        <li><strong>Flexi-Cap Funds:</strong> Offer fund managers the flexibility to invest across market capitalizations based on market outlook.</li>
        <li><strong>ELSS Funds:</strong> Tax-saving funds with a lock-in period of 3 years, eligible for deduction under Section 80C.</li>
      </ul>
      <p>When evaluating mutual funds, look beyond just returns. Consider factors like the fund manager's experience, expense ratio, investment strategy, and the fund house's reputation. Diversification across different fund types and asset classes is key to building a resilient portfolio. It's always recommended to consult with a financial advisor before making any investment decisions.</p>
    `,
  },
];

export const trendingHeadlines: TrendingHeadline[] = [
  {
    id: '1',
    title: 'Sensex jumps 500 points in early trade; IT stocks lead gains.',
    source: 'MarketFeed',
    url: '#',
    publishedAt: new Date().toISOString(),
    isGain: true,
  },
  {
    id: '2',
    title: 'New SEBI regulations for small-cap funds: A deep dive.',
    source: 'FinNews Daily',
    url: '#',
    publishedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  },
  {
    id: '3',
    title: 'Gold prices hit 2-week low on strong US dollar.',
    source: 'Commodity Times',
    url: '#',
    publishedAt: new Date(Date.now() - 2 * 3600000).toISOString(), // 2 hours ago
    isGain: false,
  },
  {
    id: '4',
    title: 'Tech Mahindra Q2 results beat estimates, stock up 5%.',
    source: 'StockWatch',
    url: '#',
    publishedAt: new Date(Date.now() - 3 * 3600000).toISOString(), // 3 hours ago
    isGain: true,
  },
   {
    id: '5',
    title: 'Global markets choppy ahead of Fed Chair testimony.',
    source: 'Global Investor',
    url: '#',
    publishedAt: new Date(Date.now() - 4 * 3600000).toISOString(), // 4 hours ago
  },
];

export const adSlots: AdConfig[] = [
  {
    id: 'top-banner',
    type: 'image',
    src: 'https://placehold.co/728x90.png',
    altText: 'Advertisement Banner',
    imageAiHint: 'advertisement banner',
    width: '100%',
    height: 90,
    className: 'mx-auto',
  },
  {
    id: 'sidebar-ad',
    type: 'image',
    src: 'https://placehold.co/300x250.png',
    altText: 'Advertisement Sidebar',
    imageAiHint: 'advertisement sidebar',
    width: 300,
    height: 250,
    className: 'mx-auto',
  },
  {
    id: 'inline-ad-1',
    type: 'image',
    src: 'https://placehold.co/468x60.png',
    altText: 'Inline Advertisement',
    imageAiHint: 'advertisement inline',
    width: '100%',
    height: 60,
    className: 'mx-auto my-4',
  }
];
