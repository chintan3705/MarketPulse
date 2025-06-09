
import type { Metadata } from 'next';
import { FileText } from "lucide-react";

export const metadata: Metadata = {
  title: 'Terms of Service | MarketPulse',
  description: 'Read the MarketPulse Terms of Service. Understand the rules and guidelines for using our financial news and analysis platform.',
  alternates: {
    canonical: '/terms-of-service',
  },
  openGraph: {
    title: 'Terms of Service | MarketPulse',
    description: 'Understand the rules and guidelines for using the MarketPulse platform.',
    url: '/terms-of-service',
  },
};

const SectionTitle = ({ title, icon: Icon }: { title: string; icon?: React.ElementType; }) => (
  <div className="flex items-center gap-2 mb-6">
    {Icon && <Icon className="h-7 w-7 text-primary" />}
    <h1 className="font-headline text-3xl font-bold">{title}</h1>
  </div>
);

export default function TermsOfServicePage() {
  return (
    <div className="container py-8 md:py-12 animate-slide-in" style={{animationDelay: '0.1s', animationFillMode: 'backwards'}}>
      <SectionTitle title="Terms of Service" icon={FileText} />
      <div className="prose prose-sm dark:prose-invert max-w-none space-y-3">
        <p><strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        
        <p>Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the MarketPulse website (the "Service") operated by MarketPulse ("us", "we", or "our").</p>
        <p>Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who access or use the Service.</p>
        <p>By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service. (Placeholder)</p>

        <h3 className="font-semibold text-lg mt-3">Content</h3>
        <p>Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post to the Service, including its legality, reliability, and appropriateness. (Placeholder: Detailed content policies would be here).</p>
        
        <h3 className="font-semibold text-lg mt-3">Accounts</h3>
        <p>When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service. (Placeholder)</p>

        <h3 className="font-semibold text-lg mt-3">Intellectual Property</h3>
        <p>The Service and its original content (excluding Content provided by users), features and functionality are and will remain the exclusive property of MarketPulse and its licensors. (Placeholder)</p>
        
        <h3 className="font-semibold text-lg mt-3">Links To Other Web Sites</h3>
        <p>Our Service may contain links to third-party web sites or services that are not owned or controlled by MarketPulse. MarketPulse has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party web sites or services. (Placeholder)</p>

        <h3 className="font-semibold text-lg mt-3">Termination</h3>
        <p>We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. (Placeholder)</p>

        <h3 className="font-semibold text-lg mt-3">Governing Law</h3>
        <p>These Terms shall be governed and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions. (Placeholder: Specify jurisdiction).</p>

        <h3 className="font-semibold text-lg mt-3">Changes</h3>
        <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. (Placeholder)</p>

        <h3 className="font-semibold text-lg mt-3">Contact Us</h3>
        <p>If you have any questions about these Terms, please contact us: <a href="mailto:legal@marketpulse.example.com" className="text-primary hover:underline">legal@marketpulse.example.com</a>. (Placeholder)</p>
      </div>
    </div>
  );
}
