// src/app/invite/[id]/page.tsx
import { createServerClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

// --- vvv IMPORT OUR NEW TEMPLATE vvv ---
import BirthdayTemplate1 from '@/components/templates/BirthdayTemplate1';
import WeddingTemplate1 from '@/components/templates/WeddingTemplate1';
import WeddingTemplate2 from '@/components/templates/WeddingTemplate2';
import IslamicWeddingTemplate from '@/components/templates/IslamicWeddingTemplate';
import NetflixTemplate from '@/components/templates/NetflixTemplate';
// --- ^^^ IMPORT OUR NEW TEMPLATE ^^^ ---

export const dynamic = 'force-dynamic';

export default async function InvitePage({ params }: { params: { id: string } }) {
  const supabase = createServerClient();

  const { data: invitationData } = await supabase
    .from('invitations')
    .select('custom_data, template_id')
    .eq('id', params.id)
    .single();

  if (!invitationData) {
    notFound();
  }
  
  // This switch statement now handles multiple designs
  switch (invitationData.template_id) {
    case 1:
      // If template_id is 1, show the Birthday design
      return <BirthdayTemplate1 invitationId={params.id} custom_data={invitationData.custom_data} />;
    
    // --- vvv ADD THIS NEW CASE vvv ---
    case 2:
      // If template_id is 2, show the Wedding design
      return <WeddingTemplate1 invitationId={params.id} custom_data={invitationData.custom_data} />;
    // --- ^^^ ADD THIS NEW CASE ^^^ ---
    case 5:
      return <WeddingTemplate2 invitationId={params.id} custom_data={invitationData.custom_data} />;
    case 6: 
          return <IslamicWeddingTemplate invitationId={params.id} custom_data={invitationData.custom_data} />;
    case 7:
      return <NetflixTemplate invitationId={params.id} custom_data={invitationData.custom_data} />;
    default:
      // The fallback message for any other template IDs
      return (
        <div className="text-center p-10">
          <h1 className="text-2xl font-bold">Template Not Found</h1>
          <p>A visual design has not been created for this invitation type yet.</p>
        </div>
      );
  }
}