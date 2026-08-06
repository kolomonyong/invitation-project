// src/components/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';

// ─── Icons ──────────────────────────────────────────────────────────────────
const LayoutIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
  </svg>
)
const EnvelopeOpenIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9v.906a2.25 2.25 0 0 1-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 0 0 1.183 1.981l6.478 3.488m8.839 2.51-4.66-2.51m0 0-1.023-.55a2.25 2.25 0 0 0-2.134 0l-1.022.55m0 0-4.661 2.51m16.5 1.615a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V8.844a2.25 2.25 0 0 1 1.183-1.981l7.5-4.04a2.25 2.25 0 0 1 2.134 0l7.5 4.04a2.25 2.25 0 0 1 1.183 1.98V19.5Z" />
  </svg>
)
const PlusCircleIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
)
const UsersIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
  </svg>
)
const SparkleIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
  </svg>
)
const LogOutIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
  </svg>
)
const XIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
)

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutIcon },
  { href: '/dashboard/invitations', label: 'My Invitations', icon: EnvelopeOpenIcon },
  { href: '/dashboard/create', label: 'Create New', icon: PlusCircleIcon },
  { href: '/dashboard/guests', label: 'Guest Lists', icon: UsersIcon },
]

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
}

export default function Sidebar({ isOpen, onClose, userEmail }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [showLogout, setShowLogout] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => { onClose(); }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success('Signed out successfully');
    router.push('/');
  };

  const initials = userEmail
    ? userEmail.substring(0, 2).toUpperCase()
    : 'U';

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className="flex flex-col w-[272px] shrink-0 h-screen fixed inset-y-0 left-0 z-50 bg-white border-r border-border transition-transform duration-300 overflow-hidden"
        style={{
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          borderColor: 'var(--border)',
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center justify-between h-[72px] px-5 shrink-0 border-b"
          style={{ borderColor: 'var(--border)' }}
        >
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg, var(--primary), #A78BFA)' }}
            >
              <SparkleIcon className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-base tracking-tight" style={{ color: 'var(--foreground)' }}>
              Digital Invitations
            </span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors cursor-pointer"
            aria-label="Close sidebar"
          >
            <XIcon className="w-4 h-4" style={{ color: 'var(--secondary)' }} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col flex-1 px-4 py-5 gap-1 overflow-y-auto">
          <p
            className="text-[10px] font-bold uppercase tracking-widest mb-2 px-2"
            style={{ color: 'var(--secondary)' }}
          >
            Menu
          </p>
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-200"
                style={{
                  background: isActive ? 'var(--primary-light)' : 'transparent',
                  color: isActive ? 'var(--primary)' : 'var(--secondary)',
                  fontWeight: isActive ? 600 : 500,
                }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'var(--muted)'; }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{label}</span>
                {isActive && (
                  <span
                    className="ml-auto w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: 'var(--primary)' }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Bottom Bar */}
        <div
          className="border-t p-4 shrink-0"
          style={{ borderColor: 'var(--border)' }}
        >
          <div
            className="flex items-center justify-between gap-3 p-2.5 rounded-2xl ring-1 transition-all cursor-default"
            style={{ borderColor: 'var(--border)' }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0"
                style={{ background: 'linear-gradient(135deg, var(--primary), #A78BFA)' }}
              >
                {initials}
              </div>
              <div className="min-w-0">
                <p
                  className="text-sm font-semibold truncate"
                  style={{ color: 'var(--foreground)' }}
                >
                  {userEmail || 'My Account'}
                </p>
                <p className="text-xs truncate" style={{ color: 'var(--secondary)' }}>Administrator</p>
              </div>
            </div>
            <button
              onClick={() => setShowLogout(true)}
              className="w-8 h-8 flex items-center justify-center rounded-lg transition-all cursor-pointer shrink-0"
              title="Sign out"
              style={{ color: 'var(--secondary)' }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = 'var(--error-light)';
                (e.currentTarget as HTMLElement).style.color = 'var(--error)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'transparent';
                (e.currentTarget as HTMLElement).style.color = 'var(--secondary)';
              }}
            >
              <LogOutIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogout && (
        <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: 'var(--error-light)' }}
            >
              <LogOutIcon className="w-8 h-8" style={{ color: 'var(--error)' }} />
            </div>
            <h3
              className="text-xl font-bold mb-2"
              style={{ color: 'var(--foreground)' }}
            >
              Sign Out
            </h3>
            <p className="text-sm mb-6" style={{ color: 'var(--secondary)' }}>
              Are you sure you want to sign out of your account?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogout(false)}
                className="flex-1 py-3 rounded-full font-semibold transition-all cursor-pointer"
                style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--muted)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
              >
                Cancel
              </button>
              <button
                onClick={handleSignOut}
                className="flex-1 py-3 rounded-full font-bold text-white transition-all cursor-pointer"
                style={{ background: 'var(--error)' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.85'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
