import { PageMeta } from "@/components/seo/PageMeta";

export default function SMSPrivacy() {
  return (
    <>
      <PageMeta
        title="SMS Privacy Policy"
        description="DOBEU SMS and text messaging privacy policy. Learn how we handle SMS communications and your opt-in/opt-out rights."
        keywords="sms privacy, text message policy, opt out sms, dobeu sms"
      />
      <div className="min-h-screen pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">SMS Privacy Policy</h1>
          <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground">
            <p className="text-sm text-muted-foreground">
              Last Updated: December 13, 2025
            </p>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                1. SMS Communications Overview
              </h2>
              <p>
                This SMS Privacy Policy explains how Dobeu Tech Solutions ("we,"
                "us," or "our") collects, uses, and protects your phone number
                and related information when you opt-in to receive SMS (Short
                Message Service) or text message communications from us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                2. Consent and Opt-In
              </h2>
              <p className="mb-4">
                By providing your phone number and checking the SMS consent
                checkbox on our contact form, newsletter signup, or account
                registration, you expressly consent to receive text messages
                from Dobeu Tech Solutions. These messages may include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Project updates and status notifications</li>
                <li>Appointment reminders and scheduling confirmations</li>
                <li>Service alerts and important account notifications</li>
                <li>
                  Promotional offers and marketing communications (if separately
                  opted-in)
                </li>
                <li>Customer service and support communications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                3. Message Frequency
              </h2>
              <p>
                Message frequency varies based on your account activity and the
                services you've requested. Transactional messages (project
                updates, confirmations) are sent as needed. Marketing messages
                are limited to a maximum of 4 messages per month unless
                otherwise specified.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                4. Standard Rates Apply
              </h2>
              <p>
                <strong>Message and data rates may apply.</strong> Standard
                messaging rates from your mobile carrier will apply to all SMS
                communications. We do not charge any additional fees for SMS
                messages, but your carrier's standard messaging rates will
                apply.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                5. Opting Out of SMS
              </h2>
              <p className="mb-4">
                You may opt-out of receiving SMS messages at any time by:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>
                  <strong>Replying STOP</strong> to any text message you receive
                  from us
                </li>
                <li>
                  <strong>Replying UNSUBSCRIBE</strong> to any text message you
                  receive from us
                </li>
                <li>
                  Contacting us at{" "}
                  <a
                    href="mailto:privacy@dobeu.cloud"
                    className="text-primary hover:underline"
                  >
                    privacy@dobeu.cloud
                  </a>{" "}
                  with subject "SMS Opt-Out"
                </li>
                <li>
                  Updating your communication preferences in your account
                  settings
                </li>
              </ul>
              <p>
                Upon receiving your opt-out request, we will confirm your
                removal and cease sending SMS messages within 24-48 hours. You
                may still receive transactional messages related to active
                projects if essential for service delivery.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                6. Help and Support
              </h2>
              <p>
                For help with our SMS program, reply <strong>HELP</strong> to
                any message, or contact us at:
                <br />
                Email:{" "}
                <a
                  href="mailto:support@dobeu.cloud"
                  className="text-primary hover:underline"
                >
                  support@dobeu.cloud
                </a>
                <br />
                Phone: (215) 370-5332
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                7. Data Collection and Use
              </h2>
              <p className="mb-4">
                When you opt-in to SMS communications, we collect and store:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Your mobile phone number</li>
                <li>Date and time of consent</li>
                <li>
                  The specific form or method through which consent was given
                </li>
                <li>Message delivery status and engagement data</li>
              </ul>
              <p>
                We use this information to deliver requested messages, improve
                our SMS program, and maintain compliance records. We do not sell
                your phone number to third parties for their marketing purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                8. Third-Party SMS Providers
              </h2>
              <p>
                We may use third-party SMS service providers to deliver messages
                on our behalf. These providers are contractually obligated to
                maintain the confidentiality and security of your information
                and may only use it to provide SMS services for us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                9. Carrier Liability
              </h2>
              <p>
                Carriers are not liable for delayed or undelivered messages.
                Message delivery is subject to effective transmission from your
                network operator and may be affected by network conditions,
                device compatibility, and other factors beyond our control.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                10. Privacy and Security
              </h2>
              <p>
                Your phone number and SMS-related data are protected in
                accordance with our general
                <a href="/privacy" className="text-primary hover:underline">
                  {" "}
                  Privacy Policy
                </a>
                . We implement reasonable technical and organizational measures
                to protect your information from unauthorized access,
                alteration, disclosure, or destruction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                11. Changes to This Policy
              </h2>
              <p>
                We may update this SMS Privacy Policy from time to time. We will
                notify you of any material changes by sending a text message to
                your registered phone number or by posting a notice on our
                website. Continued use of our SMS services after changes
                constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                12. Contact Information
              </h2>
              <p>
                For questions about this SMS Privacy Policy or our SMS
                practices, contact us at:
                <br />
                <br />
                <strong>Dobeu Tech Solutions</strong>
                <br />
                Email:{" "}
                <a
                  href="mailto:privacy@dobeu.cloud"
                  className="text-primary hover:underline"
                >
                  privacy@dobeu.cloud
                </a>
                <br />
                Phone: (215) 370-5332
                <br />
                <br />
                For immediate opt-out, reply <strong>STOP</strong> to any text
                message from us.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
