'use client';

import { JSX } from 'react';
import RsvpForm from '../RsvpForm';

// The props definition is updated to match our new JSON structure
type WeddingTemplateProps = {
  invitationId: string;
  custom_data: {
    partnerOneName?: string;
    partnerTwoName?: string;
    eventDate?: string;
    eventTime?: string;
    venueName?: string;
    venueAddress?: string;
    couplePhoto?: string;
    brideMessage?: string;
    groomMessage?: string;
  };
};

// A small component for the detail icons to keep the code clean
const DetailItem = ({ icon, text }: { icon: JSX.Element, text: string | undefined }) => (
  <div className="flex items-center justify-center gap-2 text-gray-700">
    {icon}
    <span>{text || 'TBD'}</span>
  </div>
);

export default function WeddingTemplate1({ invitationId, custom_data }: WeddingTemplateProps) {
  const formattedDate = custom_data.eventDate 
    ? new Date(custom_data.eventDate).toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric',
        year: 'numeric'
      }) 
    : 'Date to be Announced';

  return (
    <div className="bg-white font-lato">
      <div className="max-w-md mx-auto bg-[#fedfe3] min-h-screen relative">
        
        {/* Fixed Header */}
        <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-md h-[55px] bg-[#fedfe3] flex items-center justify-center shadow-md z-50">
            <h1 className="font-lato text-2xl text-[#965a00]">
                {custom_data.partnerOneName?.charAt(0) || 'P1'} &amp; {custom_data.partnerTwoName?.charAt(0) || 'P2'}
            </h1>
        </header>

        <main className="pt-[55px]">
            {/* Hero Image */}
            {custom_data.couplePhoto && (
                <img src={custom_data.couplePhoto} alt="Couple" className="w-full h-64 object-cover"/>
            )}

            {/* Couple Names */}
            <section className="text-center py-8">
                <h2 className="font-lato text-3xl font-bold text-[#965a00]">
                    {custom_data.partnerOneName || 'Partner One'} &amp; {custom_data.partnerTwoName || 'Partner Two'}
                </h2>
                <p className="text-lg text-gray-700 tracking-widest">THE WEDDING</p>
            </section>

            {/* Event Details Card */}
            <section className="mx-4">
                <div className="bg-white rounded-lg p-6 shadow-lg">
                    <h3 className="text-center font-lato text-xl text-[#965a00] font-bold mb-4">WEDDING CEREMONY</h3>
                    <div className="space-y-3">
                        <DetailItem 
                            icon={<svg className="w-5 h-5" viewBox="0 0 15 15"><path fill="currentColor" d="M11.854 13.833a1.979 1.979 0 1 0 0-3.958a1.979 1.979 0 0 0 0 3.958Zm.396-3.364v.826l.28.28a.401.401 0 0 1-.566.566l-.512-.512v-1.154a.4.4 0 0 1 .8-.006Z M1.563 1.563a1.187 1.187 0 0 0-1.188 1.187v9.5c0 .655.532 1.187 1.188 1.187h8.017a2.766 2.766 0 0 1-.225-1.583a2.75 2.75 0 0 1 .225-.792H1.167V2.75c0-.105.042-.206.117-.28c.075-.075.176-.118.28-.118h2.375v.792h-2.375ZM11.458 9.11a2.766 2.766 0 0 1 .026-1.584V2.75a.4.4 0 0 0-.4-.4h-1.583v-.791h1.583c.655 0 1.188.532 1.188 1.187v6.36ZM4.333 1.562h4.563v.792H4.333v-.792ZM1.167 4.333h11.083v.792H1.167v-.792Z"/></svg>}
                            text={formattedDate}
                        />
                         <DetailItem 
                            icon={<svg className="w-5 h-5" viewBox="0 0 10 10"><path fill="currentColor" d="M5 0a5 5 0 1 0 0 10A5 5 0 0 0 5 0Zm0 9a4 4 0 1 1 0-8a4 4 0 0 1 0 8Zm.25-6.5h-.5v3l2.625 1.575l.25-.615L5.25 5.125V2.5Z"/></svg>}
                            text={custom_data.eventTime}
                        />
                         <DetailItem 
                            icon={<svg className="w-5 h-5" viewBox="0 0 16 21"><path fill="currentColor" d="M8 0.917C3.8 0.917 0 4.003 0 8.775c0 3.182 2.67 6.948 8 11.308c5.33-4.36 8-8.126 8-11.308C16 4.003 12.2 0.917 8 0.917Zm0 9.583c-1.1 0-2-.863-2-1.917c0-1.054.9-1.916 2-1.916s2 .862 2 1.916c0 1.054-.9 1.917-2 1.917Z"/></svg>}
                            text={`${custom_data.venueName}, ${custom_data.venueAddress}`}
                        />
                    </div>
                </div>
            </section>
            
            {/* Messages Section */}
            <section className="mx-4 mt-8 space-y-6">
                <div className="bg-white rounded-lg shadow-lg">
                    <div className="bg-[#c39aa0] text-white p-3 rounded-t-lg font-bold font-lato text-center">Message from {custom_data.partnerOneName || 'Partner One'}</div>
                    <p className="p-4 text-gray-600 text-sm">{custom_data.brideMessage || "Looking forward to celebrating our special day with you."}</p>
                </div>
                <div className="bg-white rounded-lg shadow-lg">
                    <div className="bg-[#c39aa0] text-white p-3 rounded-t-lg font-bold font-lato text-center">Message from {custom_data.partnerTwoName || 'Partner Two'}</div>
                    <p className="p-4 text-gray-600 text-sm">{custom_data.groomMessage || "Your presence is the greatest gift of all."}</p>
                </div>
            </section>

            {/* RSVP Section */}
            <section className="mx-4 mt-8">
                <div className="bg-white rounded-lg p-6 shadow-lg">
                    <h3 className="text-center font-lato text-xl text-[#965a00] font-bold mb-4">RSVP</h3>
                    <RsvpForm invitationId={invitationId} />
                </div>
            </section>
            
            {/* Guestbook Section (Visual Placeholder) */}
            <section className="mx-4 my-8">
                <div className="bg-white rounded-lg p-6 shadow-lg">
                    <h3 className="text-center font-lato text-xl text-[#965a00] font-bold mb-4">Guestbook</h3>
                    <div className="space-y-4">
                        <div className="border-b pb-2">
                            <p className="font-bold">Aunt Carol</p>
                            <p className="text-sm text-gray-600">So excited for both of you! Can&apos;t wait to celebrate!</p>
                        </div>
                        <div className="border-b pb-2">
                            <p className="font-bold">John Doe</p>
                            <p className="text-sm text-gray-600">Congratulations! Wishing you a lifetime of happiness.</p>
                        </div>
                    </div>
                     {/* A non-functional input as a placeholder */}
                    <div className="mt-4 flex gap-2">
                        <input type="text" placeholder="Leave a message..." className="flex-1 p-2 border rounded" disabled />
                        <button className="px-4 py-2 bg-gray-300 text-white rounded" disabled>Send</button>
                    </div>
                </div>
            </section>

        </main>
      </div>
    </div>
  );
}