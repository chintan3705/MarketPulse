
import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail } from "lucide-react";

export const metadata: Metadata = {
  title: 'Contact MarketPulse',
  description: 'Get in touch with MarketPulse for inquiries, feedback, or news tips. Find our contact email addresses for general, editorial, and advertising queries.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact MarketPulse',
    description: 'Get in touch with MarketPulse for inquiries, feedback, or news tips.',
    url: '/contact',
  },
};

const SectionTitle = ({ title, icon: Icon }: { title: string; icon?: React.ElementType; }) => (
  <div className="flex items-center gap-2 mb-6">
    {Icon && <Icon className="h-7 w-7 text-primary" />}
    <h1 className="font-headline text-3xl font-bold">{title}</h1>
  </div>
);

export default function ContactPage() {
  return (
    <div className="container py-8 md:py-12 animate-slide-in" style={{animationDelay: '0.1s', animationFillMode: 'backwards'}}>
      <SectionTitle title="Contact Us" icon={Mail} />
      <div className="prose prose-lg dark:prose-invert max-w-none space-y-4">
        <p>We'd love to hear from you! Whether you have a question, feedback, or a news tip, please feel free to reach out to us.</p>
        
        <h3 className="font-semibold text-xl">General Inquiries</h3>
        <p>For general questions or information, please email us at: <a href="mailto:info@marketpulse.example.com" className="text-primary hover:underline">info@marketpulse.example.com</a></p>

        <h3 className="font-semibold text-xl">Editorial Team</h3>
        <p>If you have a story idea or want to reach our editorial team, contact: <a href="mailto:editor@marketpulse.example.com" className="text-primary hover:underline">editor@marketpulse.example.com</a></p>
        
        <h3 className="font-semibold text-xl">Advertising</h3>
        <p>For advertising opportunities, please visit our <Link href="/advertise" className="text-primary hover:underline">Advertise page</Link> or email: <a href="mailto:ads@marketpulse.example.com" className="text-primary hover:underline">ads@marketpulse.example.com</a></p>

        <p>Our team will do their best to respond to your inquiry as soon as possible.</p>
      </div>
    </div>
  );
}
