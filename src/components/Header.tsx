// src/components/Header.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast'; // Make sure this import is here

export default function Header() {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    // --- vvv ADD THIS LINE vvv ---
    toast.success("You have been signed out successfully.");
    router.push('/'); 
  };

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-8 py-4 flex justify-between items-center">
        <Link href="/dashboard" className="text-2xl font-bold text-purple-600 hover:text-purple-800">
          Digital Invitations
        </Link>
        <button
          onClick={handleSignOut}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
        >
          Sign Out
        </button>
      </nav>
    </header>
  );
}