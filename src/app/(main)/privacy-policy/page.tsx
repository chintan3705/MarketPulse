
import type { Metadata } from 'next';
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: 'Privacy Policy | MarketPulse',
  description: 'Read the MarketPulse Privacy Policy to understand how we collect, use, and protect your personal data when you use our financial news service.',
  alternates: {
    canonical: '/privacy-policy',
  },
  openGraph: {
    title: 'Privacy Policy | MarketPulse',
    description: 'Understand how MarketPulse collects, uses, and protects your personal data.',
    url: '/privacy-policy',
  },
};

const SectionTitle = ({ title, icon: Icon }: { title: string; icon?: React.ElementType; }) => (
  <div className="flex items-center gap-2 mb-6">
    {Icon && <Icon className="h-7 w-7 text-primary" />}
    <h1 className="font-headline text-3xl font-bold">{title}</h1>
  </div>
);

export default function PrivacyPolicyPage() {
  return (
    <div className="container py-8 md:py-12 animate-slide-in" style={{animationDelay: '0.1s', animationFillMode: 'backwards'}}>
      <SectionTitle title="Privacy Policy" icon={ShieldCheck} />
      <div className="prose prose-sm dark:prose-invert max-w-none space-y-3">
        <p><strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        
        <p>MarketPulse ("us", "we", or "our") operates the MarketPulse website (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.</p>

        <h3 className="font-semibold text-lg mt-3">Information Collection and Use</h3>
        <p>We collect several different types of information for various purposes to provide and improve our Service to you. (Placeholder: Specific types of data collected would be detailed here).</p>

        <h3 className="font-semibold text-lg mt-3">Log Data</h3>
        <p>We may also collect information that your browser sends whenever you visit our Service or when you access the Service by or through a mobile device ("Log Data"). This Log Data may include information such as your computer's Internet Protocol ("IP") address, browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data. (Placeholder)</p>

        <h3 className="font-semibold text-lg mt-3">Cookies</h3>
        <p>We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. (Placeholder: Detailed cookie policy would be here).</p>

        <h3 className="font-semibold text-lg mt-3">Use of Data</h3>
        <p>MarketPulse uses the collected data for various purposes: (Placeholder: list purposes)</p>
        <ul className="list-disc list-inside">
            <li>To provide and maintain the Service</li>
            <li>To notify you about changes to our Service</li>
            <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
            <li>To provide customer care and support</li>
            <li>To provide analysis or valuable information so that we can improve the Service</li>
            <li>To monitor the usage of the Service</li>
            <li>To detect, prevent and address technical issues</li>
        </ul>

        <h3 className="font-semibold text-lg mt-3">Security of Data</h3>
        <p>The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security. (Placeholder)</p>
        
        <h3 className="font-semibold text-lg mt-3">Changes to This Privacy Policy</h3>
        <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes. (Placeholder)</p>

        <h3 className="font-semibold text-lg mt-3">Contact Us</h3>
        <p>If you have any questions about this Privacy Policy, please contact us: <a href="mailto:privacy@marketpulse.example.com" className="text-primary hover:underline">privacy@marketpulse.example.com</a>. (Placeholder)</p>
      </div>
    </div>
  );
}
