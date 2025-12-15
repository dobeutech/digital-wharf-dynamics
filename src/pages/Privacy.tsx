import { PageMeta } from "@/components/seo/PageMeta";

export default function Privacy() {
  return (
    <>
      <PageMeta
        title="Privacy Policy"
        description="DOBEU Privacy Policy - Learn how we collect, use, and protect your personal information. Last updated December 2, 2025."
        keywords="privacy policy, data protection, GDPR, CCPA, personal information"
        canonical="https://dobeu.net/privacy"
      />
      <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground">
          <p className="text-sm text-muted-foreground">Last Updated: December 2, 2025</p>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Information We Collect</h2>
            <p>
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Name, email address, phone number, and other contact information</li>
              <li>Payment and billing information</li>
              <li>Project details and communications</li>
              <li>Usage data, browsing behavior, and analytics</li>
              <li>Device information, IP addresses, and location data</li>
              <li>Preferences and interests inferred from your activity</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send targeted marketing communications and promotional offers (with your opt-in consent)</li>
              <li>Personalize your experience and tailor content to your interests</li>
              <li>Monitor and analyze trends, usage patterns, and user behavior</li>
              <li>Train and improve our algorithms and machine learning models</li>
              <li>Develop new products, services, and features</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">3. Marketing Communications Opt-In</h2>
            <p className="mb-4">
              <strong>Email Marketing:</strong> When you subscribe to our newsletter or check the marketing 
              consent checkbox during registration, you expressly opt-in to receive:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Promotional emails and special offers</li>
              <li>Newsletter updates ("The Digital Wharf")</li>
              <li>Targeted marketing based on your preferences and behavior</li>
              <li>Partner offers and third-party promotions</li>
            </ul>
            <p className="mb-4">
              <strong>SMS/Text Marketing:</strong> By providing your phone number and checking the SMS opt-in 
              checkbox, you expressly consent to receive text messages including promotional content, 
              reminders, and marketing offers. Standard message and data rates apply. Reply STOP to opt-out.
            </p>
            <p>
              You can withdraw consent at any time via unsubscribe links, account settings, or by contacting 
              privacy@dobeu.cloud.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">4. Data Sales & Third-Party Sharing</h2>
            <p className="mb-4">
              <strong>We May Sell Your Data:</strong> Dobeu Tech Solutions reserves the right to sell, license, 
              rent, or share your personal information with third parties for monetary or other valuable 
              consideration. This includes:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Advertising networks and platforms for targeted advertising</li>
              <li>Data brokers and aggregators for marketing purposes</li>
              <li>Business partners and affiliates for commercial use</li>
              <li>Research organizations and analytics companies</li>
              <li>Any third party for marketing, advertising, or commercial purposes</li>
            </ul>
            <p className="mb-4">
              Data shared may include both anonymized/aggregated data and personally identifiable information, 
              depending on the arrangement with the third party.
            </p>
            <p className="mb-4">
              <strong>Service Providers:</strong> We also share your information with:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Analytics:</strong> PostHog and Google Analytics for user behavior analysis</li>
              <li><strong>Marketing:</strong> Google Ads and advertising partners for targeted campaigns</li>
              <li><strong>Customer Support:</strong> Intercom for communication and support</li>
              <li><strong>Payment Processing:</strong> Stripe for secure transactions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">5. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies, web beacons, pixel tags, and similar tracking technologies to collect 
              information about your browsing behavior, preferences, and device. This data is used for 
              analytics, personalization, and targeted advertising. You can control cookie preferences 
              through your browser settings, but disabling cookies may limit functionality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">6. Your Rights (California Residents - CCPA)</h2>
            <p className="mb-4">
              Under the California Consumer Privacy Act (CCPA), California residents have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Right to Know:</strong> Request disclosure of personal information collected about you</li>
              <li><strong>Right to Delete:</strong> Request deletion of your personal information</li>
              <li><strong>Right to Opt-Out:</strong> Opt-out of the sale of your personal information</li>
              <li><strong>Right to Non-Discrimination:</strong> Not be discriminated against for exercising your rights</li>
            </ul>
            <p className="mb-4">
              <strong>To Opt-Out of Data Sales:</strong> Submit a request to privacy@dobeu.cloud with the 
              subject line "Do Not Sell My Personal Information" or contact us using the information below.
            </p>
            <p>
              We will respond to verified consumer requests within 45 days as required by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">7. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to fulfill the purposes outlined 
              in this policy, unless a longer retention period is required by law. Project files are retained 
              for 3 years after project completion.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">8. Data Security</h2>
            <p>
              We implement reasonable security measures to protect your information, including encryption, 
              access controls, and secure infrastructure. However, no method of transmission over the 
              internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">9. Children's Privacy</h2>
            <p>
              Our services are not directed to individuals under 18. We do not knowingly collect 
              personal information from children. If we become aware that a child has provided us 
              with personal information, we will delete such information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">10. Changes to Privacy Policy</h2>
            <p>
              We may update this policy periodically. We will notify you of material changes by posting 
              the new policy on this page with an updated date. Continued use of our services after 
              changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">11. Contact Us</h2>
            <p>
              For questions about this Privacy Policy or to exercise your rights, contact us at:
              <br />
              Email: privacy@dobeu.cloud
              <br />
              <br />
              For data sale opt-out requests, email: privacy@dobeu.cloud with subject "Do Not Sell My Personal Information"
            </p>
          </section>
        </div>
      </div>
    </div>
    </>
  );
}
