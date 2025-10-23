'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import Image from 'next/image';
import { QRCodeSVG } from 'qrcode.react';
import toast from 'react-hot-toast';

// Type definition for a Template
type Template = {
  id: number;
  name: string;
  category: string;
  preview_image_url: string;
}

// Type for an Invitation with joined template data
type Invitation = {
  id: string; 
  created_at: string;
  templates: {
    name: string;
    preview_image_url: string;
  } | null;
}

export default function Dashboard() {
  const supabase = createClient();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [myInvitations, setMyInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://invitation-project-ten.vercel.app/';

  useEffect(() => {
    // ... (This data fetching logic is the same)
    const getData = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Current user:', user?.id);
      
      if (user) {
        const { data: templatesData, error: templatesError } = await supabase.from('templates').select('*');
        console.log('Templates data:', templatesData);
        console.log('Templates error:', templatesError);
        if (templatesData) setTemplates(templatesData);
        
        const { data: invitationsData, error: invitationsError } = await supabase
          .from('invitations')
          .select(`id, created_at, templates ( name, preview_image_url )`)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        console.log('Invitations data:', invitationsData);
        console.log('Invitations error:', invitationsError);
        
        if (invitationsError) {
          console.error("Error fetching invitations with join:", invitationsError);
        } else if (invitationsData) {
            const transformedData = invitationsData.map(invitation => ({
                ...invitation,
                templates: Array.isArray(invitation.templates) ? invitation.templates[0] : invitation.templates
            }));
            setMyInvitations(transformedData as Invitation[]);
        }
      }
      setLoading(false);
    }
    getData();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("You have been signed out.");
    window.location.href = '/';
  }

  // --- vvv NEW DELETE FUNCTION vvv ---
  const handleDeleteInvitation = async (invitationId: string) => {
    // Show a confirmation dialog to prevent accidental deletion
    if (window.confirm("Are you sure you want to delete this invitation? This is permanent.")) {
      const { error } = await supabase
        .from('invitations')
        .delete()
        .eq('id', invitationId);

      if (error) {
        toast.error("Failed to delete invitation.");
        console.error("Delete error:", error);
      } else {
        toast.success("Invitation deleted successfully.");
        // Instantly update the UI by removing the deleted invitation from state
        setMyInvitations(currentInvitations =>
          currentInvitations.filter(inv => inv.id !== invitationId)
        );
      }
    }
  };
  // --- ^^^ NEW DELETE FUNCTION ^^^ ---

  if (loading) {
    return <p className="text-center p-8">Loading your dashboard...</p>
  }

  return (
    <div className="container mx-auto p-8">
      {/* ... (Header is the same) ... */}
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
        <button
          onClick={handleSignOut}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
        >
          Sign Out
        </button>
      </header>
      
      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-6 border-b pb-2">My Invitations</h2>
        {myInvitations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {myInvitations.map((invitation) => {
              const invitationUrl = `${siteUrl}/invite/${invitation.id}`;
              return (
                <div key={invitation.id} className="border bg-white rounded-lg shadow-lg flex flex-col h-full">
                  <a href={invitationUrl} target="_blank" rel="noopener noreferrer" className="block group">
                    <div className="overflow-hidden h-48 rounded-t-lg relative">
                        <Image 
                            src={invitation.templates?.preview_image_url || 'https://placehold.co/600x400?text=Image+Not+Found'}
                            alt={invitation.templates?.name || 'Invitation'}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                  </a>
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-bold text-lg mb-1 truncate">{invitation.templates?.name || 'Untitled Invitation'}</h3>
                    <p className="text-sm text-gray-500 mb-4">Created: {new Date(invitation.created_at).toLocaleDateString()}</p>
                    
                    <div className="mt-auto pt-4 border-t space-y-3">
                      <Link href={`/dashboard/invitations/${invitation.id}/guests`} className="block w-full bg-indigo-600 text-white text-center font-bold py-2 px-4 rounded hover:bg-indigo-700 transition-colors duration-300">
                        View Guests
                      </Link>
                      <div className="flex flex-col items-center">
                          <QRCodeSVG value={invitationUrl} size={100} className="mb-2" />
                          <a href={invitationUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                              View Public Link
                          </a>
                      </div>
                      {/* --- vvv NEW EDIT/DELETE BUTTONS vvv --- */}
                      <div className="flex justify-around items-center pt-2 border-t">
                        <Link href={`/dashboard/invitations/edit/${invitation.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-800">
                          Edit
                        </Link>
                        <button 
                          onClick={() => handleDeleteInvitation(invitation.id)}
                          className="text-sm font-medium text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                      {/* --- ^^^ NEW EDIT/DELETE BUTTONS ^^^ --- */}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          // ... (No invitations message is the same)
          <div className="text-center py-10 px-6 bg-gray-50 rounded-lg">
            <p className="text-gray-600">You haven&apos;t created any invitations yet. Choose a template below to get started!</p>
          </div>
        )}
      </section>
      
      {/* ... (Create a New Invitation section is the same) ... */}
      <section>
        <h2 className="text-3xl font-semibold mb-6 border-b pb-2">Create a New Invitation</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {templates.map((template) => (
            <Link href={`/editor/${template.id}`} key={template.id} className="block group">
              <div className="border bg-white rounded-lg shadow-lg overflow-hidden h-full hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                <div className="overflow-hidden h-56 relative">
                    <Image
                        src={template.preview_image_url}
                        alt={template.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-xl mb-2 truncate">{template.name}</h3>
                  <p className="text-gray-700 text-base capitalize">{template.category}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}