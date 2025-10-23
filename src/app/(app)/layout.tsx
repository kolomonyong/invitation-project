// src/app/(app)/layout.tsx
import Header from '@/components/Header'; // We will create this component next

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      <main>
        {children}
      </main>
    </div>
  );
}