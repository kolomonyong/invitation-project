// src/app/pricing/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Pricing — Digital Invitations',
  description: 'Simple, transparent pricing. Start free with 1 invitation, and buy more as you grow. No subscriptions.',
};

const CheckIcon = () => (
  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
  </svg>
);

const SparkleIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
  </svg>
);

const freeFeatures = [
  '1 digital invitation',
  'All premium templates',
  'Unlimited RSVPs from guests',
  'QR code sharing',
  'Custom invitation content',
  'Mobile-friendly design',
];

const payAsYouGoFeatures = [
  'Everything in Free',
  'Buy additional invitations (Rp10.000 each)',
  'No recurring subscription',
  'Pay only when you need more',
  'QRIS & Virtual Account payment',
  'Instant quota top-up',
];

const faqs = [
  {
    q: 'What counts as an "invitation"?',
    a: 'One invitation = one unique event page. You can share it with unlimited guests via link or QR code. The limit is on how many different events you can create.',
  },
  {
    q: 'Do my invitations expire?',
    a: 'No! Once created, your invitation page is permanently accessible. Your guests can always open the link.',
  },
  {
    q: 'What payment methods are accepted?',
    a: 'We accept QRIS (compatible with GoPay, OVO, DANA, ShopeePay, and all e-wallets) and major bank Virtual Accounts (BRI, BNI, CIMB Niaga, Permata, Maybank).',
  },
  {
    q: 'Is there a subscription?',
    a: 'Absolutely not. You pay Rp10.000 per additional invitation slot — no monthly fees, no annual plans, no surprises.',
  },
  {
    q: 'Can I try before buying?',
    a: 'Yes! You get 1 free invitation slot for every account, no credit card required. Create your first invitation to see how beautiful it looks.',
  },
];

export default function PricingPage() {
  return (
    <div
      className="min-h-screen"
      style={{ fontFamily: "var(--font-lexend-deca), 'Inter', sans-serif", background: 'var(--muted)' }}
    >
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--primary)' }}
            >
              <SparkleIcon />
            </div>
            <span className="font-bold text-base" style={{ color: 'var(--foreground)' }}>Invitations</span>
          </Link>
          <Link
            href="/login"
            className="px-5 py-2.5 rounded-full font-bold text-sm text-white transition-opacity hover:opacity-90"
            style={{ background: 'var(--primary)' }}
          >
            Get Started Free
          </Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-5 py-16">

        {/* Header */}
        <div className="text-center mb-14">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-5"
            style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}
          >
            <SparkleIcon />
            Simple Pricing
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
            Pay only for what you use
          </h1>
          <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--secondary)' }}>
            Start free. Buy more invitations for just{' '}
            <span className="font-bold" style={{ color: 'var(--primary)' }}>Rp10.000 each</span>.
            No subscriptions, ever.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">

          {/* Free */}
          <div className="bg-white rounded-3xl p-8 border" style={{ borderColor: 'var(--border)' }}>
            <div className="mb-6">
              <p className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--secondary)' }}>Free</p>
              <div className="flex items-end gap-1 mb-2">
                <span className="text-5xl font-bold" style={{ color: 'var(--foreground)' }}>Rp0</span>
              </div>
              <p className="text-sm" style={{ color: 'var(--secondary)' }}>Forever free — no card needed</p>
            </div>
            <Link
              href="/login"
              className="block w-full text-center py-3.5 rounded-full font-bold text-sm mb-8 transition-all duration-200 hover:opacity-90"
              style={{
                background: 'var(--muted)',
                color: 'var(--foreground)',
                border: '2px solid var(--border)',
              }}
            >
              Get Started Free
            </Link>
            <ul className="space-y-3">
              {freeFeatures.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm" style={{ color: 'var(--foreground)' }}>
                  <span style={{ color: 'var(--primary)' }}><CheckIcon /></span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Pay as you go */}
          <div
            className="rounded-3xl p-8 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, var(--primary) 0%, #8B1A1A 100%)',
            }}
          >
            {/* Popular badge */}
            <div
              className="absolute top-5 right-5 text-xs font-bold px-3 py-1 rounded-full"
              style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}
            >
              Most Popular
            </div>

            <div className="mb-6">
              <p className="text-sm font-bold uppercase tracking-widest mb-2 text-white/70">Pay as you go</p>
              <div className="flex items-end gap-1 mb-2">
                <span className="text-5xl font-bold text-white">Rp10k</span>
                <span className="text-white/70 mb-2 font-medium">/ invitation</span>
              </div>
              <p className="text-sm text-white/70">Buy only when you need more</p>
            </div>
            <Link
              href="/dashboard"
              className="block w-full text-center py-3.5 rounded-full font-bold text-sm mb-8 transition-all duration-200 hover:opacity-90 bg-white"
              style={{ color: 'var(--primary)' }}
            >
              Buy Quota in Dashboard
            </Link>
            <ul className="space-y-3">
              {payAsYouGoFeatures.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-white">
                  <span className="text-white"><CheckIcon /></span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8" style={{ color: 'var(--foreground)' }}>
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.q}
                className="bg-white rounded-2xl p-6 border"
                style={{ borderColor: 'var(--border)' }}
              >
                <h3 className="font-bold mb-2" style={{ color: 'var(--foreground)' }}>{faq.q}</h3>
                <p className="text-sm" style={{ color: 'var(--secondary)' }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-lg font-medium mb-4" style={{ color: 'var(--secondary)' }}>
            Ready to create something beautiful?
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white transition-opacity hover:opacity-90"
            style={{ background: 'var(--primary)', boxShadow: '0 4px 20px -4px rgba(108,99,255,0.5)' }}
          >
            Start for Free
          </Link>
          <p className="text-xs mt-3" style={{ color: 'var(--secondary)' }}>
            No credit card required · 1 free invitation included
          </p>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-8" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-5xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm" style={{ color: 'var(--secondary)' }}>
          <span>© {new Date().getFullYear()} Digital Invitations. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:underline">Terms of Service</Link>
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
