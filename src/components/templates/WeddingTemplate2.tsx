'use client';

import { useState } from 'react';
import { useCountdown } from '@/hooks/useCountdown';
import RsvpForm from '../RsvpForm';
import toast from 'react-hot-toast';

// The props definition includes all fields from our "Modern Wedding Gala" JSON structure
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

// A small reusable component for the countdown display
const CountdownTimer = ({ targetDate }: { targetDate: string }) => {
    const { days, hours, minutes, seconds } = useCountdown(targetDate);
    
    // Prevent showing negative numbers if the date has passed
    if (days < 0 && hours < 0 && minutes < 0 && seconds < 0) {
      return <p className="text-xl">The event has begun!</p>;
    }
    
    const timeValue = (value: number) => <div className="text-4xl lg:text-5xl font-bold text-gray-800">{String(Math.max(0, value)).padStart(2, '0')}</div>;
    const timeLabel = (label: string) => <div className="text-xs uppercase text-gray-500 mt-1">{label}</div>;

    return (
        <div className="flex justify-center gap-4 sm:gap-8 text-center">
            <div>{timeValue(days)}{timeLabel('Days')}</div>
            <div>{timeValue(hours)}{timeLabel('Hours')}</div>
            <div>{timeValue(minutes)}{timeLabel('Minutes')}</div>
            <div>{timeValue(seconds)}{timeLabel('Seconds')}</div>
        </div>
    );
}

// A component for the event details card to avoid repetition
const EventCard = ({ title, date, time, venue, address }: { title: string, date: string, time?: string, venue?: string, address?: string }) => {
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address || venue || '')}`;
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-2xl font-serif text-gray-800 mb-4">{title}</h3>
            <p className="font-bold">{date}</p>
            <p className="text-gray-600">{time}</p>
            <p className="mt-2 font-semibold">{venue}</p>
            <p className="text-gray-600 text-sm">{address}</p>
            <div className="mt-4 flex flex-col sm:flex-row gap-2">
                {/* Note: "Add to Calendar" is a complex feature. This is a placeholder. */}
                <a href="#" className="flex-1 bg-gray-200 text-gray-800 text-sm font-bold py-2 px-4 rounded-full hover:bg-gray-300 transition-colors">Add to Calendar</a>
                <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="flex-1 bg-gray-800 text-white text-sm font-bold py-2 px-4 rounded-full hover:bg-gray-900 transition-colors">View Location</a>
            </div>
        </div>
    );
};


export default function WeddingTemplate2({ invitationId, custom_data }: WeddingTemplateProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);

  // Helper for formatting dates
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Date TBD';
    return new Date(dateString).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };
  
  const handleCopy = (text: string | undefined) => {
    if(!text) return;
    navigator.clipboard.writeText(text);
    toast.success("Account number copied to clipboard!");
  };

  // Create a clean array of only the gallery photos that have been provided
  const galleryPhotos = [
    custom_data.galleryPhoto1,
    custom_data.galleryPhoto2,
    custom_data.galleryPhoto3,
    custom_data.galleryPhoto4,
  ].filter(Boolean) as string[];

  // --- COVER PAGE ---
  if (!isOpen) {
    return (
      <div className="h-screen w-full flex flex-col justify-end items-center text-white p-8 text-center relative" style={{fontFamily: "'Playfair Display', serif"}}>
        <div className="absolute inset-0 bg-black opacity-40 z-10"></div>
        {custom_data.coverPhoto && <img src={custom_data.coverPhoto} alt="Cover" className="absolute inset-0 w-full h-full object-cover"/>}
        <div className="relative z-20 animate-fade-in pb-12">
          <p className="text-lg mb-2">The Wedding Of</p>
          <h1 className="text-5xl lg:text-7xl mb-8">
            {custom_data.brideFullName || 'Bride'} & {custom_data.groomFullName || 'Groom'}
          </h1>
          <button onClick={handleOpen} className="bg-white text-gray-800 font-bold py-3 px-8 rounded-full hover:bg-gray-200 transition-colors shadow-lg">
            Open Invitation
          </button>
        </div>
      </div>
    );
  }

  // --- MAIN INVITATION ---
  return (
    <div className="max-w-4xl mx-auto bg-gray-100 font-serif text-gray-700">
      
      {/* Couple Introduction Section with Background Image */}
      <section 
        className="text-center py-20 px-4 relative bg-cover bg-center text-white"
        style={{ backgroundImage: `url(${custom_data.coverPhoto})` }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10">
          <p className="mb-8 leading-relaxed">&ldquo;And so the adventure begins...&rdquo;</p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
              <div className="flex flex-col items-center">
                  {custom_data.bridePhoto && <img src={custom_data.bridePhoto} alt="Bride" className="w-32 h-32 rounded-full object-cover shadow-lg mb-4 border-4 border-white"/>}
                  <h2 className="text-3xl font-bold">{custom_data.brideFullName || 'Bride Name'}</h2>
                  <p className="text-sm mt-1 opacity-90">{custom_data.brideParents || 'Parents of the Bride'}</p>
              </div>
              <div className="text-4xl font-bold text-white opacity-80">&</div>
              <div className="flex flex-col items-center">
                  {custom_data.groomPhoto && <img src={custom_data.groomPhoto} alt="Groom" className="w-32 h-32 rounded-full object-cover shadow-lg mb-4 border-4 border-white"/>}
                  <h2 className="text-3xl font-bold">{custom_data.groomFullName || 'Groom Name'}</h2>
                  <p className="text-sm mt-1 opacity-90">{custom_data.groomParents || 'Parents of the Groom'}</p>
              </div>
          </div>
        </div>
      </section>

      {/* Countdown Section */}
      <section className="text-center py-16 px-4 bg-white">
        <h2 className="text-3xl mb-8">Counting Down The Days</h2>
        {custom_data.ceremonyDate && <CountdownTimer targetDate={custom_data.ceremonyDate} />}
      </section>

      {/* Event Details Section */}
      <section className="py-16 px-4">
        <h2 className="text-3xl text-center mb-8">Event Details</h2>
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <EventCard 
                title="Ceremony"
                date={formatDate(custom_data.ceremonyDate)}
                time={custom_data.ceremonyTime}
                venue={custom_data.ceremonyVenue}
                address={custom_data.ceremonyAddress}
            />
            <EventCard 
                title="Reception"
                date={formatDate(custom_data.receptionDate || custom_data.ceremonyDate)}
                time={custom_data.receptionTime}
                venue={custom_data.receptionVenue}
                address={custom_data.receptionAddress}
            />
        </div>
      </section>
      
      {/* Photo Gallery Section */}
      {galleryPhotos.length > 0 && (
        <section id="gallery" className="py-16 px-4 bg-white">
          <h2 className="text-3xl text-center mb-8">Our Moments</h2>
          <div className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-2 gap-4">
            {galleryPhotos.map((photoUrl, index) => (
              <div key={index} className="rounded-lg overflow-hidden shadow-lg">
                <img src={photoUrl} alt={`Gallery photo ${index + 1}`} className="w-full h-full object-cover aspect-square"/>
              </div>
            ))}
          </div>
        </section>
      )}
      
      {/* Wedding Gift Section */}
      {custom_data.giftInfoBankName && (
        <section id="gifts" className="py-16 px-4">
          <h2 className="text-3xl text-center mb-2">Wedding Gift</h2>
          <p className="text-center text-gray-600 mb-8 max-w-xl mx-auto">Your presence at our wedding is the greatest gift of all. However, if you wish to honor us with a gift, you may do so.</p>
          <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="font-semibold">{custom_data.giftInfoBankName}</p>
            <p className="text-2xl font-bold my-2">{custom_data.giftInfoBankAccount}</p>
            <p className="text-gray-600 mb-4">On behalf of: {custom_data.giftInfoAccountHolder}</p>
            <button 
              onClick={() => handleCopy(custom_data.giftInfoBankAccount)}
              className="bg-gray-800 text-white text-sm font-bold py-2 px-6 rounded-full hover:bg-gray-900 transition-colors"
            >
              Copy Account Number
            </button>
          </div>
        </section>
      )}

      {/* RSVP Section */}
      <section id="rsvp" className="py-16 px-4 bg-gray-200">
        <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl text-center mb-8">Are You Attending?</h2>
          <RsvpForm invitationId={invitationId} />
        </div>
      </section>
    </div>
  );
}