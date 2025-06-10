
"use client"; // Required for useEffect and useState

import type { Metadata } from "next"; // For static metadata
import { FileText } from "lucide-react";
import React, { useState, useEffect } from "react";

// Static metadata:
// const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:9002";
// export const metadata: Metadata = {
//   title: "Terms of Service | MarketPulse",
//   // ... other static metadata
// };

interface SectionTitleProps {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title, icon: Icon }) => (
  <div className="flex items-center gap-2 mb-6">
    {Icon && <Icon className="h-7 w-7 text-primary" />}
    <h1 className="font-headline text-2xl sm:text-3xl font-bold">{title}</h1>
  </div>
);

export default function TermsOfServicePage() {
  const [lastUpdatedDate, setLastUpdatedDate] = useState<string>("");

  useEffect(() => {
    // This effect runs only on the client after hydration
    setLastUpdatedDate(
      new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    );
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <div
      className="container py-8 md:py-12 animate-slide-in"
      style={{ animationDelay: "0.1s", animationFillMode: "backwards" }}
    >
      <SectionTitle title="Terms of Service" icon={FileText} />
      <div className="prose prose-sm dark:prose-invert max-w-none space-y-4">
        <p>
          <strong>Last Updated:</strong> {lastUpdatedDate || "Loading..."}
        </p>

        <p>
          Please read these Terms of Service (&quot;Terms&quot;, &quot;Terms of
          Service&quot;) carefully before using the MarketPulse website (the
          &quot;Service&quot;) operated by MarketPulse (&quot;us&quot;,
          &quot;we&quot;, or &quot;our&quot;).
        </p>
        <p>
          Your access to and use of the Service is conditioned on your
          acceptance of and compliance with these Terms. These Terms apply to
          all visitors, users, and others who access or use the Service. By
          accessing or using the Service you agree to be bound by these Terms.
          If you disagree with any part of the terms then you may not access the
          Service.
        </p>

        <h3 className="font-semibold text-lg mt-5">
          1. Intellectual Property Rights
        </h3>
        <p>
          Unless otherwise indicated, the Service is our proprietary property
          and all source code, databases, functionality, software, website
          designs, audio, video, text, photographs, and graphics on the Site
          (collectively, the &quot;Content&quot;) and the trademarks, service
          marks, and logos contained therein (the &quot;Marks&quot;) are owned
          or controlled by us or licensed to us, and are protected by copyright
          and trademark laws and various other intellectual property rights and
          unfair competition laws.
        </p>
        <p>
          The Content and the Marks are provided on the Site &quot;AS IS&quot;
          for your information and personal use only. Except as expressly
          provided in these Terms of Service, no part of the Site and no Content
          or Marks may be copied, reproduced, aggregated, republished, uploaded,
          posted, publicly displayed, encoded, translated, transmitted,
          distributed, sold, licensed, or otherwise exploited for any commercial
          purpose whatsoever, without our express prior written permission.
        </p>

        <h3 className="font-semibold text-lg mt-5">2. User Representations</h3>
        <p>
          By using the Site, you represent and warrant that: (1) you have the
          legal capacity and you agree to comply with these Terms of Service;
          (2) you are not a minor in the jurisdiction in which you reside; (3)
          you will not access the Site through automated or non-human means,
          whether through a bot, script, or otherwise; (4) you will not use the
          Site for any illegal or unauthorized purpose; and (5) your use of the
          Site will not violate any applicable law or regulation.
        </p>

        <h3 className="font-semibold text-lg mt-5">3. Prohibited Activities</h3>
        <p>
          You may not access or use the Site for any purpose other than that for
          which we make the Site available. The Site may not be used in
          connection with any commercial endeavors except those that are
          specifically endorsed or approved by us.
        </p>
        <p>As a user of the Site, you agree not to:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            Systematically retrieve data or other content from the Site to
            create or compile, directly or indirectly, a collection,
            compilation, database, or directory without written permission from
            us.
          </li>
          <li>
            Make any unauthorized use of the Site, including collecting
            usernames and/or email addresses of users by electronic or other
            means for the purpose of sending unsolicited email, or creating user
            accounts by automated means or under false pretenses.
          </li>
          <li>
            Circumvent, disable, or otherwise interfere with security-related
            features of the Site.
          </li>
          <li>Engage in unauthorized framing of or linking to the Site.</li>
          <li>
            Trick, defraud, or mislead us and other users, especially in any
            attempt to learn sensitive account information such as user
            passwords.
          </li>
          <li>
            Interfere with, disrupt, or create an undue burden on the Site or
            the networks or services connected to the Site.
          </li>
          <li>
            Use any information obtained from the Site in order to harass,
            abuse, or harm another person.
          </li>
          <li>
            Use the Site as part of any effort to compete with us or otherwise
            use the Site and/or the Content for any revenue-generating endeavor
            or commercial enterprise.
          </li>
          <li>
            Decipher, decompile, disassemble, or reverse engineer any of the
            software comprising or in any way making up a part of the Site.
          </li>
          <li>
            Attempt to bypass any measures of the Site designed to prevent or
            restrict access to the Site, or any portion of the Site.
          </li>
          <li>
            Harass, annoy, intimidate, or threaten any of our employees or
            agents engaged in providing any portion of the Site to you.
          </li>
          <li>
            Delete the copyright or other proprietary rights notice from any
            Content.
          </li>
          <li>
            Upload or transmit (or attempt to upload or to transmit) viruses,
            Trojan horses, or other material, including excessive use of capital
            letters and spamming (continuous posting of repetitive text), that
            interferes with any party&apos;s uninterrupted use and enjoyment of
            the Site or modifies, impairs, disrupts, alters, or interferes with
            the use, features, functions, operation, or maintenance of the Site.
          </li>
          <li>
            Disparage, tarnish, or otherwise harm, in our opinion, us and/or the
            Site.
          </li>
          <li>
            Use the Site in a manner inconsistent with any applicable laws or
            regulations.
          </li>
        </ul>

        <h3 className="font-semibold text-lg mt-5">
          4. Third-Party Websites and Content
        </h3>
        <p>
          The Site may contain (or you may be sent via the Site) links to other
          websites (&quot;Third-Party Websites&quot;) as well as articles,
          photographs, text, graphics, pictures, designs, music, sound, video,
          information, applications, software, and other content or items
          belonging to or originating from third parties (&quot;Third-Party
          Content&quot;). Such Third-Party Websites and Third-Party Content are
          not investigated, monitored, or checked for accuracy, appropriateness,
          or completeness by us, and we are not responsible for any Third-Party
          Websites accessed through the Site or any Third-Party Content posted
          on, available through, or installed from the Site.
        </p>

        <h3 className="font-semibold text-lg mt-5">5. Site Management</h3>
        <p>
          We reserve the right, but not the obligation, to: (1) monitor the Site
          for violations of these Terms of Service; (2) take appropriate legal
          action against anyone who, in our sole discretion, violates the law or
          these Terms of Service; (3) in our sole discretion and without
          limitation, refuse, restrict access to, limit the availability of, or
          disable (to the extent technologically feasible) any of your
          Contributions or any portion thereof; (4) in our sole discretion and
          without limitation, notice, or liability, to remove from the Site or
          otherwise disable all files and content that are excessive in size or
          are in any way burdensome to our systems; and (5) otherwise manage the
          Site in a manner designed to protect our rights and property and to
          facilitate the proper functioning of the Site.
        </p>

        <h3 className="font-semibold text-lg mt-5">6. Term and Termination</h3>
        <p>
          These Terms of Service shall remain in full force and effect while you
          use the Site. WITHOUT LIMITING ANY OTHER PROVISION OF THESE TERMS OF
          SERVICE, WE RESERVE THE RIGHT TO, IN OUR SOLE DISCRETION AND WITHOUT
          NOTICE OR LIABILITY, DENY ACCESS TO AND USE OF THE SITE (INCLUDING
          BLOCKING CERTAIN IP ADDRESSES), TO ANY PERSON FOR ANY REASON OR FOR NO
          REASON, INCLUDING WITHOUT LIMITATION FOR BREACH OF ANY REPRESENTATION,
          WARRANTY, OR COVENANT CONTAINED IN THESE TERMS OF SERVICE OR OF ANY
          APPLICABLE LAW OR REGULATION. WE MAY TERMINATE YOUR USE OR
          PARTICIPATION IN THE SITE OR DELETE ANY CONTENT OR INFORMATION THAT
          YOU POSTED AT ANY TIME, WITHOUT WARNING, IN OUR SOLE DISCRETION.
        </p>

        <h3 className="font-semibold text-lg mt-5">
          7. Modifications and Interruptions
        </h3>
        <p>
          We reserve the right to change, modify, or remove the contents of the
          Site at any time or for any reason at our sole discretion without
          notice. However, we have no obligation to update any information on
          our Site. We also reserve the right to modify or discontinue all or
          part of the Site without notice at any time.
        </p>
        <p>
          We will not be liable to you or any third party for any modification,
          price change, suspension, or discontinuance of the Site.
        </p>
        <p>
          We cannot guarantee the Site will be available at all times. We may
          experience hardware, software, or other problems or need to perform
          maintenance related to the Site, resulting in interruptions, delays,
          or errors. You agree that we have no liability whatsoever for any
          loss, damage, or inconvenience caused by your inability to access or
          use the Site during any downtime or discontinuance of the Site.
        </p>

        <h3 className="font-semibold text-lg mt-5">8. Governing Law</h3>
        <p>
          These Terms of Service and your use of the Site are governed by and
          construed in accordance with the laws of India applicable to
          agreements made and to be entirely performed within India, without
          regard to its conflict of law principles.
        </p>

        <h3 className="font-semibold text-lg mt-5">9. Disclaimer</h3>
        <p>
          THE SITE IS PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE
          THAT YOUR USE OF THE SITE AND OUR SERVICES WILL BE AT YOUR SOLE RISK.
          TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES,
          EXPRESS OR IMPLIED, IN CONNECTION WITH THE SITE AND YOUR USE THEREOF,
          INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF
          MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
          NON-INFRINGEMENT. WE MAKE NO WARRANTIES OR REPRESENTATIONS ABOUT THE
          ACCURACY OR COMPLETENESS OF THE SITE’S CONTENT OR THE CONTENT OF ANY
          WEBSITES LINKED TO THE SITE AND WE WILL ASSUME NO LIABILITY OR
          RESPONSIBILITY FOR ANY (1) ERRORS, MISTAKES, OR INACCURACIES OF
          CONTENT AND MATERIALS, (2) PERSONAL INJURY OR PROPERTY DAMAGE, OF ANY
          NATURE WHATSOEVER, RESULTING FROM YOUR ACCESS TO AND USE OF THE SITE,
          (3) ANY UNAUTHORIZED ACCESS TO OR USE OF OUR SECURE SERVERS AND/OR ANY
          AND ALL PERSONAL INFORMATION AND/OR FINANCIAL INFORMATION STORED
          THEREIN, (4) ANY INTERRUPTION OR CESSATION OF TRANSMISSION TO OR FROM
          THE SITE, (5) ANY BUGS, VIRUSES, TROJAN HORSES, OR THE LIKE WHICH MAY
          BE TRANSMITTED TO OR THROUGH THE SITE BY ANY THIRD PARTY, AND/OR (6)
          ANY ERRORS OR OMISSIONS IN ANY CONTENT AND MATERIALS OR FOR ANY LOSS
          OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF ANY CONTENT
          POSTED, TRANSMITTED, OR OTHERWISE MADE AVAILABLE VIA THE SITE. WE DO
          NOT WARRANT, ENDORSE, GUARANTEE, OR ASSUME RESPONSIBILITY FOR ANY
          PRODUCT OR SERVICE ADVERTISED OR OFFERED BY A THIRD PARTY THROUGH THE
          SITE, ANY HYPERLINKED WEBSITE, OR ANY WEBSITE OR MOBILE APPLICATION
          FEATURED IN ANY BANNER OR OTHER ADVERTISING, AND WE WILL NOT BE A
          PARTY TO OR IN ANY WAY BE RESPONSIBLE FOR MONITORING ANY TRANSACTION
          BETWEEN YOU AND ANY THIRD-PARTY PROVIDERS OF PRODUCTS OR SERVICES.
        </p>
        <p>
          Please also review our dedicated Disclaimer page for further details.
        </p>

        <h3 className="font-semibold text-lg mt-5">
          10. Limitation of Liability
        </h3>
        <p>
          IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE
          TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL,
          EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOST
          PROFIT, LOST REVENUE, LOSS OF DATA, OR OTHER DAMAGES ARISING FROM YOUR
          USE OF THE SITE, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF
          SUCH DAMAGES.
        </p>

        <h3 className="font-semibold text-lg mt-5">11. Indemnification</h3>
        <p>
          You agree to defend, indemnify, and hold us harmless, including our
          subsidiaries, affiliates, and all of our respective officers, agents,
          partners, and employees, from and against any loss, damage, liability,
          claim, or demand, including reasonable attorneys’ fees and expenses,
          made by any third party due to or arising out of: (1) use of the Site;
          (2) breach of these Terms of Service; (3) any breach of your
          representations and warranties set forth in these Terms of Service;
          (4) your violation of the rights of a third party, including but not
          limited to intellectual property rights; or (5) any overt harmful act
          toward any other user of the Site with whom you connected via the
          Site.
        </p>

        <h3 className="font-semibold text-lg mt-5">
          12. Changes to These Terms of Service
        </h3>
        <p>
          We may update our Terms of Service from time to time. We will notify
          you of any changes by posting the new Terms of Service on this page.
          You are advised to review these Terms of Service periodically for any
          changes.
        </p>

        <h3 className="font-semibold text-lg mt-5">13. Contact Us</h3>
        <p>
          If you have any questions about these Terms, please contact us by
          email:{" "}
          <a
            href="mailto:legal@marketpulse.example.com"
            className="text-primary hover:underline"
          >
            legal@marketpulse.example.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}

// Static metadata defined at the top-level
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:9002";
export const metadata: Metadata = {
  title: "Terms of Service | MarketPulse",
  description:
    "Read the MarketPulse Terms of Service. Understand the rules and guidelines for using our financial news and analysis platform.",
  alternates: {
    canonical: `${SITE_URL}/terms-of-service`,
  },
  openGraph: {
    title: "Terms of Service | MarketPulse",
    description:
      "Understand the rules and guidelines for using the MarketPulse platform.",
    url: `${SITE_URL}/terms-of-service`,
    type: "website",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "MarketPulse Terms of Service",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service | MarketPulse",
    description:
      "Understand the rules and guidelines for using the MarketPulse platform.",
    images: [`${SITE_URL}/twitter-image.png`],
  },
};
