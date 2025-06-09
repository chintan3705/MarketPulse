import type { Metadata } from "next";
import { Briefcase } from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:9002";

export const metadata: Metadata = {
  title: "Careers at MarketPulse",
  description:
    "Join the MarketPulse team! Explore career opportunities in financial journalism, analysis, technology, and design. Help us shape the future of financial news.",
  alternates: {
    canonical: `${SITE_URL}/careers`,
  },
  openGraph: {
    title: "Careers at MarketPulse",
    description:
      "Explore career opportunities at MarketPulse and help us shape the future of financial news.",
    url: `${SITE_URL}/careers`,
    type: "website",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Careers at MarketPulse",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Careers at MarketPulse",
    description:
      "Explore career opportunities at MarketPulse and help us shape the future of financial news.",
    images: [`${SITE_URL}/twitter-image.png`],
  },
};

const SectionTitle = ({
  title,
  icon: Icon,
}: {
  title: string;
  icon?: React.ElementType;
}) => (
  <div className="flex items-center gap-2 mb-6">
    {Icon && <Icon className="h-7 w-7 text-primary" />}
    <h1 className="font-headline text-2xl sm:text-3xl font-bold">{title}</h1>
  </div>
);

export default function CareersPage() {
  return (
    <div
      className="container py-8 md:py-12 animate-slide-in"
      style={{ animationDelay: "0.1s", animationFillMode: "backwards" }}
    >
      <SectionTitle title="Careers at MarketPulse" icon={Briefcase} />
      <div className="prose prose-lg dark:prose-invert max-w-none space-y-4">
        <p>
          Join our passionate team at MarketPulse and help us shape the future
          of financial news and analysis!
        </p>
        <p>
          We are always looking for talented individuals who are enthusiastic
          about the financial markets, journalism, technology, and design. If
          you are driven, innovative, and want to make an impact, MarketPulse
          could be the place for you.
        </p>

        <h3 className="font-semibold text-xl">Current Openings</h3>
        <p className="text-muted-foreground">
          There are currently no open positions. However, we encourage you to
          check back regularly for updates.
        </p>

        <h3 className="font-semibold text-xl">Why Work With Us?</h3>
        <ul className="list-disc list-inside">
          <li>Be part of a dynamic and growing industry.</li>
          <li>Work with a collaborative and supportive team.</li>
          <li>Opportunities for learning and professional development.</li>
          <li>
            Contribute to providing valuable financial information to a wide
            audience.
          </li>
        </ul>

        <p>
          If you believe you have the skills and passion to contribute to
          MarketPulse, feel free to send your resume and a cover letter to:{" "}
          <a
            href="mailto:careers@marketpulse.example.com"
            className="text-primary hover:underline"
          >
            careers@marketpulse.example.com
          </a>
          . We&apos;ll keep your profile on file for future opportunities.
        </p>
      </div>
    </div>
  );
}
