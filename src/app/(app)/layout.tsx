// src/app/(app)/layout.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | undefined>();

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
        onClose={() => setSidebarOpen(false)}
        userEmail={userEmail}
      />

      {/* Main area offset by sidebar width on desktop */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-[272px]">
        <DashboardHeader
          onOpenSidebar={() => setSidebarOpen(true)}
          title="Dashboard"
        />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}