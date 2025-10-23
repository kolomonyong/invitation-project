'use client';

import { useState } from 'react';
import Image from 'next/image';
import RsvpForm from '../RsvpForm';
import YouTube from 'react-youtube';

// Define the shape of the data this component expects
type NetflixTemplateProps = {
  readonly invitationId: string;
  readonly custom_data: {
    readonly moviePoster?: string;
    readonly movieTitle?: string;
    readonly coupleNames?: string;
    readonly tagline?: string;
    readonly synopsis?: string;
    readonly groomPhoto?: string;
    readonly groomName?: string;
    readonly groomParents?: string;
    readonly bridePhoto?: string;
    readonly brideName?: string;
    readonly brideParents?: string;
    readonly eventDate?: string;
    readonly eventTime?: string;
    readonly eventVenue?: string;
    readonly youtubeTrailerId?: string;
    readonly galleryPhoto1?: string;
    readonly galleryPhoto2?: string;
    readonly galleryPhoto3?: string;
    readonly galleryPhoto4?: string;
    readonly galleryPhoto5?: string;
    readonly galleryPhoto6?: string;
  };
};

export default function NetflixTemplate({ invitationId, custom_data }: NetflixTemplateProps) {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => setIsOpen(true);

  const galleryPhotos = [
    custom_data.galleryPhoto1, custom_data.galleryPhoto2, custom_data.galleryPhoto3,
    custom_data.galleryPhoto4, custom_data.galleryPhoto5, custom_data.galleryPhoto6,
  ].filter(Boolean) as string[];

  if (!isOpen) {
    // --- COVER PAGE ---
    return (
      <div className="h-screen w-full flex flex-col justify-end items-center text-white p-8 text-center relative bg-black">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent z-10"></div>
        {custom_data.moviePoster && (
          <Image 
            src={custom_data.moviePoster} 
            alt="Movie Poster" 
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="relative z-20">
          <p className="font-bebas text-2xl text-gray-300">{custom_data.movieTitle || 'The Wedding Of'}</p>
          <h1 className="font-bebas text-7xl text-red-600 mb-4 tracking-wider">{custom_data.coupleNames || 'The Couple'}</h1>
          <button onClick={handleOpen} className="bg-red-600 text-white font-bold py-3 px-12 rounded-md hover:bg-red-700 transition-colors text-lg">
            Open Invitation
          </button>
        </div>
      </div>
    );
  }

  // --- MAIN INVITATION ---
  return (
    <div className="bg-black text-white font-sans">
      
      <section className="relative h-[80vh] flex flex-col justify-end p-8 text-white">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-10"></div>
        {custom_data.moviePoster && (
          <Image 
            src={custom_data.moviePoster} 
            alt="Movie Poster" 
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="relative z-20">
            <p className="font-bebas text-3xl">{custom_data.movieTitle || 'The Wedding Of'}</p>
            <h2 className="font-bebas text-8xl text-red-600 tracking-wider -ml-1">{custom_data.coupleNames || 'The Couple'}</h2>
            <p className="mt-2 text-gray-300 max-w-lg">{custom_data.tagline || 'A love story for the ages.'}</p>
        </div>
      </section>

      <section className="bg-red-600 text-black font-bebas text-2xl py-2 overflow-hidden whitespace-nowrap">
        <div className="animate-marquee">
            <span className="mx-8">BREAKING NEWS: {custom_data.coupleNames} ARE GETTING MARRIED!</span>
            <span className="mx-8">SAVE THE DATE: {new Date(custom_data.eventDate || '').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span className="mx-8">BREAKING NEWS: {custom_data.coupleNames} ARE GETTING MARRIED!</span>
        </div>
      </section>

      <section className="p-8 md:p-12">
        <h3 className="font-bebas text-4xl mb-4">Synopsis</h3>
        <p className="text-gray-400 leading-relaxed">{custom_data.synopsis || 'Join us as we celebrate the beginning of our forever.'}</p>
      </section>

      <section className="p-8 md:p-12 bg-[#141414]">
        <h3 className="font-bebas text-4xl mb-8">The Cast</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center">
                {custom_data.bridePhoto && (
                  <div className="relative w-32 h-32 rounded-full mx-auto mb-4 border-4 border-gray-700 overflow-hidden">
                    <Image 
                      src={custom_data.bridePhoto} 
                      alt="Bride" 
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <h4 className="font-bebas text-3xl">{custom_data.brideName}</h4>
                <p className="text-sm text-gray-500">{custom_data.brideParents}</p>
            </div>
            <div className="text-center">
                {custom_data.groomPhoto && (
                  <div className="relative w-32 h-32 rounded-full mx-auto mb-4 border-4 border-gray-700 overflow-hidden">
                    <Image 
                      src={custom_data.groomPhoto} 
                      alt="Groom" 
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <h4 className="font-bebas text-3xl">{custom_data.groomName}</h4>
                <p className="text-sm text-gray-500">{custom_data.groomParents}</p>
            </div>
        </div>
      </section>

      <section className="p-8 md:p-12">
        <h3 className="font-bebas text-4xl mb-4">Premiere Details</h3>
        <p><span className="font-bold">Date:</span> {new Date(custom_data.eventDate || '').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <p><span className="font-bold">Showtime:</span> {custom_data.eventTime}</p>
        <p><span className="font-bold">Cinema:</span> {custom_data.eventVenue}</p>
      </section>

      {custom_data.youtubeTrailerId && (
        <section className="p-8 md:p-12 bg-[#141414]">
            <h3 className="font-bebas text-4xl mb-8">Official Trailer</h3>
            <div className="aspect-video">
                <YouTube 
                  videoId={custom_data.youtubeTrailerId} 
                  opts={{
                    width: '100%',
                    height: '100%',
                    playerVars: {
                      autoplay: 1,
                      controls: 1,
                    },
                  }}
                  className="w-full h-full" 
                />
            </div>
        </section>
      )}

      {galleryPhotos.length > 0 && (
        <section className="p-8 md:p-12">
          <h3 className="font-bebas text-4xl mb-8">Behind the Scenes</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {galleryPhotos.map((photo, index) => (
              <div key={`gallery-${photo}-${index}`} className="relative aspect-square">
                <Image 
                  src={photo} 
                  alt={`Scene ${index + 1}`} 
                  fill
                  className="object-cover rounded-md"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="p-8 md:p-12 bg-[#141414]">
        <h3 className="font-bebas text-4xl mb-8 text-center">Join The Premiere</h3>
        <div className="max-w-lg mx-auto bg-black p-8 rounded-lg">
            <RsvpForm invitationId={invitationId} />
        </div>
      </section>

      <footer className="text-center p-8 text-xs text-gray-600">
        <p>A NIKAHFLIX ORIGINAL PRODUCTION</p>
      </footer>
    </div>
  );
}