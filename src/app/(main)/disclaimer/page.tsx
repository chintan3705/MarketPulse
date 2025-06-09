
import type { Metadata } from 'next';
import { AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: 'Disclaimer | MarketPulse',
  description: 'Important disclaimer for MarketPulse. Information provided is for general purposes only and not financial advice. Understand investment risks.',
  alternates: {
    canonical: '/disclaimer',
  },
  openGraph: {
    title: 'Disclaimer | MarketPulse',
    description: 'Information provided is for general purposes only and not financial advice.',
    url: '/disclaimer',
  },
};

const SectionTitle = ({ title, icon: Icon }: { title: string; icon?: React.ElementType; }) => (
  <div className="flex items-center gap-2 mb-6">
    {Icon && <Icon className="h-7 w-7 text-primary" />}
    <h1 className="font-headline text-3xl font-bold">{title}</h1>
  </div>
);

export default function DisclaimerPage() {
  return (
    <div className="container py-8 md:py-12 animate-slide-in" style={{animationDelay: '0.1s', animationFillMode: 'backwards'}}>
      <SectionTitle title="Disclaimer" icon={AlertTriangle} />
      <div className="prose prose-lg dark:prose-invert max-w-none space-y-4">
        <p>The information provided by MarketPulse on our website is for general informational purposes only. All information on the site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.</p>
        <p><strong>Not Financial Advice:</strong> The content on MarketPulse is not intended to be a substitute for professional financial advice. Always seek the advice of a qualified financial advisor or other qualified financial service provider with any questions you may have regarding your financial situation or investments. Never disregard professional financial advice or delay in seeking it because of something you have read on this website.</p>
        <p><strong>Investment Risks:</strong> Investing in the stock market and other financial instruments involves risk. Past performance is not indicative of future results. The value of investments can go down as well as up, and you may not get back the amount you invested. MarketPulse is not responsible for any financial losses incurred as a result of using the information provided on this site.</p>
        <p><strong>External Links:</strong> Our website may contain links to external websites that are not provided or maintained by or in any way affiliated with MarketPulse. Please note that MarketPulse does not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites.</p>
        <p><strong>Views Expressed:</strong> Any views or opinions expressed by authors or contributors on MarketPulse are their own and do not necessarily reflect the views of MarketPulse as an organization.</p>
        <p>By using our website, you hereby consent to our disclaimer and agree to its terms.</p>
        <p>If you require any more information or have any questions about our site's disclaimer, please feel free to contact us by email at <a href="mailto:legal@marketpulse.example.com" className="text-primary hover:underline">legal@marketpulse.example.com</a>.</p>
      </div>
    </div>
  );
}
