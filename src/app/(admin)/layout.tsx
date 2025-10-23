// src/app/(admin)/layout.tsx
import { createServerClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import Header from '@/components/Header';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/');
  }

  // --- VVV DEBUGGING LOGIC VVV ---
  console.log("--- AdminLayout Security Check ---");
  console.log("Checking admin status for user:", user.id);
  
  const { data: isAdmin, error } = await supabase.rpc('is_admin');
  
  console.log("Result from is_admin() function:", isAdmin);
  console.log("Error from is_admin() function:", error);
  // --- ^^^ DEBUGGING LOGIC ^^^ ---

  if (error) {
    console.error("Error checking admin status:", error);
    return notFound(); 
  }

  if (!isAdmin) {
    console.log("ACCESS DENIED. User is not an admin or check failed.");
    console.log("---------------------------------");
    return notFound();
  }

  console.log("ACCESS GRANTED. User is an admin.");
  console.log("---------------------------------");
  return (
    <div>
      <Header />
      <main className="container mx-auto p-8">
        {children}
      </main>
    </div>
  );
}