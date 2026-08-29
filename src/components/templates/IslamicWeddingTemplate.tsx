'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import RsvpForm from '../RsvpForm';
import { InView, InViewSlideLeft, InViewSlideRight, InViewScale } from '@/components/motion/in-view';
import { TextEffect } from '@/components/motion/text-effect';

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
    <div className="text-center bg-white p-6 rounded-lg shadow-md h-full">
        <h3 className="text-2xl font-semibold font-serif text-gray-800 mb-4">{title}</h3>
        <p className="mt-2 text-lg font-bold">{date}</p>
        <p className="text-gray-600">{time}</p>
        <p className="mt-2 text-sm text-gray-500 font-medium">{venue}</p>
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
      <div className="h-screen w-full flex flex-col justify-center items-center text-center p-8 relative bg-gray-900 text-white overflow-hidden">
        {custom_data.coverPhoto && (
            <motion.img 
                src={custom_data.coverPhoto} 
                alt="Cover" 
                className="absolute inset-0 w-full h-full object-cover opacity-30"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
            />
        )}
        <div className="relative z-10">
            <TextEffect as="p" per="word" delay={0.3} className="text-lg text-gray-300">The Wedding Of</TextEffect>
            <TextEffect 
                as="h1" 
                per="word" 
                delay={0.8} 
                className="text-5xl md:text-7xl font-serif my-6 text-[#d4af37]"
                variants={{ hidden: { opacity: 0, y: 30, filter: 'blur(6px)' }, visible: { opacity: 1, y: 0, filter: 'blur(0px)' } }}
            >
                {`${custom_data.brideFullName || 'Bride'} & ${custom_data.groomFullName || 'Groom'}`}
            </TextEffect>
            <motion.button
                onClick={handleOpen}
                className="mt-6 bg-[#d4af37] text-gray-900 font-bold py-3 px-8 rounded-lg hover:bg-[#b08d26] transition-colors shadow-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.8, type: 'spring', bounce: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                Buka Undangan
            </motion.button>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence>
        <motion.div 
            className="max-w-2xl mx-auto bg-gray-50 font-sans text-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            {/* Bismillah Header */}
            <header className="py-16 text-center bg-gray-100 border-b border-gray-200">
                <InView>
                    <h2 className="text-4xl font-serif text-gray-800 mb-4 tracking-wide text-[#d4af37]">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</h2>
                    <p className="mt-2 text-sm text-gray-600 italic">In the name of Allah, the Most Gracious, the Most Merciful.</p>
                </InView>
            </header>

            <main className="p-6 md:p-10 space-y-16">
                {/* Quran Verse */}
                <section className="text-center relative">
                    <InViewScale transition={{ duration: 0.6 }}>
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#d4af37] opacity-20 text-8xl font-serif">"</div>
                        <p className="italic text-gray-600 leading-relaxed pt-8 px-4 text-lg">
                            &ldquo;{custom_data.quranVerse || 'And of His signs is that He created for you from yourselves mates that you may find tranquillity in them; and He placed between you affection and mercy. Indeed in that are signs for a people who give thought.'}&rdquo;
                        </p>
                        <p className="mt-4 font-semibold text-[#d4af37]">(Ar-Rum: 21)</p>
                    </InViewScale>
                </section>

                {/* Couple Introduction */}
                <section className="text-center">
                    <InView transition={{ delay: 0.1 }}>
                        <p className="mb-4 text-lg font-serif">Assalamualaikum Warahmatullahi Wabarakatuh</p>
                        <p className="text-gray-600 max-w-lg mx-auto">With gratitude and the grace of Allah SWT, we joyfully announce the wedding of our beloved children:</p>
                    </InView>
                    
                    <div className="my-12 space-y-12">
                        <InViewSlideLeft transition={{ duration: 0.6, delay: 0.2 }}>
                            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="text-4xl font-serif text-gray-900 mb-2">{custom_data.brideFullName}</h3>
                                <p className="mt-1 text-sm text-gray-500 uppercase tracking-widest">{custom_data.brideParents}</p>
                            </div>
                        </InViewSlideLeft>
                        
                        <InViewScale>
                            <p className="text-4xl font-serif text-[#d4af37]">&amp;</p>
                        </InViewScale>

                        <InViewSlideRight transition={{ duration: 0.6, delay: 0.2 }}>
                            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="text-4xl font-serif text-gray-900 mb-2">{custom_data.groomFullName}</h3>
                                <p className="mt-1 text-sm text-gray-500 uppercase tracking-widest">{custom_data.groomParents}</p>
                            </div>
                        </InViewSlideRight>
                    </div>
                </section>

                {/* Event Details */}
                <section>
                    <InView>
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-serif text-gray-800">Wedding Events</h2>
                            <div className="w-16 h-1 bg-[#d4af37] mx-auto mt-4 rounded-full"></div>
                        </div>
                    </InView>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <InViewSlideLeft transition={{ duration: 0.5, delay: 0.1 }}>
                            <EventCard 
                                title="Akad Nikah"
                                date={formatDate(custom_data.akadDate)}
                                time={custom_data.akadTime}
                                venue={custom_data.akadVenue}
                            />
                        </InViewSlideLeft>
                        <InViewSlideRight transition={{ duration: 0.5, delay: 0.2 }}>
                            <EventCard 
                                title="Walimatul Ursy"
                                date={formatDate(custom_data.receptionDate)}
                                time={custom_data.receptionTime}
                                venue={custom_data.receptionVenue}
                            />
                        </InViewSlideRight>
                    </div>
                </section>

                {/* Closing */}
                <section className="text-center py-8">
                    <InView>
                        <p className="text-gray-600 max-w-lg mx-auto">It is a great honor for us if you could attend and give your blessings.</p>
                        <p className="mt-6 font-semibold text-lg text-gray-800 font-serif">{custom_data.closingVerse || 'Wassalamualaikum Warahmatullahi Wabarakatuh'}</p>
                    </InView>
                </section>

                {/* RSVP Section */}
                <section className="pb-8">
                    <InView>
                        <div className="bg-white p-8 rounded-xl shadow-md border-t-4 border-[#d4af37]">
                            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Kehadiran</h2>
                            <RsvpForm invitationId={invitationId} />
                        </div>
                    </InView>
                </section>
            </main>
        </motion.div>
    </AnimatePresence>
  );
}