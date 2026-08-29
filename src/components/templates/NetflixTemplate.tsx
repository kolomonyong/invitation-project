'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import RsvpForm from '../RsvpForm';
import YouTube from 'react-youtube';
import { InView, InViewSlideLeft, InViewSlideRight, InViewScale } from '@/components/motion/in-view';
import { TextEffect } from '@/components/motion/text-effect';

// Helper to extract YouTube ID from full URL or just return the ID
const extractYouTubeId = (url: string | undefined): string | null => {
  if (!url) return null;
  // If it's just an 11-character ID, return it
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
  
  // Try to match standard YouTube URLs
  const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
};

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

  const trailerId = useMemo(() => extractYouTubeId(custom_data.youtubeTrailerId), [custom_data.youtubeTrailerId]);

  if (!isOpen) {
    // --- COVER PAGE ---
    return (
      <div className="h-screen w-full flex flex-col justify-end items-center text-white p-8 text-center relative bg-black overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent z-10"></div>
        {custom_data.moviePoster && (
          <motion.div 
            className="absolute inset-0"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
          >
            <Image 
                src={custom_data.moviePoster} 
                alt="Movie Poster" 
                fill
                className="object-cover"
                priority
            />
          </motion.div>
        )}
        <div className="relative z-20 pb-12 w-full max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded mb-4 inline-block font-sans">N SERIES</span>
            </motion.div>
            <TextEffect as="p" per="word" delay={0.8} className="font-bebas text-3xl md:text-4xl text-gray-300 tracking-widest">{custom_data.movieTitle || 'The Wedding Of'}</TextEffect>
            <TextEffect 
                as="h1" 
                per="word" 
                delay={1.3} 
                className="font-bebas text-6xl md:text-8xl text-red-600 mb-6 tracking-wider uppercase drop-shadow-2xl"
                variants={{ hidden: { opacity: 0, scale: 0.8, y: 20 }, visible: { opacity: 1, scale: 1, y: 0 } }}
            >
                {custom_data.coupleNames || 'The Couple'}
            </TextEffect>
            <motion.button 
                onClick={handleOpen} 
                className="bg-white text-black font-bold py-3 px-12 rounded hover:bg-gray-200 transition-colors text-lg flex items-center justify-center gap-2 mx-auto font-sans"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2, type: 'spring', bounce: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                Play Trailer
            </motion.button>
        </div>
      </div>
    );
  }

  // --- MAIN INVITATION ---
  return (
    <AnimatePresence>
        <motion.div 
            className="bg-black text-white font-sans min-h-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
        
        <section className="relative h-[70vh] flex flex-col justify-end p-8 md:p-16 text-white overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent z-10 w-1/2"></div>
            {custom_data.moviePoster && (
            <motion.div 
                className="absolute inset-0"
                initial={{ scale: 1.05 }}
                animate={{ scale: 1 }}
                transition={{ duration: 10, ease: "linear" }}
            >
                <Image 
                    src={custom_data.moviePoster} 
                    alt="Movie Poster" 
                    fill
                    className="object-cover object-top"
                    priority
                />
            </motion.div>
            )}
            <div className="relative z-20 max-w-2xl">
                <InView>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-red-600 font-black text-3xl leading-none">N</span>
                        <span className="text-gray-400 font-bold tracking-widest text-sm">ORIGINAL DOCUMENTARY</span>
                    </div>
                </InView>
                <InView transition={{ delay: 0.2 }}>
                    <h2 className="font-bebas text-7xl md:text-9xl text-white tracking-wider -ml-1 uppercase drop-shadow-lg leading-none">{custom_data.coupleNames || 'The Couple'}</h2>
                </InView>
                <InView transition={{ delay: 0.4 }}>
                    <div className="flex items-center gap-4 text-sm font-semibold text-gray-300 my-4">
                        <span className="text-green-500 font-bold">98% Match</span>
                        <span>{new Date(custom_data.eventDate || '').getFullYear() || '2025'}</span>
                        <span className="border border-gray-600 px-1 rounded text-xs">PG-13</span>
                        <span>1h 45m</span>
                    </div>
                    <p className="mt-2 text-lg text-gray-200 max-w-lg leading-snug drop-shadow-md font-medium">{custom_data.tagline || 'A love story for the ages.'}</p>
                </InView>
            </div>
        </section>

        <section className="bg-red-600 text-black font-bebas text-2xl py-3 overflow-hidden whitespace-nowrap shadow-[0_0_20px_rgba(220,38,38,0.5)]">
            <div className="animate-marquee inline-block">
                <span className="mx-8">BREAKING NEWS: {custom_data.coupleNames} ARE GETTING MARRIED!</span>
                <span className="mx-8">SAVE THE DATE: {new Date(custom_data.eventDate || '').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <span className="mx-8">BREAKING NEWS: {custom_data.coupleNames} ARE GETTING MARRIED!</span>
                <span className="mx-8">SAVE THE DATE: {new Date(custom_data.eventDate || '').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
        </section>

        <section className="p-8 md:p-16 max-w-6xl mx-auto border-b border-gray-800">
            <InView>
                <h3 className="font-bold text-gray-500 text-lg uppercase tracking-wider mb-2">Synopsis</h3>
                <p className="text-xl md:text-2xl text-white leading-relaxed font-light">{custom_data.synopsis || 'Join us as we celebrate the beginning of our forever.'}</p>
            </InView>
        </section>

        <section className="p-8 md:p-16 max-w-6xl mx-auto">
            <InView>
                <h3 className="font-bebas text-4xl mb-8 text-gray-400">Starring</h3>
            </InView>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <InViewSlideLeft transition={{ duration: 0.6 }}>
                    <div className="flex items-center gap-6 bg-[#141414] p-6 rounded-lg hover:bg-[#202020] transition-colors cursor-pointer group">
                        {custom_data.bridePhoto ? (
                            <div className="relative w-24 h-24 rounded-full overflow-hidden flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                <Image src={custom_data.bridePhoto} alt="Bride" fill className="object-cover" />
                            </div>
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-gray-800 flex-shrink-0"></div>
                        )}
                        <div>
                            <h4 className="font-bebas text-3xl text-white group-hover:text-red-500 transition-colors">{custom_data.brideName}</h4>
                            <p className="text-sm text-gray-400 mt-1 uppercase tracking-wider">As The Bride</p>
                            <p className="text-xs text-gray-500 mt-1">{custom_data.brideParents}</p>
                        </div>
                    </div>
                </InViewSlideLeft>
                <InViewSlideRight transition={{ duration: 0.6 }}>
                    <div className="flex items-center gap-6 bg-[#141414] p-6 rounded-lg hover:bg-[#202020] transition-colors cursor-pointer group">
                        {custom_data.groomPhoto ? (
                            <div className="relative w-24 h-24 rounded-full overflow-hidden flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                <Image src={custom_data.groomPhoto} alt="Groom" fill className="object-cover" />
                            </div>
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-gray-800 flex-shrink-0"></div>
                        )}
                        <div>
                            <h4 className="font-bebas text-3xl text-white group-hover:text-red-500 transition-colors">{custom_data.groomName}</h4>
                            <p className="text-sm text-gray-400 mt-1 uppercase tracking-wider">As The Groom</p>
                            <p className="text-xs text-gray-500 mt-1">{custom_data.groomParents}</p>
                        </div>
                    </div>
                </InViewSlideRight>
            </div>
        </section>

        <section className="p-8 md:p-16 bg-[#141414]">
            <div className="max-w-6xl mx-auto">
                <InView>
                    <h3 className="font-bebas text-4xl mb-8">Premiere Details</h3>
                </InView>
                <InViewScale>
                    <div className="bg-black/50 border border-gray-800 p-8 rounded-xl backdrop-blur-sm">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                            <div>
                                <p className="text-gray-500 text-sm uppercase tracking-wider mb-2">Date</p>
                                <p className="text-2xl font-bold">{new Date(custom_data.eventDate || '').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>
                            <div className="md:border-l md:border-r border-gray-800">
                                <p className="text-gray-500 text-sm uppercase tracking-wider mb-2">Showtime</p>
                                <p className="text-2xl font-bold">{custom_data.eventTime}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm uppercase tracking-wider mb-2">Cinema</p>
                                <p className="text-2xl font-bold">{custom_data.eventVenue}</p>
                            </div>
                        </div>
                    </div>
                </InViewScale>
            </div>
        </section>

        {trailerId && (
            <section className="p-8 md:p-16 max-w-6xl mx-auto">
                <InView>
                    <h3 className="font-bebas text-4xl mb-8">Official Trailer</h3>
                </InView>
                <InViewScale transition={{ duration: 0.6 }}>
                    <div className="aspect-video rounded-xl overflow-hidden shadow-2xl border border-gray-800 pointer-events-auto">
                        <YouTube 
                        videoId={trailerId} 
                        opts={{
                            width: '100%',
                            height: '100%',
                            playerVars: {
                            autoplay: 1, // Enable autoplay
                            mute: 1,     // Mute is often required by browsers for autoplay to work
                            controls: 1,
                            },
                        }}
                        className="w-full h-full" 
                        />
                    </div>
                </InViewScale>
            </section>
        )}

        {galleryPhotos.length > 0 && (
            <section className="p-8 md:p-16 bg-[#141414]">
                <div className="max-w-6xl mx-auto">
                    <InView>
                        <h3 className="font-bebas text-4xl mb-8">Behind the Scenes</h3>
                    </InView>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {galleryPhotos.map((photo, index) => (
                        <InView key={`gallery-${photo}-${index}`} transition={{ delay: index * 0.1 }}>
                            <motion.div 
                                className="relative aspect-video rounded-md overflow-hidden cursor-pointer group"
                                whileHover={{ scale: 1.05, zIndex: 10 }}
                            >
                                <Image 
                                src={photo} 
                                alt={`Scene ${index + 1}`} 
                                fill
                                className="object-cover md:group-hover:brightness-110 transition-all"
                                />
                                {/* Mobile transparent, Desktop overlay with hover clear */}
                                <div className="absolute inset-0 bg-transparent md:bg-black/50 md:group-hover:bg-transparent transition-colors duration-300"></div>
                            </motion.div>
                        </InView>
                        ))}
                    </div>
                </div>
            </section>
        )}

        <section className="p-8 md:p-16 max-w-4xl mx-auto text-center">
            <InView>
                <h3 className="font-bebas text-5xl mb-4">Are you watching?</h3>
                <p className="text-gray-400 mb-8">Confirm your subscription to this event.</p>
            </InView>
            <InViewScale>
                <div className="bg-[#141414] border border-gray-800 p-8 rounded-xl text-left">
                    <RsvpForm invitationId={invitationId} />
                </div>
            </InViewScale>
        </section>

        <footer className="text-center p-8 pb-16 text-xs text-gray-600 border-t border-gray-900 mt-8">
            <p className="font-bold tracking-widest uppercase">A Nikahflix Original Production</p>
            <p className="mt-2">&copy; {new Date().getFullYear()} Nikahflix. All rights reserved.</p>
        </footer>
        </motion.div>
    </AnimatePresence>
  );
}