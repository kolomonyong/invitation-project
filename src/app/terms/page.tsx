// src/app/terms/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service — Digital Invitations',
  description: 'Read our Terms of Service to understand your rights and responsibilities when using Digital Invitations.',
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-10">
    <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--foreground)' }}>{title}</h2>
    <div className="text-base leading-relaxed space-y-3" style={{ color: 'var(--secondary)' }}>
      {children}
    </div>
  </section>
);

export default function TermsPage() {
  const lastUpdated = 'August 2025';

  return (
    <div
      className="min-h-screen"
      style={{ fontFamily: "var(--font-lexend-deca), 'Inter', sans-serif", background: 'white' }}
    >
      {/* Nav */}
      <nav className="border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-3xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-base" style={{ color: 'var(--foreground)' }}>
            ← Digital Invitations
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-5 py-12">
        <header className="mb-10">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>Terms of Service</h1>
          <p className="text-sm" style={{ color: 'var(--secondary)' }}>Last updated: {lastUpdated}</p>
        </header>

        <Section title="1. Acceptance of Terms">
          <p>
            By accessing or using Digital Invitations (&ldquo;Service&rdquo;), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the Service.
          </p>
        </Section>

        <Section title="2. Use of the Service">
          <p>You may use our Service to create, customize, and share digital invitations for personal or commercial events. You agree not to:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Use the Service for any unlawful purpose</li>
            <li>Share content that is offensive, defamatory, or infringes third-party rights</li>
            <li>Attempt to reverse-engineer or exploit the platform</li>
            <li>Create fake events or spam guests</li>
          </ul>
        </Section>

        <Section title="3. Accounts & Quota">
          <p>
            Each account receives <strong>1 free invitation slot</strong>. Additional slots may be purchased for Rp10.000 each. Purchased quota is non-refundable once a payment is confirmed and quota has been credited to your account.
          </p>
          <p>
            You are responsible for maintaining the security of your account credentials. Notify us immediately of any unauthorized access.
          </p>
        </Section>

        <Section title="4. Payments">
          <p>
            Payments are processed through Pakasir, a third-party payment gateway. By making a purchase, you also agree to Pakasir&apos;s terms and policies. We do not store your payment card details.
          </p>
          <p>
            All prices are in Indonesian Rupiah (IDR). Payment is required before quota is credited. In the event of a failed payment, no quota will be added.
          </p>
        </Section>

        <Section title="5. Content Ownership">
          <p>
            You retain full ownership of the content (names, photos, text) you enter into your invitations. By using the Service, you grant us a limited, non-exclusive license to display that content as part of the invitation rendering.
          </p>
          <p>
            Invitation template designs are the intellectual property of Digital Invitations and may not be copied or redistributed.
          </p>
        </Section>

        <Section title="6. Data & Privacy">
          <p>
            We collect and process personal data as described in our <Link href="/privacy" className="underline" style={{ color: 'var(--primary)' }}>Privacy Policy</Link>. RSVP responses submitted by your guests are stored and accessible to you through your dashboard.
          </p>
        </Section>

        <Section title="7. Service Availability">
          <p>
            We strive to maintain high availability but cannot guarantee uninterrupted service. We are not liable for any losses arising from service downtime or data loss beyond our reasonable control.
          </p>
        </Section>

        <Section title="8. Termination">
          <p>
            We reserve the right to suspend or terminate accounts that violate these Terms. You may delete your account at any time. Upon deletion, your invitation data will be permanently removed.
          </p>
        </Section>

        <Section title="9. Changes to Terms">
          <p>
            We may revise these Terms at any time. Continued use of the Service after changes constitutes your acceptance of the updated Terms.
          </p>
        </Section>

        <Section title="10. Contact">
          <p>
            If you have questions about these Terms, please contact us at{' '}
            <a href="mailto:support@invitations.app" className="underline" style={{ color: 'var(--primary)' }}>
              support@invitations.app
            </a>.
          </p>
        </Section>
      </main>

      <footer className="border-t py-8" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-3xl mx-auto px-5 flex gap-4 text-sm" style={{ color: 'var(--secondary)' }}>
          <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
          <Link href="/pricing" className="hover:underline">Pricing</Link>
        </div>
      </footer>
    </div>
  );
}
