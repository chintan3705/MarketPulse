import type { Metadata } from 'next';
import { AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Disclaimer | MarketPulse',
  description:
    'Important disclaimer for MarketPulse. Information provided is for general purposes only and not financial advice. Understand investment risks and the nature of AI-generated content.',
  alternates: {
    canonical: '/disclaimer',
  },
  openGraph: {
    title: 'Disclaimer | MarketPulse',
    description:
      'Information provided is for general purposes only and not financial advice. Understand investment risks and the nature of AI-generated content.',
    url: '/disclaimer',
  },
};

const SectionTitle = ({ title, icon: Icon }: { title: string; icon?: React.ElementType }) => (
  <div className='flex items-center gap-2 mb-6'>
    {Icon && <Icon className='h-7 w-7 text-primary' />}
    <h1 className='font-headline text-2xl sm:text-3xl font-bold'>{title}</h1>
  </div>
);

export default function DisclaimerPage() {
  return (
    <div
      className='container py-8 md:py-12 animate-slide-in'
      style={{ animationDelay: '0.1s', animationFillMode: 'backwards' }}
    >
      <SectionTitle title='Disclaimer' icon={AlertTriangle} />
      <div className='prose prose-lg dark:prose-invert max-w-none space-y-4'>
        <p>
          The information provided by MarketPulse on our website, including articles, analysis,
          news, and any other content (collectively, "Content"), is for general informational and
          educational purposes only. All Content on the site is provided in good faith; however, we
          make no representation or warranty of any kind, express or implied, regarding the
          accuracy, adequacy, validity, reliability, availability, or completeness of any
          information on the site.
        </p>

        <h3 className='font-semibold text-xl mt-5'>Not Financial Advice</h3>
        <p>
          <strong>
            The Content on MarketPulse is not intended to be and does not constitute financial
            advice, investment advice, trading advice, or any other sort of advice, and you should
            not treat any of the website's content as such.
          </strong>{' '}
          MarketPulse does not recommend that any specific cryptocurrency, security, portfolio of
          securities, transaction, or investment strategy is suitable for any specific person. You
          should not take, or refrain from taking, any action based on any information contained on
          the Site. Always seek the advice of a qualified financial advisor or other qualified
          financial service provider with any questions you may have regarding your financial
          situation or investments. Never disregard professional financial advice or delay in
          seeking it because of something you have read on this website.
        </p>

        <h3 className='font-semibold text-xl mt-5'>Accuracy of Information</h3>
        <p>
          While we strive to provide accurate and up-to-date information, MarketPulse makes no
          warranties or representations as to the accuracy, completeness, or timeliness of the
          Content. The financial markets are volatile and can change rapidly; therefore, the
          information on this site may not always be current or accurate. We are under no obligation
          to update or correct any information provided on the Site.
        </p>

        <h3 className='font-semibold text-xl mt-5'>Investment Risks</h3>
        <p>
          Investing in stock markets, cryptocurrencies, and other financial instruments involves a
          significant risk of loss. Past performance is not indicative of future results. The value
          of investments can go down as well as up, and you may not get back the amount you
          invested. MarketPulse is not responsible for any financial losses incurred as a result of
          using or relying on the information provided on this site. You should carefully consider
          your investment objectives, level of experience, and risk appetite before making any
          investment decisions.
        </p>

        <h3 className='font-semibold text-xl mt-5'>AI-Generated Content</h3>
        <p>
          Some content on MarketPulse, including articles, summaries, and images, may be generated
          with the assistance of artificial intelligence (AI) technology. While we strive to ensure
          the quality and relevance of AI-generated content, it may contain errors, inaccuracies, or
          omissions. AI-generated content is provided for informational purposes and should not be
          solely relied upon for making financial decisions. All content, whether human-authored or
          AI-assisted, should be viewed critically and verified with other sources.
        </p>

        <h3 className='font-semibold text-xl mt-5'>External Links</h3>
        <p>
          Our website may contain links to external websites or content belonging to or originating
          from third parties. Such external links are not investigated, monitored, or checked for
          accuracy, adequacy, validity, reliability, availability, or completeness by us.
          MarketPulse does not warrant, endorse, guarantee, or assume responsibility for the
          accuracy or reliability of any information offered by third-party websites linked through
          the site or any Mebsite or feature linked in any banner or other advertising.
        </p>

        <h3 className='font-semibold text-xl mt-5'>Views Expressed</h3>
        <p>
          Any views or opinions expressed by authors, contributors, or users on MarketPulse are
          their own and do not necessarily reflect the views of MarketPulse as an organization or
          its editorial team. Content provided by third-party contributors is their own
          responsibility.
        </p>

        <h3 className='font-semibold text-xl mt-5'>Affiliate Disclosure</h3>
        <p>
          MarketPulse may, from time to time, participate in affiliate marketing programs. This
          means we may earn a commission if you click on or make purchases via affiliate links. This
          will be at no extra cost to you. Our editorial content is not influenced by advertisers or
          affiliate partnerships.
        </p>

        <h3 className='font-semibold text-xl mt-5'>No Endorsement</h3>
        <p>
          Reference to any specific commercial product, process, or service by trade name,
          trademark, manufacturer, or otherwise, does not constitute or imply its endorsement,
          recommendation, or favoring by MarketPulse.
        </p>

        <p>
          <strong>
            By using our website, you hereby consent to our disclaimer and agree to its terms.
          </strong>
        </p>
        <p>
          If you require any more information or have any questions about our site's disclaimer,
          please feel free to contact us by email at{' '}
          <a href='mailto:legal@marketpulse.example.com' className='text-primary hover:underline'>
            legal@marketpulse.example.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
