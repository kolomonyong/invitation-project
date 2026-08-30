import { createServerClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';

type InvitationWithTemplate = {
  id: string;
  templates: {
    name: string;
  } | null;
};

type Props = {
  params: Promise<{
    [x: string]: string;
    id: string;
  }>;
};

export default async function GuestListPage(props: Props) {
  const supabase = await createServerClient();
  
  const { id } = await props.params;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/');

  const { data, error: invError } = await supabase
    .from('invitations')
    .select('id, templates (name)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  const invitation = data as InvitationWithTemplate | null;

  if (invError || !invitation) {
    notFound();
  }
  
  const { data: rsvps, error: rsvpError } = await supabase
    .from('rsvps')
    .select('*')
    .eq('invitation_id', id)
    .order('created_at', { ascending: true });
  
  if (rsvpError) {
    console.error("Error fetching RSVPs:", rsvpError);
  }

  const attendingCount = rsvps?.filter(r => r.is_attending).reduce((sum, r) => sum + r.guest_count, 0) || 0;
  const notAttendingCount = rsvps?.filter(r => !r.is_attending).length || 0;
  const totalResponses = rsvps?.length || 0;

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <Link href="/dashboard" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-2 mb-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Guest List</h1>
          <p className="text-slate-500 mt-1">For &ldquo;{invitation.templates?.name}&rdquo;</p>
        </div>
        <div className="flex gap-2">
          {/* Future feature: export to CSV */}
          <button disabled className="px-4 py-2 bg-white border border-slate-200 text-slate-400 font-medium rounded-lg text-sm flex items-center gap-2 cursor-not-allowed">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Attending</p>
            <p className="text-2xl font-bold text-slate-900">{attendingCount} <span className="text-sm font-normal text-slate-400">guests</span></p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-500">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Declined</p>
            <p className="text-2xl font-bold text-slate-900">{notAttendingCount}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-[var(--primary)]" style={{ backgroundColor: 'rgba(139, 26, 26, 0.05)' }}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Responses</p>
            <p className="text-2xl font-bold text-slate-900">{totalResponses}</p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden">
        {totalResponses === 0 ? (
          <div className="py-20 px-6 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No responses yet</h3>
            <p className="text-slate-500 max-w-sm mx-auto text-sm">When guests respond to your invitation, they will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-semibold">Guest Name</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Guests</th>
                  <th className="px-6 py-4 font-semibold">Notes / Wishes</th>
                  <th className="px-6 py-4 font-semibold text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rsvps?.map((rsvp) => (
                  <tr key={rsvp.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{rsvp.guest_name}</td>
                    <td className="px-6 py-4">
                      {rsvp.is_attending 
                        ? <span className="px-2.5 py-1 inline-flex text-xs font-semibold rounded-full bg-green-50 text-green-700 border border-green-200">Attending</span>
                        : <span className="px-2.5 py-1 inline-flex text-xs font-semibold rounded-full bg-slate-100 text-slate-600 border border-slate-200">Declined</span>
                      }
                    </td>
                    <td className="px-6 py-4 text-slate-600">{rsvp.is_attending ? rsvp.guest_count : '-'}</td>
                    <td className="px-6 py-4 text-slate-600 max-w-xs truncate" title={rsvp.notes || ''}>{rsvp.notes || <span className="text-slate-300 italic">None</span>}</td>
                    <td className="px-6 py-4 text-slate-500 text-right whitespace-nowrap">
                      {new Date(rsvp.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}