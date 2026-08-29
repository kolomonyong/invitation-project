'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCountdown } from '@/hooks/useCountdown';
import RsvpForm from '../RsvpForm';
import toast from 'react-hot-toast';
import { InView, InViewSlideLeft, InViewSlideRight, InViewScale } from '@/components/motion/in-view';
import { TextEffect } from '@/components/motion/text-effect';
import { FloatingParticles } from '@/components/motion/floating-particles';

type WeddingTemplateProps = {
  invitationId: string;
  custom_data: {
    coverPhoto?: string;
    groomFullName?: string;
    groomParents?: string;
    groomPhoto?: string;
    brideFullName?: string;
    brideParents?: string;
    bridePhoto?: string;
    ceremonyDate?: string;
    ceremonyTime?: string;
    ceremonyVenue?: string;
    ceremonyAddress?: string;
    receptionDate?: string;
    receptionTime?: string;
    receptionVenue?: string;
    receptionAddress?: string;
    galleryPhoto1?: string;
    galleryPhoto2?: string;
    galleryPhoto3?: string;
    galleryPhoto4?: string;
    giftInfoBankName?: string;
    giftInfoBankAccount?: string;
    giftInfoAccountHolder?: string;
  };
};

const CountdownTimer = ({ targetDate }: { targetDate: string }) => {
  const { days, hours, minutes, seconds } = useCountdown(targetDate);
  if (days < 0 && hours < 0 && minutes < 0 && seconds < 0) {
    return <p className="text-xl">The event has begun!</p>;
  }
  const timeValue = (value: number) => <div className="text-4xl lg:text-5xl font-bold text-gray-800">{String(Math.max(0, value)).padStart(2, '0')}</div>;
  const timeLabel = (label: string) => <div className="text-xs uppercase text-gray-500 mt-1">{label}</div>;
  return (
    <div className="flex justify-center gap-4 sm:gap-8 text-center">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0 }} viewport={{ once: true }}>{timeValue(days)}{timeLabel('Days')}</motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} viewport={{ once: true }}>{timeValue(hours)}{timeLabel('Hours')}</motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} viewport={{ once: true }}>{timeValue(minutes)}{timeLabel('Minutes')}</motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} viewport={{ once: true }}>{timeValue(seconds)}{timeLabel('Seconds')}</motion.div>
    </div>
  );
};

const EventCard = ({ title, date, time, venue, address }: { title: string; date: string; time?: string; venue?: string; address?: string }) => {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address || venue || '')}`;
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
      <h3 className="text-2xl font-serif text-gray-800 mb-4">{title}</h3>
      <p className="font-bold">{date}</p>
      <p className="text-gray-600">{time}</p>
      <p className="mt-2 font-semibold">{venue}</p>
      <p className="text-gray-600 text-sm">{address}</p>
      <div className="mt-4 flex flex-col sm:flex-row gap-2">
        <a href="#" className="flex-1 bg-gray-200 text-gray-800 text-sm font-bold py-2 px-4 rounded-full hover:bg-gray-300 transition-colors">Add to Calendar</a>
        <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="flex-1 bg-gray-800 text-white text-sm font-bold py-2 px-4 rounded-full hover:bg-gray-900 transition-colors">View Location</a>
      </div>
    </div>
  );
};

export default function WeddingTemplate2({ invitationId, custom_data }: WeddingTemplateProps) {
  const [isOpen, setIsOpen] = useState(false);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Date TBD';
    return new Date(dateString).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleCopy = (text: string | undefined) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success("Account number copied to clipboard!");
  };

  const galleryPhotos = [
    custom_data.galleryPhoto1, custom_data.galleryPhoto2,
    custom_data.galleryPhoto3, custom_data.galleryPhoto4,
  ].filter(Boolean) as string[];

  // --- COVER PAGE ---
  if (!isOpen) {
    return (
      <div className="h-screen w-full flex flex-col justify-end items-center text-white p-8 text-center relative" style={{ fontFamily: "'Playfair Display', serif" }}>
        <div className="absolute inset-0 bg-black opacity-40 z-10" />
        {custom_data.coverPhoto && <img src={custom_data.coverPhoto} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />}
        <FloatingParticles count={15} color="#ffffff" minSize={1} maxSize={3} />
        <div className="relative z-20 pb-12">
          <TextEffect per="word" delay={0.3} className="text-lg mb-2" as="p">
            The Wedding Of
          </TextEffect>
          <TextEffect
            per="word"
            delay={0.8}
            className="text-5xl lg:text-7xl mb-8"
            as="h1"
            variants={{ hidden: { opacity: 0, y: 40, filter: 'blur(8px)' }, visible: { opacity: 1, y: 0, filter: 'blur(0px)' } }}
          >
            {`${custom_data.brideFullName || 'Bride'} & ${custom_data.groomFullName || 'Groom'}`}
          </TextEffect>
          <motion.button
            onClick={() => setIsOpen(true)}
            className="bg-white text-gray-800 font-bold py-3 px-8 rounded-full hover:bg-gray-200 transition-colors shadow-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.8, type: 'spring', bounce: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Open Invitation
          </motion.button>
        </div>
      </div>
    );
  }

  // --- MAIN INVITATION ---
  return (
    <AnimatePresence>
      <motion.div
        className="max-w-4xl mx-auto bg-gray-100 font-serif text-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Couple Introduction */}
        <section className="text-center py-20 px-4 relative bg-cover bg-center text-white" style={{ backgroundImage: `url(${custom_data.coverPhoto})` }}>
          <div className="absolute inset-0 bg-black opacity-50" />
          <div className="relative z-10">
            <InView transition={{ duration: 0.6 }}>
              <p className="mb-8 leading-relaxed">&ldquo;And so the adventure begins...&rdquo;</p>
            </InView>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
              <InViewSlideLeft transition={{ duration: 0.6, delay: 0.1 }}>
                <div className="flex flex-col items-center">
                  {custom_data.bridePhoto && (
                    <motion.img src={custom_data.bridePhoto} alt="Bride" className="w-32 h-32 rounded-full object-cover shadow-lg mb-4 border-4 border-white" whileHover={{ scale: 1.08 }} />
                  )}
                  <h2 className="text-3xl font-bold">{custom_data.brideFullName || 'Bride Name'}</h2>
                  <p className="text-sm mt-1 opacity-90">{custom_data.brideParents || 'Parents of the Bride'}</p>
                </div>
              </InViewSlideLeft>
              <InViewScale>
                <div className="text-4xl font-bold text-white opacity-80">&amp;</div>
              </InViewScale>
              <InViewSlideRight transition={{ duration: 0.6, delay: 0.1 }}>
                <div className="flex flex-col items-center">
                  {custom_data.groomPhoto && (
                    <motion.img src={custom_data.groomPhoto} alt="Groom" className="w-32 h-32 rounded-full object-cover shadow-lg mb-4 border-4 border-white" whileHover={{ scale: 1.08 }} />
                  )}
                  <h2 className="text-3xl font-bold">{custom_data.groomFullName || 'Groom Name'}</h2>
                  <p className="text-sm mt-1 opacity-90">{custom_data.groomParents || 'Parents of the Groom'}</p>
                </div>
              </InViewSlideRight>
            </div>
          </div>
        </section>

        {/* Countdown */}
        <section className="text-center py-16 px-4 bg-white">
          <InView>
            <h2 className="text-3xl mb-8">Counting Down The Days</h2>
            {custom_data.ceremonyDate && <CountdownTimer targetDate={custom_data.ceremonyDate} />}
          </InView>
        </section>

        {/* Event Details */}
        <section className="py-16 px-4">
          <InView>
            <h2 className="text-3xl text-center mb-8">Event Details</h2>
          </InView>
          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <InViewSlideLeft transition={{ duration: 0.5, delay: 0.1 }}>
              <EventCard title="Ceremony" date={formatDate(custom_data.ceremonyDate)} time={custom_data.ceremonyTime} venue={custom_data.ceremonyVenue} address={custom_data.ceremonyAddress} />
            </InViewSlideLeft>
            <InViewSlideRight transition={{ duration: 0.5, delay: 0.2 }}>
              <EventCard title="Reception" date={formatDate(custom_data.receptionDate || custom_data.ceremonyDate)} time={custom_data.receptionTime} venue={custom_data.receptionVenue} address={custom_data.receptionAddress} />
            </InViewSlideRight>
          </div>
        </section>

        {/* Gallery */}
        {galleryPhotos.length > 0 && (
          <section className="py-16 px-4 bg-white">
            <InView><h2 className="text-3xl text-center mb-8">Our Moments</h2></InView>
            <div className="max-w-3xl mx-auto grid grid-cols-2 gap-4">
              {galleryPhotos.map((photoUrl, index) => (
                <InView key={index} transition={{ duration: 0.5, delay: index * 0.1 }} variants={{ hidden: { opacity: 0, scale: 0.85 }, visible: { opacity: 1, scale: 1 } }}>
                  <motion.div className="rounded-lg overflow-hidden shadow-lg" whileHover={{ scale: 1.03 }}>
                    <img src={photoUrl} alt={`Gallery photo ${index + 1}`} className="w-full h-full object-cover aspect-square" />
                  </motion.div>
                </InView>
              ))}
            </div>
          </section>
        )}

        {/* Gift */}
        {custom_data.giftInfoBankName && (
          <section className="py-16 px-4">
            <InView>
              <h2 className="text-3xl text-center mb-2">Wedding Gift</h2>
              <p className="text-center text-gray-600 mb-8 max-w-xl mx-auto">Your presence at our wedding is the greatest gift of all. However, if you wish to honor us with a gift, you may do so.</p>
            </InView>
            <InViewScale transition={{ duration: 0.5, delay: 0.2 }}>
              <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg text-center">
                <p className="font-semibold">{custom_data.giftInfoBankName}</p>
                <p className="text-2xl font-bold my-2">{custom_data.giftInfoBankAccount}</p>
                <p className="text-gray-600 mb-4">On behalf of: {custom_data.giftInfoAccountHolder}</p>
                <motion.button
                  onClick={() => handleCopy(custom_data.giftInfoBankAccount)}
                  className="bg-gray-800 text-white text-sm font-bold py-2 px-6 rounded-full hover:bg-gray-900 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Copy Account Number
                </motion.button>
              </div>
            </InViewScale>
          </section>
        )}

        {/* RSVP */}
        <section className="py-16 px-4 bg-gray-200">
          <InView>
            <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-3xl text-center mb-8">Are You Attending?</h2>
              <RsvpForm invitationId={invitationId} />
            </div>
          </InView>
        </section>
      </motion.div>
    </AnimatePresence>
  );
}