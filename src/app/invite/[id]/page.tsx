import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCachedInvitation } from '@/lib/cache';

// --- vvv IMPORT OUR NEW TEMPLATE vvv ---
import BirthdayTemplate1 from '@/components/templates/BirthdayTemplate1';
import WeddingTemplate1 from '@/components/templates/WeddingTemplate1';
import WeddingTemplate2 from '@/components/templates/WeddingTemplate2';
import IslamicWeddingTemplate from '@/components/templates/IslamicWeddingTemplate';
import NetflixTemplate from '@/components/templates/NetflixTemplate';
import ElegantWeddingTemplate from '@/components/templates/ElegantWeddingTemplate';
// --- ^^^ IMPORT OUR NEW TEMPLATE ^^^ ---

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{
    [x: string]: string;
    id: string;
  }>;
};

// ─── SEO / Open Graph Metadata ───────────────────────────────────────────────
export async function generateMetadata(props: Props): Promise<Metadata> {
  const { id } = await props.params;
  const data = await getCachedInvitation(id);

  const templateInfo = Array.isArray(data?.templates)
    ? data?.templates[0]
    : data?.templates;

  const eventName: string =
    data?.custom_data?.bride_name && data?.custom_data?.groom_name
      ? `${data.custom_data.bride_name} & ${data.custom_data.groom_name}`
      : data?.custom_data?.title || templateInfo?.name || 'You\'re Invited!';

  const eventDate: string = data?.custom_data?.date
    ? ` on ${data.custom_data.date}`
    : '';

  const description = `You are cordially invited to celebrate ${eventName}${eventDate}. Open to see the full invitation and RSVP.`;
  const ogImage = templateInfo?.preview_image_url || '/og-default.png';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://invitation-project-ten.vercel.app';

  return {
    title: `${eventName} — Digital Invitation`,
    description,
    openGraph: {
      title: `${eventName} — Digital Invitation`,
      description,
      url: `${siteUrl}/invite/${id}`,
      type: 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: eventName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${eventName} — Digital Invitation`,
      description,
      images: [ogImage],
    },
  };
}



export default async function InvitePage(props: Props) {
  // Await params in Next.js 15
  const { id } = await props.params;

  const invitationData = await getCachedInvitation(id);

  if (!invitationData) {
    console.error("Error fetching invitation:", id);
    notFound();
  }
  
  // This switch statement now handles multiple designs
  switch (invitationData.template_id) {
    case 1:
      // If template_id is 1, show the Birthday design
      return <BirthdayTemplate1 invitationId={id} custom_data={invitationData.custom_data} />;
    
    // --- vvv ADD THIS NEW CASE vvv ---
    case 2:
      // If template_id is 2, show the Wedding design
      return <WeddingTemplate1 invitationId={id} custom_data={invitationData.custom_data} />;
    // --- ^^^ ADD THIS NEW CASE ^^^ ---
    case 5:
      return <WeddingTemplate2 invitationId={id} custom_data={invitationData.custom_data} />;
    case 6: 
          return <IslamicWeddingTemplate invitationId={id} custom_data={invitationData.custom_data} />;
    case 7:
      return <NetflixTemplate invitationId={id} custom_data={invitationData.custom_data} />;
    case 8:
      return <ElegantWeddingTemplate invitationId={id} custom_data={invitationData.custom_data} />;
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