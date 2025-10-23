// src/app/(app)/dashboard/invitations/[id]/guests/page.tsx
import { createServerClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';

// --- vvv NEW TYPE DEFINITION vvv ---
// This is the blueprint for our invitation data, telling TypeScript
// that 'templates' is a single object, not an array.
type InvitationWithTemplate = {
  id: string;
  templates: {
    name: string;
  } | null;
};

type PageProps = {
  params: { id: string };
  searchParams: Record<string, string | string[] | undefined>;
};

export default async function GuestListPage({ params }: PageProps) {
  const supabase = createServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/');

  const { data, error: invError } = await supabase
    .from('invitations')
    .select('id, templates (name)')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single();

  // --- vvv APPLY THE TYPE ASSERTION vvv ---
  // We are telling TypeScript to trust us that the data has the correct shape.
  const invitation = data as InvitationWithTemplate | null;
  // --- ^^^ APPLY THE TYPE ASSERTISON ^^^ ---

  if (invError || !invitation) {
    notFound();
  }
  
  const { data: rsvps, error: rsvpError } = await supabase
    .from('rsvps')
    .select('*')
    .eq('invitation_id', params.id)
    .order('created_at', { ascending: true });
  
  if (rsvpError) {
    console.error("Error fetching RSVPs:", rsvpError);
  }

  const attendingCount = rsvps?.filter(r => r.is_attending).reduce((sum, r) => sum + r.guest_count, 0) || 0;
  const notAttendingCount = rsvps?.filter(r => !r.is_attending).length || 0;

  return (
    <div>
      <Link href="/dashboard" className="text-blue-500 hover:underline mb-6 inline-block">
        &larr; Back to Dashboard
      </Link>
      
      {/* This line will now work without any errors */}
      <h1 className="text-3xl font-bold">Guest List for &ldquo;{invitation.templates?.name}&rdquo;</h1>
      
      <div className="my-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-100 p-4 rounded-lg shadow">
          <p className="text-sm text-green-800 font-bold">Attending</p>
          <p className="text-3xl font-extrabold text-green-900">{attendingCount}</p>
        </div>
        <div className="bg-red-100 p-4 rounded-lg shadow">
          <p className="text-sm text-red-800 font-bold">Not Attending</p>
          <p className="text-3xl font-extrabold text-red-900">{notAttendingCount}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-800 font-bold">Total Responses</p>
          <p className="text-3xl font-extrabold text-gray-900">{rsvps?.length || 0}</p>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guest Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attending?</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guest Count</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rsvps?.map((rsvp) => (
              <tr key={rsvp.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{rsvp.guest_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {rsvp.is_attending 
                    ? <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Yes</span>
                    : <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">No</span>
                  }
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rsvp.guest_count}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rsvp.notes || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}