import type { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";
import type React from "react";
import { SectionTitle } from "@/components/common/SectionTitle";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:9002";

export async function generateMetadata(
  _props: unknown,
  _parent: ResolvingMetadata,
): Promise<Metadata> {
  const canonicalUrl = `${SITE_URL}/contact`;

  return {
    title: "Contact MarketPulse",
    description:
      "Get in touch with MarketPulse for inquiries, feedback, or news tips. Find our contact email addresses for general, editorial, and advertising queries.",
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: "Contact MarketPulse",
      description:
        "Get in touch with MarketPulse for inquiries, feedback, or news tips.",
      url: canonicalUrl,
      type: "website",
      images: [
        {
          url: `${SITE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: "Contact MarketPulse",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Contact MarketPulse",
      description:
        "Get in touch with MarketPulse for inquiries, feedback, or news tips.",
      images: [`${SITE_URL}/twitter-image.png`],
    },
  };
}

const ContactPage: React.FC = () => {
  const linkClasses =
    "text-primary hover:text-primary/80 hover:underline transition-colors duration-200 ease-in-out";
  return (
    <div
      className="container py-8 md:py-12"
    >
      <SectionTitle
        title="Contact Us"
        icon={Mail}
        titleClassName="text-2xl sm:text-3xl"
      />
      <div className="prose prose-lg dark:prose-invert max-w-none space-y-4">
        <p>
          We&apos;d love to hear from you! Whether you have a question,
          feedback, or a news tip, please feel free to reach out to us.
        </p>

        <h3 className="font-semibold text-xl">General Inquiries</h3>
        <p>
          For general questions or information, please email us at:{" "}
          <a href="mailto:info@marketpulse.example.com" className={linkClasses}>
            info@marketpulse.example.com
          </a>
        </p>

        <h3 className="font-semibold text-xl">Editorial Team</h3>
        <p>
          If you have a story idea or want to reach our editorial team, contact:{" "}
          <a
            href="mailto:editor@marketpulse.example.com"
            className={linkClasses}
          >
            editor@marketpulse.example.com
          </a>
        </p>

        <h3 className="font-semibold text-xl">Advertising</h3>
        <p>
          For advertising opportunities, please visit our{" "}
          <Link href="/advertise" className={linkClasses}>
            Advertise page
          </Link>{" "}
          or email:{" "}
          <a href="mailto:ads@marketpulse.example.com" className={linkClasses}>
            ads@marketpulse.example.com
          </a>
        </p>

        <p>
          Our team will do their best to respond to your inquiry as soon as
          possible.
        </p>
      </div>
    </div>
  );
};

export default ContactPage;
