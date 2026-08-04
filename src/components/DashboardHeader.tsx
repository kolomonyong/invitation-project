// src/components/DashboardHeader.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

// ─── Icons ──────────────────────────────────────────────────────────────────
const MenuIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
)
const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
)
const BellIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
  </svg>
)
const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
)
const SparkleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
  </svg>
)
const CalendarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
  </svg>
)
const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
  </svg>
)

interface DashboardHeaderProps {
  onOpenSidebar: () => void;
  title?: string;
}

const quickLinks = [
  { label: 'My Invitations', href: '/dashboard', desc: 'View all your invitations' },
  { label: 'Create New Invitation', href: '/dashboard', desc: 'Start from a template' },
  { label: 'Guest Lists', href: '/dashboard', desc: 'Manage your guest RSVPs' },
]

export default function DashboardHeader({ onOpenSidebar, title = 'Dashboard' }: DashboardHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

  const filtered = query.trim()
    ? quickLinks.filter(l => l.label.toLowerCase().includes(query.toLowerCase()))
    : quickLinks;

  return (
    <>
      <header
        className="flex items-center justify-between h-[72px] shrink-0 border-b bg-white px-5 md:px-8 sticky top-0 z-30"
        style={{ borderColor: 'var(--border)' }}
      >
        {/* Left: Hamburger + Title */}
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenSidebar}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl transition-all cursor-pointer"
            style={{ border: '1px solid var(--border)' }}
            aria-label="Open menu"
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--primary)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'}
          >
            <MenuIcon className="w-5 h-5" style={{ color: 'var(--foreground)' }} />
          </button>

          {/* Mobile brand */}
          <div className="flex items-center gap-2 lg:hidden">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, var(--primary), #A78BFA)' }}
            >
              <SparkleIcon className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-base" style={{ color: 'var(--foreground)' }}>Invitations</span>
          </div>

          {/* Desktop title */}
          <h2
            className="hidden lg:block font-bold text-xl"
            style={{ color: 'var(--foreground)' }}
          >
            {title}
          </h2>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setSearchOpen(true)}
            className="w-10 h-10 flex items-center justify-center rounded-xl transition-all cursor-pointer"
            style={{ border: '1px solid var(--border)' }}
            aria-label="Search"
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--primary)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'}
          >
            <SearchIcon className="w-5 h-5" style={{ color: 'var(--secondary)' }} />
          </button>

          <button
            className="relative w-10 h-10 flex items-center justify-center rounded-xl transition-all cursor-pointer"
            style={{ border: '1px solid var(--border)' }}
            aria-label="Notifications"
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--primary)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'}
          >
            <BellIcon className="w-5 h-5" style={{ color: 'var(--secondary)' }} />
            <span
              className="absolute top-2 right-2.5 w-2 h-2 rounded-full ring-2 ring-white"
              style={{ background: 'var(--error)' }}
            />
          </button>
        </div>
      </header>

      {/* Search Modal */}
      {searchOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[100] flex items-start justify-center pt-[8vh] p-4 backdrop-blur-sm"
          onClick={() => { setSearchOpen(false); setQuery(''); }}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Search input */}
            <div
              className="flex items-center gap-3 px-5 border-b"
              style={{ borderColor: 'var(--border)' }}
            >
              <SearchIcon className="w-5 h-5 shrink-0" style={{ color: 'var(--secondary)' }} />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search invitations, templates, guests…"
                className="flex-1 h-16 bg-transparent outline-none text-sm font-medium"
                style={{ color: 'var(--foreground)' }}
                onKeyDown={e => e.key === 'Escape' && (setSearchOpen(false), setQuery(''))}
              />
              <button
                onClick={() => { setSearchOpen(false); setQuery(''); }}
                className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer"
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--muted)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
              >
                <XIcon className="w-4 h-4" style={{ color: 'var(--secondary)' }} />
              </button>
            </div>

            {/* Results */}
            <div className="p-3">
              <p
                className="text-[10px] font-bold uppercase tracking-widest mb-2 px-3"
                style={{ color: 'var(--secondary)' }}
              >
                {query ? 'Results' : 'Quick Links'}
              </p>
              <div className="flex flex-col gap-0.5">
                {filtered.map(link => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => { setSearchOpen(false); setQuery(''); }}
                    className="flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer group"
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--muted)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: 'var(--primary-light)' }}
                    >
                      <CalendarIcon className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate" style={{ color: 'var(--foreground)' }}>
                        {link.label}
                      </p>
                      <p className="text-xs truncate" style={{ color: 'var(--secondary)' }}>
                        {link.desc}
                      </p>
                    </div>
                    <ArrowRightIcon
                      className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: 'var(--secondary)' }}
                    />
                  </Link>
                ))}
                {query && filtered.length === 0 && (
                  <p className="text-center py-6 text-sm" style={{ color: 'var(--secondary)' }}>
                    No results for &ldquo;{query}&rdquo;
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
