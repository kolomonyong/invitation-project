// src/app/privacy/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy — Digital Invitations',
  description: 'Learn how Digital Invitations collects, uses, and protects your personal information.',
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-10">
    <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--foreground)' }}>{title}</h2>
    <div className="text-base leading-relaxed space-y-3" style={{ color: 'var(--secondary)' }}>
      {children}
    </div>
  </section>
);

export default function PrivacyPage() {
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
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>Privacy Policy</h1>
          <p className="text-sm" style={{ color: 'var(--secondary)' }}>Last updated: {lastUpdated}</p>
        </header>

        <Section title="1. Information We Collect">
          <p>We collect the following information when you use our Service:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li><strong>Account data:</strong> Email address and password (hashed), or OAuth tokens if you sign in with Google.</li>
            <li><strong>Invitation content:</strong> Names, dates, event details, and photos you enter when creating an invitation.</li>
            <li><strong>Guest RSVP data:</strong> Names and attendance responses submitted by your guests.</li>
            <li><strong>Payment records:</strong> Order IDs, amounts, and payment method types (we do not store card numbers).</li>
            <li><strong>Usage data:</strong> Basic analytics such as page views and feature usage.</li>
          </ul>
        </Section>

        <Section title="2. How We Use Your Information">
          <p>We use your information to:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Provide and maintain the Service</li>
            <li>Process payments and manage your quota</li>
            <li>Display your invitation to guests who have the link</li>
            <li>Send essential service notifications (e.g., payment confirmations)</li>
            <li>Improve our product based on usage patterns</li>
          </ul>
          <p>We do <strong>not</strong> sell your personal data to third parties.</p>
        </Section>

        <Section title="3. Data Storage & Security">
          <p>
            Your data is stored on <strong>Supabase</strong>, a secure cloud database provider, in servers located in Southeast Asia. All data is encrypted in transit (TLS) and at rest.
          </p>
          <p>
            We implement industry-standard security practices including Row Level Security (RLS) so that your data is only accessible to you.
          </p>
        </Section>

        <Section title="4. Sharing Your Information">
          <p>We share your information only with:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li><strong>Supabase</strong> — database and authentication provider</li>
            <li><strong>Pakasir</strong> — payment processing (order amount and reference only)</li>
            <li><strong>Vercel</strong> — hosting infrastructure</li>
          </ul>
          <p>All third-party providers are bound by data processing agreements and applicable privacy laws.</p>
        </Section>

        <Section title="5. Guest Data">
          <p>
            When a guest RSVPs to an invitation, they provide their name and attendance status. This data is stored and accessible only to the invitation owner. Guests are not required to create an account.
          </p>
          <p>
            If a guest wishes to have their RSVP data removed, the invitation owner can delete it from the guest list dashboard, or they may contact us directly.
          </p>
        </Section>

        <Section title="6. Cookies">
          <p>
            We use essential cookies only — specifically for managing your authenticated session. We do not use advertising cookies or third-party tracking.
          </p>
        </Section>

        <Section title="7. Data Retention">
          <p>
            Your account and invitation data is retained until you delete your account. Upon account deletion, all your data (invitations, RSVP lists, and quota records) will be permanently deleted within 30 days.
          </p>
        </Section>

        <Section title="8. Your Rights">
          <p>You have the right to:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Access the data we hold about you</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your account and data</li>
            <li>Export your invitation data</li>
          </ul>
          <p>
            To exercise these rights, contact us at{' '}
            <a href="mailto:support@invitations.app" className="underline" style={{ color: 'var(--primary)' }}>
              support@invitations.app
            </a>.
          </p>
        </Section>

        <Section title="9. Children's Privacy">
          <p>
            Our Service is not directed at children under 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal data, please contact us.
          </p>
        </Section>

        <Section title="10. Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. We will notify you of significant changes by email or a prominent notice on our Service.
          </p>
        </Section>

        <Section title="11. Contact">
          <p>
            Questions about this Privacy Policy? Contact us at{' '}
            <a href="mailto:support@invitations.app" className="underline" style={{ color: 'var(--primary)' }}>
              support@invitations.app
            </a>.
          </p>
        </Section>
      </main>

      <footer className="border-t py-8" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-3xl mx-auto px-5 flex gap-4 text-sm" style={{ color: 'var(--secondary)' }}>
          <Link href="/terms" className="hover:underline">Terms of Service</Link>
          <Link href="/pricing" className="hover:underline">Pricing</Link>
        </div>
      </footer>
    </div>
  );
}
