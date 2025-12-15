import { PageMeta } from "@/components/seo/PageMeta";

export default function Terms() {
  return (
    <>
      <PageMeta
        title="Terms of Service"
        description="DOBEU Terms of Service - Read our terms and conditions for using our web development and consulting services. Last updated December 2, 2025."
        keywords="terms of service, terms and conditions, service agreement, legal terms"
        canonical="https://dobeu.net/terms"
      />
      <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground">
          <p className="text-sm text-muted-foreground">Last Updated: December 2, 2025</p>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Dobeu Tech Solutions ("DOBEU") services, you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">2. Services Description</h2>
            <p>
              DOBEU provides web development, software development, consulting, and strategic 
              planning services. Specific deliverables and timelines are outlined in individual 
              project agreements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">3. User Accounts</h2>
            <p>
              When you create an account with us, you must:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Be responsible for all activities under your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">4. Payment Terms</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Services are billed according to the pricing plan selected</li>
              <li>Payment is due as specified in your agreement</li>
              <li>Late payments may result in service suspension</li>
              <li>Refunds are handled on a case-by-case basis</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">5. Intellectual Property</h2>
            <p>
              Upon full payment, you receive ownership of deliverables as specified in your 
              project agreement. DOBEU retains the right to showcase work in our portfolio 
              unless otherwise agreed.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">6. File Storage and Access</h2>
            <p>
              Project files are stored and accessible for 3 years from project completion. 
              After this period, files may be archived or deleted. You are responsible for 
              downloading and backing up files you wish to retain.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">7. Marketing Communications & Consent</h2>
            <p className="mb-4">
              <strong>Email Marketing Opt-In:</strong> By checking the "I consent to receive marketing emails" 
              checkbox during signup or subscription, you expressly opt-in to receive promotional emails, 
              newsletters, special offers, and targeted marketing communications from DOBEU. These communications 
              may be personalized based on your usage patterns, preferences, and data we collect about you.
            </p>
            <p className="mb-4">
              <strong>SMS/Text Message Opt-In:</strong> By providing your phone number and checking the SMS opt-in 
              checkbox, you expressly consent to receive SMS and text messages from DOBEU. This includes:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Project updates and status notifications</li>
              <li>Appointment and deadline reminders</li>
              <li>Promotional offers and marketing messages</li>
              <li>Account-related alerts</li>
            </ul>
            <p className="mb-4">
              Message frequency varies. Message and data rates may apply. You can opt-out at any time by 
              replying STOP to any message or updating your preferences in your account settings.
            </p>
            <p>
              <strong>Withdrawal of Consent:</strong> You may withdraw your consent to marketing communications 
              at any time by clicking the unsubscribe link in emails, replying STOP to SMS messages, or 
              contacting us at privacy@dobeu.cloud.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">8. Data Usage & Third-Party Sharing</h2>
            <p className="mb-4">
              <strong>Consent to Data Use:</strong> By using our services and accepting these Terms, you 
              acknowledge and consent that DOBEU may use your data (including but not limited to usage 
              patterns, preferences, and behavioral data) to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Personalize and improve your experience on our website</li>
              <li>Tailor content, features, and recommendations to your interests</li>
              <li>Develop and improve our services and offerings</li>
              <li>Train machine learning models and algorithms to enhance our platform</li>
            </ul>
            <p className="mb-4">
              <strong>Consent to Data Sales:</strong> You acknowledge and consent that DOBEU reserves the 
              right to sell, license, or share your data (in anonymized, aggregated, or identifiable form) 
              to third parties for marketing, advertising, research, and commercial purposes. This may include 
              sharing your information with advertising networks, data brokers, and business partners.
            </p>
            <p>
              California residents have additional rights under the CCPA, including the right to opt-out 
              of data sales. See our Privacy Policy for details on exercising these rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">9. Service Modifications</h2>
            <p>
              We reserve the right to modify or discontinue services with reasonable notice. 
              We are not liable for any modifications, suspensions, or discontinuations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">10. Limitation of Liability</h2>
            <p>
              DOBEU shall not be liable for any indirect, incidental, special, consequential, 
              or punitive damages resulting from your use of our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">11. Termination</h2>
            <p>
              We may terminate or suspend access to our services immediately, without prior 
              notice, for any reason, including breach of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">12. Governing Law</h2>
            <p>
              These Terms are governed by the laws of the State of California, USA, without 
              regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">13. Contact Information</h2>
            <p>
              For questions about these Terms, contact us at:
              <br />
              Email: legal@dobeu.cloud
            </p>
          </section>
        </div>
      </div>
    </div>
    </>
  );
}
