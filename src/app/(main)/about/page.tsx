
import type { Metadata } from 'next';
import { Info } from "lucide-react";

export const metadata: Metadata = {
  title: 'About MarketPulse',
  description: 'Learn more about MarketPulse, our mission, and our dedication to providing timely financial insights and stock analysis to empower investors.',
  alternates: {
    canonical: '/about',
  },
   openGraph: {
    title: 'About MarketPulse',
    description: 'Learn more about MarketPulse, our mission, and our dedication to providing timely financial insights.',
    url: '/about',
  },
};

const SectionTitle = ({ title, icon: Icon }: { title: string; icon?: React.ElementType; }) => (
  <div className="flex items-center gap-2 mb-6">
    {Icon && <Icon className="h-7 w-7 text-primary" />}
    <h1 className="font-headline text-2xl sm:text-3xl font-bold">{title}</h1>
  </div>
);

export default function AboutPage() {
  return (
    <div className="container py-8 md:py-12 animate-slide-in" style={{animationDelay: '0.1s', animationFillMode: 'backwards'}}>
      <SectionTitle title="About MarketPulse" icon={Info} />
      <div className="prose prose-lg dark:prose-invert max-w-none space-y-4">
        <p>Welcome to MarketPulse, your daily lens on the share market. We are dedicated to providing timely updates, financial insights, and comprehensive stock analysis to help you navigate the complexities of the financial world.</p>
        <p>Our mission is to empower investors of all levels with accurate information and expert perspectives, enabling them to make informed decisions. Whether you're interested in the latest stock movements, IPO news, mutual fund performance, or broader economic trends, MarketPulse aims to be your go-to resource.</p>
        <p>Our team consists of experienced financial journalists, analysts, and market enthusiasts who are passionate about delivering high-quality content. We believe in clarity, accuracy, and relevance.</p>
        <p>Thank you for choosing MarketPulse. Stay informed, invest wisely.</p>
      </div>
    </div>
  );
}
