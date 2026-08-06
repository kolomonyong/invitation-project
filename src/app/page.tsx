// src/app/page.tsx
'use client'

import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden font-lexend-deca">
      
      {/* ─── Navigation ───────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 h-[80px] bg-white/80 backdrop-blur-md border-b border-border z-50 flex items-center justify-between px-6 lg:px-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, var(--primary), #A78BFA)' }}>
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
            </svg>
          </div>
          <span className="font-bold text-xl text-foreground tracking-tight">Invia</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-semibold text-secondary hover:text-foreground transition-colors">
            Login
          </Link>
          <Link href="/login" className="px-5 py-2.5 rounded-full text-white text-sm font-bold shadow-lg hover:-translate-y-0.5 transition-all" style={{ background: 'linear-gradient(135deg, var(--primary), #8B5CF6)' }}>
            Get Started Free
          </Link>
        </div>
      </nav>

      <main className="pt-[80px]">
        {/* ─── Hero Section ─────────────────────────────────────────────────────── */}
        <section className="relative px-6 py-20 lg:py-32 flex flex-col items-center text-center overflow-hidden">
          {/* Background decorations */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] -z-10" />
          
          <div className="inline-flex items-center gap-2.5 rounded-full px-4 py-2 mb-8 bg-indigo-50 border border-indigo-100 text-indigo-600 animate-slide-up">
            <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-sm font-semibold tracking-wide">The New Standard for Invitations</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold text-foreground leading-tight tracking-tight max-w-4xl mb-6 animate-slide-up animation-delay-200">
            Craft Invitations <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-500">
              Worth Remembering
            </span>
          </h1>
          
          <p className="text-lg lg:text-xl text-secondary max-w-2xl mb-10 animate-slide-up animation-delay-400">
            Design stunning digital invitations for your most precious moments—weddings, birthdays, and celebrations. Share instantly and track RSVPs with ease.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 animate-slide-up animation-delay-600">
            <Link href="/login" className="px-8 py-4 rounded-full text-white font-bold text-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform shadow-xl shadow-indigo-500/30" style={{ background: 'var(--primary)' }}>
              Create Your Invitation 
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link href="#templates" className="px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:bg-muted transition-colors border border-border text-foreground">
              View Templates
            </Link>
          </div>
        </section>

        {/* ─── Features Section ─────────────────────────────────────────────────── */}
        <section className="py-20 bg-muted px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Everything You Need</h2>
              <p className="text-secondary text-lg">Simple tools to create extraordinary experiences.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: 'Beautiful Designs', desc: 'Choose from our premium, hand-crafted templates for any occasion.', icon: '✨' },
                { title: 'Easy Customization', desc: 'Personalize colors, fonts, and images to perfectly match your theme.', icon: '🎨' },
                { title: 'Instant Sharing', desc: 'Send your invitation instantly via link, WhatsApp, or social media.', icon: '🚀' },
                { title: 'RSVP Tracking', desc: 'Keep track of who is coming with built-in digital RSVP forms.', icon: '📋' },
                { title: 'Photo Galleries', desc: 'Share your beautiful moments with integrated photo galleries.', icon: '📸' },
                { title: 'Gift Registries', desc: 'Politely share your gift preferences or bank details securely.', icon: '🎁' }
              ].map((feature, i) => (
                <div key={i} className="bg-white p-8 rounded-3xl border border-border hover:shadow-lg hover:-translate-y-1 transition-all">
                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-secondary leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Template Showcase ──────────────────────────────────────────────── */}
        <section id="templates" className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <h2 className="text-4xl font-bold mb-4">Premium Templates</h2>
                <p className="text-secondary text-lg max-w-xl">
                  Start with a stunning template and make it your own. Designed to look perfect on any device.
                </p>
              </div>
              <Link href="/login" className="font-semibold text-indigo-600 hover:underline shrink-0">
                View all templates →
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Template 1 */}
              <div className="group cursor-pointer">
                <div className="aspect-[3/4] rounded-3xl overflow-hidden mb-6 bg-muted relative">
                  <img src="https://placehold.co/600x800/0d1b2a/c9a84c?text=Elegant+Wedding" alt="Elegant Wedding" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-6 py-3 bg-white text-foreground font-bold rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform shadow-lg">Preview Template</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-1">Elegant Navy & Gold</h3>
                <p className="text-secondary text-sm">Wedding Collection</p>
              </div>
              
              {/* Template 2 */}
              <div className="group cursor-pointer">
                <div className="aspect-[3/4] rounded-3xl overflow-hidden mb-6 bg-muted relative">
                  <img src="https://placehold.co/600x800/141414/e50914?text=Netflix+Style" alt="Cinematic Love" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-6 py-3 bg-white text-foreground font-bold rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform shadow-lg">Preview Template</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-1">Cinematic Love Story</h3>
                <p className="text-secondary text-sm">Creative Collection</p>
              </div>

              {/* Template 3 */}
              <div className="group cursor-pointer">
                <div className="aspect-[3/4] rounded-3xl overflow-hidden mb-6 bg-muted relative">
                  <img src="https://placehold.co/600x800/f3f4f6/1f2937?text=Minimalist+Wedding" alt="Modern Minimal" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-6 py-3 bg-white text-foreground font-bold rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform shadow-lg">Preview Template</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-1">Modern Minimal</h3>
                <p className="text-secondary text-sm">Wedding Collection</p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Final CTA ──────────────────────────────────────────────────────── */}
        <section className="py-24 px-6 bg-foreground text-white text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">Ready to share your special moment?</h2>
            <p className="text-xl text-white/70 mb-10">Join thousands of others who have created unforgettable digital invitations.</p>
            <Link href="/login" className="inline-flex px-10 py-5 rounded-full text-foreground font-bold text-lg items-center justify-center hover:scale-105 transition-transform bg-white shadow-2xl">
              Start Creating for Free
            </Link>
          </div>
        </section>
      </main>

      {/* ─── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-border py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: 'var(--primary)' }}>
               <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
              </svg>
            </div>
            <span className="font-bold text-foreground">Invia</span>
          </div>
          <p className="text-sm text-secondary">
            © {new Date().getFullYear()} Invia Digital Invitations. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  )
}
