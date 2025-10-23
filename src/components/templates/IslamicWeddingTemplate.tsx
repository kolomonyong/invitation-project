'use client';

import { useState } from 'react';
import RsvpForm from '../RsvpForm';

// Define the shape of the data this component expects
type IslamicWeddingProps = {
  invitationId: string;
  custom_data: {
    coverPhoto?: string;
    quranVerse?: string;
    groomFullName?: string;
    groomParents?: string;
    brideFullName?: string;
    brideParents?: string;
    akadDate?: string;
    akadTime?: string;
    akadVenue?: string;
    receptionDate?: string;
    receptionTime?: string;
    receptionVenue?: string;
    closingVerse?: string;
  };
};

const EventCard = ({ title, date, time, venue }: { title: string, date: string, time?: string, venue?: string }) => (
    <div className="text-center">
        <h3 className="text-2xl font-semibold font-serif text-gray-800">{title}</h3>
        <p className="mt-2 text-lg">{date}</p>
        <p className="text-gray-600">{time}</p>
        <p className="mt-2 text-sm text-gray-500">{venue}</p>
    </div>
);

export default function IslamicWeddingTemplate({ invitationId, custom_data }: IslamicWeddingProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Date to be Announced';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!isOpen) {
    return (
      <div className="h-screen w-full flex flex-col justify-center items-center text-center p-8 relative bg-gray-800 text-white">
        {custom_data.coverPhoto && (
            <img src={custom_data.coverPhoto} alt="Cover" className="absolute inset-0 w-full h-full object-cover opacity-30"/>
        )}
        <div className="relative z-10">
            <p className="text-lg">The Wedding Of</p>
            <h1 className="text-5xl font-serif my-4">{custom_data.brideFullName} &amp; {custom_data.groomFullName}</h1>
            <button
                onClick={handleOpen}
                className="mt-4 bg-white text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-200 transition-colors"
            >
                Open Invitation
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-gray-50 font-sans text-gray-700">
        {/* Bismillah Header */}
        <header className="py-12 text-center bg-gray-100">
            <h2 className="text-3xl font-serif text-gray-800">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</h2>
            <p className="mt-2 text-sm">In the name of Allah, the Most Gracious, the Most Merciful.</p>
        </header>

        <main className="p-6 md:p-10">
            {/* Quran Verse */}
            <section className="text-center mb-12">
                <p className="italic text-gray-600">&ldquo;{custom_data.quranVerse || 'And of His signs is that He created for you from yourselves mates that you may find tranquillity in them; and He placed between you affection and mercy. Indeed in that are signs for a people who give thought.'}&rdquo;</p>
                <p className="mt-2 font-semibold">(Ar-Rum: 21)</p>
            </section>

            {/* Couple Introduction */}
            <section className="text-center mb-12">
                <p className="mb-2">Assalamualaikum Warahmatullahi Wabarakatuh</p>
                <p>With gratitude and the grace of Allah SWT, we joyfully announce the wedding of our beloved children:</p>
                
                <div className="my-8 space-y-8">
                    <div>
                        <h3 className="text-4xl font-serif text-gray-900">{custom_data.brideFullName}</h3>
                        <p className="mt-1 text-sm">{custom_data.brideParents}</p>
                    </div>
                    <p className="text-4xl font-serif text-gray-400">&amp;</p>
                    <div>
                        <h3 className="text-4xl font-serif text-gray-900">{custom_data.groomFullName}</h3>
                        <p className="mt-1 text-sm">{custom_data.groomParents}</p>
                    </div>
                </div>
            </section>

            {/* Event Details */}
            <section className="mb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-b py-8">
                    <EventCard 
                        title="Akad Nikah"
                        date={formatDate(custom_data.akadDate)}
                        time={custom_data.akadTime}
                        venue={custom_data.akadVenue}
                    />
                    <EventCard 
                        title="Walimatul Ursy"
                        date={formatDate(custom_data.receptionDate)}
                        time={custom_data.receptionTime}
                        venue={custom_data.receptionVenue}
                    />
                </div>
            </section>

            {/* Closing */}
            <section className="text-center mb-12">
                <p>It is a great honor for us if you could attend and give your blessings.</p>
                <p className="mt-4 font-semibold">{custom_data.closingVerse || 'Wassalamualaikum Warahmatullahi Wabarakatuh'}</p>
            </section>

            {/* RSVP Section */}
            <section className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center mb-4">RSVP</h2>
                <RsvpForm invitationId={invitationId} />
            </section>
        </main>
    </div>
  );
}