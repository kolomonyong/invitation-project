// src/app/(app)/layout.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import SessionWarningModal from '@/components/SessionWarningModal';
import { useIdleTimer } from '@/hooks/useIdleTimer';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | undefined>();
  const router = useRouter();

  const handleOpenSidebar = useCallback(() => setSidebarOpen(true), []);
  const handleCloseSidebar = useCallback(() => setSidebarOpen(false), []);

  // Idle timer for auto-logout after 4 hours of inactivity
  const { showWarning, minutesRemaining, dismissWarning } = useIdleTimer();

  const handleLogout = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login?expired=true');
  }, [router]);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserEmail(user?.email ?? undefined);
    });
  }, []);

  return (
    <div
      className="min-h-screen flex"
      style={{ fontFamily: "var(--font-lexend-deca), 'Inter', sans-serif", background: 'var(--muted)' }}
    >
      {/* Fixed Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={handleCloseSidebar}
        userEmail={userEmail}
      />

      {/* Main area offset by sidebar width on desktop */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-[272px]">
        <DashboardHeader
          onOpenSidebar={handleOpenSidebar}
          title="Dashboard"
        />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Session expiry warning modal */}
      {showWarning && (
        <SessionWarningModal
          minutesRemaining={minutesRemaining}
          onStayLoggedIn={dismissWarning}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}