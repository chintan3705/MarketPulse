"use client";

import { ShieldCheck } from "lucide-react";
import React, { useState, useEffect } from "react";

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

export default function PrivacyPolicyClientContent() {
  const [lastUpdatedDate, setLastUpdatedDate] = useState<string>("");

  useEffect(() => {
    setLastUpdatedDate(
      new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    );
  }, []);
  const linkClasses =
    "text-primary hover:text-primary/80 hover:underline transition-colors duration-200 ease-in-out";

  return (
    <div
      className="container py-8 md:py-12 animate-slide-in"
      style={{ animationDelay: "0.1s", animationFillMode: "backwards" }}
    >
      <SectionTitle title="Privacy Policy" icon={ShieldCheck} />
      <div className="prose prose-sm dark:prose-invert max-w-none space-y-4">
        <p>
          <strong>Last Updated:</strong> {lastUpdatedDate || "Loading..."}
        </p>

        <p>
          MarketPulse (&quot;us&quot;, &quot;we&quot;, or &quot;our&quot;)
          operates the MarketPulse website (the &quot;Service&quot;). This page
          informs you of our policies regarding the collection, use, and
          disclosure of personal data when you use our Service and the choices
          you have associated with that data.
        </p>
        <p>
          We use your data to provide and improve the Service. By using the
          Service, you agree to the collection and use of information in
          accordance with this policy.
        </p>

        <h3 className="font-semibold text-lg mt-5">
          1. Information Collection and Use
        </h3>
        <p>
          We collect several different types of information for various purposes
          to provide and improve our Service to you.
        </p>

        <h4 className="font-semibold text-md mt-3">Types of Data Collected</h4>
        <p>
          <strong>Personal Data:</strong> While using our Service, we may ask
          you to provide us with certain personally identifiable information
          that can be used to contact or identify you (&quot;Personal
          Data&quot;). Currently, MarketPulse does not require user registration
          or directly collect personal data like names or email addresses for
          general browsing. If we introduce features like newsletters or user
          comments in the future, this policy will be updated to reflect the
          data collected (e.g., email address, name).
        </p>
        <p>
          <strong>Usage Data:</strong> We may also collect information on how
          the Service is accessed and used (&quot;Usage Data&quot;). This Usage
          Data may include information such as your computer&apos;s Internet
          Protocol address (e.g., IP address), browser type, browser version,
          the pages of our Service that you visit, the time and date of your
          visit, the time spent on those pages, unique device identifiers, and
          other diagnostic data.
        </p>
        <p>
          <strong>Tracking &amp; Cookies Data:</strong> We use cookies and
          similar tracking technologies to track the activity on our Service and
          hold certain information. Cookies are files with a small amount of
          data which may include an anonymous unique identifier. You can
          instruct your browser to refuse all cookies or to indicate when a
          cookie is being sent. However, if you do not accept cookies, you may
          not be able to use some portions of our Service.
        </p>

        <h3 className="font-semibold text-lg mt-5">2. Use of Data</h3>
        <p>MarketPulse uses the collected data for various purposes:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>To provide and maintain the Service;</li>
          <li>To notify you about changes to our Service;</li>
          <li>
            To allow you to participate in interactive features of our Service
            when you choose to do so (if applicable in the future);
          </li>
          <li>To provide customer care and support (if applicable);</li>
          <li>
            To provide analysis or valuable information so that we can improve
            the Service;
          </li>
          <li>To monitor the usage of the Service;</li>
          <li>To detect, prevent and address technical issues.</li>
        </ul>

        <h3 className="font-semibold text-lg mt-5">3. Transfer of Data</h3>
        <p>
          Your information, including Personal Data, may be transferred to — and
          maintained on — computers located outside of your state, province,
          country, or other governmental jurisdiction where the data protection
          laws may differ from those from your jurisdiction.
        </p>
        <p>
          If you are located outside India and choose to provide information to
          us, please note that we transfer the data, including Personal Data, to
          India and process it there.
        </p>
        <p>
          Your consent to this Privacy Policy followed by your submission of
          such information represents your agreement to that transfer.
        </p>
        <p>
          MarketPulse will take all steps reasonably necessary to ensure that
          your data is treated securely and in accordance with this Privacy
          Policy and no transfer of your Personal Data will take place to an
          organization or a country unless there are adequate controls in place
          including the security of your data and other personal information.
        </p>

        <h3 className="font-semibold text-lg mt-5">4. Disclosure of Data</h3>
        <h4 className="font-semibold text-md mt-3">Legal Requirements</h4>
        <p>
          MarketPulse may disclose your Personal Data in the good faith belief
          that such action is necessary to:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>To comply with a legal obligation;</li>
          <li>To protect and defend the rights or property of MarketPulse;</li>
          <li>
            To prevent or investigate possible wrongdoing in connection with the
            Service;
          </li>
          <li>
            To protect the personal safety of users of the Service or the
            public;
          </li>
          <li>To protect against legal liability.</li>
        </ul>

        <h3 className="font-semibold text-lg mt-5">5. Security of Data</h3>
        <p>
          The security of your data is important to us, but remember that no
          method of transmission over the Internet, or method of electronic
          storage is 100% secure. While we strive to use commercially acceptable
          means to protect your Personal Data, we cannot guarantee its absolute
          security.
        </p>

        <h3 className="font-semibold text-lg mt-5">6. Service Providers</h3>
        <p>
          We may employ third-party companies and individuals to facilitate our
          Service (&quot;Service Providers&quot;), to provide the Service on our
          behalf, to perform Service-related services or to assist us in
          analyzing how our Service is used. These third parties have access to
          your Personal Data only to perform these tasks on our behalf and are
          obligated not to disclose or use it for any other purpose.
        </p>

        <h3 className="font-semibold text-lg mt-5">7. Links to Other Sites</h3>
        <p>
          Our Service may contain links to other sites that are not operated by
          us. If you click on a third-party link, you will be directed to that
          third party&apos;s site. We strongly advise you to review the Privacy
          Policy of every site you visit. We have no control over and assume no
          responsibility for the content, privacy policies, or practices of any
          third-party sites or services.
        </p>

        <h3 className="font-semibold text-lg mt-5">
          8. Children&apos;s Privacy
        </h3>
        <p>
          Our Service does not address anyone under the age of 13
          (&quot;Children&quot;). We do not knowingly collect personally
          identifiable information from anyone under the age of 13. If you are a
          parent or guardian and you are aware that your Children has provided
          us with Personal Data, please contact us. If we become aware that we
          have collected Personal Data from children without verification of
          parental consent, we take steps to remove that information from our
          servers.
        </p>

        <h3 className="font-semibold text-lg mt-5">
          9. Changes to This Privacy Policy
        </h3>
        <p>
          We may update our Privacy Policy from time to time. We will notify you
          of any changes by posting the new Privacy Policy on this page. We will
          let you know via email and/or a prominent notice on our Service, prior
          to the change becoming effective and update the &quot;last
          updated&quot; date at the top of this Privacy Policy.
        </p>
        <p>
          You are advised to review this Privacy Policy periodically for any
          changes. Changes to this Privacy Policy are effective when they are
          posted on this page.
        </p>

        <h3 className="font-semibold text-lg mt-5">10. Contact Us</h3>
        <p>
          If you have any questions about this Privacy Policy, please contact us
          by email:{" "}
          <a
            href="mailto:privacy@marketpulse.example.com"
            className={linkClasses}
          >
            privacy@marketpulse.example.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
