'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCountdown } from '@/hooks/useCountdown';
import RsvpForm from '../RsvpForm';
import toast from 'react-hot-toast';
import { InView, InViewSlideLeft, InViewSlideRight, InViewScale } from '@/components/motion/in-view';
import { TextEffect } from '@/components/motion/text-effect';
import { AnimatedNumber } from '@/components/motion/animated-number';
import { FloatingParticles, FloatingSparkles } from '@/components/motion/floating-particles';

type Props = {
  invitationId: string;
  custom_data: {
    heroPhoto1?: string;
    heroPhoto2?: string;
    heroPhoto3?: string;
    coupleNames?: string;
    eventDateDisplay?: string;
    groomFullName?: string;
    groomNickname?: string;
    groomParents?: string;
    groomPhoto?: string;
    brideFullName?: string;
    brideNickname?: string;
    brideParents?: string;
    bridePhoto?: string;
    openingQuote?: string;
    openingQuoteSource?: string;
    akadDate?: string;
    akadTime?: string;
    akadVenue?: string;
    akadAddress?: string;
    receptionDate?: string;
    receptionTime?: string;
    receptionVenue?: string;
    receptionAddress?: string;
    countdownTarget?: string;
    galleryPhoto1?: string;
    galleryPhoto2?: string;
    galleryPhoto3?: string;
    galleryPhoto4?: string;
    galleryPhoto5?: string;
    galleryPhoto6?: string;
    giftBankName?: string;
    giftBankAccount?: string;
    giftAccountHolder?: string;
    closingMessage?: string;
    backgroundMusicUrl?: string;
  };
};

// ─── Animated Countdown Box ──────────────────────────────────────────────────
function CountdownBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-xl text-2xl sm:text-3xl font-bold border border-[#c9a84c]/40"
        style={{ background: 'rgba(201,168,76,0.08)', color: '#e8c96e', fontFamily: 'Cormorant Garamond, serif' }}
      >
        <AnimatedNumber value={Math.max(0, value)} padStart={2} duration={800} />
      </div>
      <span className="mt-2 text-[10px] sm:text-xs uppercase tracking-widest" style={{ color: '#c9a84c' }}>
        {label}
      </span>
    </div>
  );
}

function Countdown({ target }: { target: string }) {
  const { days, hours, minutes, seconds } = useCountdown(target);
  const passed = days < 0 && hours < 0 && minutes < 0 && seconds < 0;
  if (passed) return <p className="text-[#c9a84c] text-xl italic">The moment has arrived ✨</p>;
  return (
    <div className="flex gap-4 sm:gap-6 justify-center">
      <CountdownBox label="Days" value={days} />
      <CountdownBox label="Hours" value={hours} />
      <CountdownBox label="Minutes" value={minutes} />
      <CountdownBox label="Seconds" value={seconds} />
    </div>
  );
}

// ─── Gold Divider with Animation ─────────────────────────────────────────────
function GoldDivider() {
  return (
    <div className="flex items-center gap-3 justify-center my-6">
      <motion.div
        className="h-px flex-1 max-w-[80px]"
        style={{ background: 'linear-gradient(to right, transparent, #c9a84c)' }}
        initial={{ scaleX: 0, originX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        viewport={{ once: true }}
      />
      <motion.svg
        width="16" height="16" viewBox="0 0 20 20" fill="none"
        initial={{ rotate: -180, opacity: 0 }}
        whileInView={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        viewport={{ once: true }}
      >
        <path d="M10 2L11.5 7.5L17 6L13 10L17 14L11.5 12.5L10 18L8.5 12.5L3 14L7 10L3 6L8.5 7.5L10 2Z" fill="#c9a84c" />
      </motion.svg>
      <motion.div
        className="h-px flex-1 max-w-[80px]"
        style={{ background: 'linear-gradient(to left, transparent, #c9a84c)' }}
        initial={{ scaleX: 0, originX: 1 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        viewport={{ once: true }}
      />
    </div>
  );
}

// ─── Event Card ──────────────────────────────────────────────────────────────
function EventCard({ title, subtitle, date, time, venue, address }: {
  title: string; subtitle: string; date: string; time?: string; venue?: string; address?: string;
}) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address || venue || '')}`;
  return (
    <div
      className="rounded-2xl p-6 text-center border border-[#c9a84c]/30 flex flex-col gap-3"
      style={{ background: 'rgba(201,168,76,0.06)' }}
    >
      <div>
        <p className="text-xs uppercase tracking-widest mb-1" style={{ color: '#c9a84c' }}>{subtitle}</p>
        <h3 className="text-2xl font-bold" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#e8c96e' }}>{title}</h3>
      </div>
      <GoldDivider />
      <div className="space-y-1 text-sm" style={{ color: '#d4bfa0' }}>
        <p className="font-semibold text-base" style={{ color: '#f0e0b0' }}>{date}</p>
        {time && <p>{time}</p>}
        {venue && <p className="font-semibold mt-2" style={{ color: '#e8c96e' }}>{venue}</p>}
        {address && <p className="text-xs">{address}</p>}
      </div>
      {(address || venue) && (
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block px-5 py-2 rounded-full text-xs font-bold tracking-wide transition-all hover:opacity-80"
          style={{ background: 'linear-gradient(135deg, #c9a84c, #e8c96e)', color: '#0d1b2a' }}
        >
          View Location
        </a>
      )}
    </div>
  );
}

// ─── Hero Slideshow with Motion ──────────────────────────────────────────────
function HeroSlideshow({ photos, coupleNames, eventDateDisplay, onOpen, showButton }: {
  photos: string[]; coupleNames?: string; eventDateDisplay?: string; onOpen: () => void; showButton: boolean;
}) {
  const [current, setCurrent] = useState(0);
  const [zoom, setZoom] = useState(true);

  useEffect(() => {
    if (photos.length <= 1) return;
    const interval = setInterval(() => {
      setZoom(false);
      setTimeout(() => {
        setCurrent(i => (i + 1) % photos.length);
        setZoom(true);
      }, 700);
    }, 5500);
    return () => clearInterval(interval);
  }, [photos.length]);

  const bg = photos[current];

  return (
    <div className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-end pb-16">
      {/* Floating sparkles on hero */}
      <FloatingSparkles count={15} color="#c9a84c" />

      {bg ? (
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[7000ms] ease-in-out"
          style={{ backgroundImage: `url(${bg})`, transform: zoom ? 'scale(1.08)' : 'scale(1)' }}
        />
      ) : (
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0d1b2a 0%, #1a2e4a 50%, #0d1b2a 100%)' }} />
      )}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,15,30,0.92) 30%, rgba(10,15,30,0.35) 70%)' }} />

      <div className="relative z-10 text-center px-6 w-full max-w-lg">
        <TextEffect
          per="char"
          delay={0.3}
          className="uppercase tracking-[0.35em] text-xs mb-3 opacity-80"
          style={{ color: '#c9a84c', fontFamily: 'Lora, serif' }}
          as="p"
        >
          The Wedding of
        </TextEffect>

        <TextEffect
          per="word"
          delay={0.8}
          className="text-5xl sm:text-6xl mb-3 leading-tight"
          style={{ fontFamily: 'Cormorant Garamond, serif', color: '#f0e0b0', fontStyle: 'italic' }}
          as="h1"
          variants={{
            hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
            visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
          }}
        >
          {coupleNames || 'Bride & Groom'}
        </TextEffect>

        {eventDateDisplay && (
          <motion.p
            className="text-sm tracking-[0.3em] mb-8 opacity-80"
            style={{ color: '#c9a84c' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            {eventDateDisplay}
          </motion.p>
        )}

        {showButton && (
          <motion.button
            onClick={onOpen}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-bold tracking-widest uppercase transition-all"
            style={{ background: 'linear-gradient(135deg, #c9a84c, #e8c96e)', color: '#0d1b2a', boxShadow: '0 4px 24px rgba(201,168,76,0.35)' }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2, duration: 0.5, type: 'spring', bounce: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Open Invitation ✦
          </motion.button>
        )}

        {photos.length > 1 && (
          <div className="flex gap-2 justify-center mt-6">
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={() => { setCurrent(i); setZoom(true); }}
                className="w-1.5 h-1.5 rounded-full transition-all"
                style={{ background: i === current ? '#c9a84c' : 'rgba(201,168,76,0.3)' }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Extract a YouTube video ID from a full URL or bare ID
function extractYouTubeId(input?: string): string | null {
  if (!input) return null;
  if (/^[a-zA-Z0-9_-]{11}$/.test(input.trim())) return input.trim();
  try {
    const url = new URL(input);
    if (url.hostname === 'youtu.be') return url.pathname.slice(1).split('?')[0];
    const v = url.searchParams.get('v');
    if (v) return v;
    const embedMatch = url.pathname.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
    if (embedMatch) return embedMatch[1];
  } catch {
    const m = input.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
    if (m) return m[1];
  }
  return null;
}

// ─── Main Template ───────────────────────────────────────────────────────────
export default function ElegantWeddingTemplate({ invitationId, custom_data }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const playerRef = useRef<HTMLIFrameElement>(null);

  const videoId = extractYouTubeId(custom_data.backgroundMusicUrl);

  const sendYTCommand = useCallback((command: string) => {
    playerRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func: command, args: [] }),
      '*'
    );
  }, []);

  const toggleMute = () => {
    setIsMuted(prev => {
      sendYTCommand(prev ? 'unMute' : 'mute');
      return !prev;
    });
  };

  const handleCopy = (text?: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success('Account number copied!');
  };

  const formatDate = (d?: string) => {
    if (!d) return 'Date TBD';
    return new Date(d).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  const heroPhotos = [custom_data.heroPhoto1, custom_data.heroPhoto2, custom_data.heroPhoto3].filter(Boolean) as string[];
  const galleryPhotos = [
    custom_data.galleryPhoto1, custom_data.galleryPhoto2, custom_data.galleryPhoto3,
    custom_data.galleryPhoto4, custom_data.galleryPhoto5, custom_data.galleryPhoto6,
  ].filter(Boolean) as string[];

  const darkBg = { background: '#0d1b2a' };

  // ── Cover (not yet opened) ──
  if (!isOpen) {
    return (
      <div style={darkBg}>
        <HeroSlideshow
          photos={heroPhotos}
          coupleNames={custom_data.coupleNames}
          eventDateDisplay={custom_data.eventDateDisplay}
          onOpen={() => setIsOpen(true)}
          showButton={true}
        />
      </div>
    );
  }

  // ── Full Invitation ──
  return (
    <AnimatePresence>
      <motion.div
        style={{ ...darkBg, fontFamily: 'Lora, serif', color: '#d4bfa0' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >

        {/* ── Hidden YouTube Background Music Player ── */}
        {videoId && (
          <iframe
            ref={playerRef}
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&controls=0&mute=0&enablejsapi=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`}
            allow="autoplay"
            className="absolute w-0 h-0 opacity-0 pointer-events-none"
            style={{ position: 'fixed', top: '-9999px', left: '-9999px' }}
            title="background-music"
          />
        )}

        {/* ── Floating Music Toggle Button ── */}
        {videoId && (
          <motion.button
            onClick={toggleMute}
            className="fixed bottom-6 right-6 z-[999] w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #c9a84c, #e8c96e)', boxShadow: '0 4px 20px rgba(201,168,76,0.45)' }}
            title={isMuted ? 'Unmute music' : 'Mute music'}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            animate={isMuted ? {} : { rotate: [0, 5, -5, 5, 0] }}
            transition={isMuted ? {} : { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            {isMuted ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0d1b2a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0d1b2a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
              </svg>
            )}
          </motion.button>
        )}

        {/* ── Hero ── */}
        <section className="relative">
          <HeroSlideshow
            photos={heroPhotos}
            coupleNames={custom_data.coupleNames}
            eventDateDisplay={custom_data.eventDateDisplay}
            onOpen={() => {}}
            showButton={false}
          />
          <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
            <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-12">
              <path d="M0,40 C180,80 360,0 540,40 C720,80 900,0 1080,40 C1260,80 1440,20 1440,20 L1440,80 L0,80 Z" fill="#0d1b2a" />
            </svg>
          </div>
        </section>

        {/* ── Opening Quote ── */}
        <section className="py-14 px-6 text-center max-w-2xl mx-auto relative">
          <FloatingParticles count={8} color="#c9a84c" minSize={1} maxSize={3} />
          <GoldDivider />
          <InView transition={{ duration: 0.8, delay: 0.2 }}>
            <blockquote className="text-lg sm:text-xl italic leading-relaxed" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#d4bfa0' }}>
              &ldquo;{custom_data.openingQuote || 'Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri.'}&rdquo;
            </blockquote>
            <p className="mt-3 text-xs tracking-widest uppercase" style={{ color: '#c9a84c' }}>
              {custom_data.openingQuoteSource || '— Q.S. Ar-Rum: 21'}
            </p>
          </InView>
          <GoldDivider />
        </section>

        {/* ── Couple Profile ── */}
        <section className="py-14 px-6">
          <InView>
            <p className="text-center text-xs uppercase tracking-[0.35em] mb-2" style={{ color: '#c9a84c' }}>With the blessing of God</p>
            <h2 className="text-center text-4xl sm:text-5xl mb-12 italic" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#e8c96e' }}>
              {custom_data.coupleNames || 'Bride & Groom'}
            </h2>
          </InView>

          <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16 max-w-3xl mx-auto">
            {[
              { photo: custom_data.groomPhoto, nickname: custom_data.groomNickname || custom_data.groomFullName, fullName: custom_data.groomFullName, parents: custom_data.groomParents, label: 'Son of', direction: 'left' as const },
              null,
              { photo: custom_data.bridePhoto, nickname: custom_data.brideNickname || custom_data.brideFullName, fullName: custom_data.brideFullName, parents: custom_data.brideParents, label: 'Daughter of', direction: 'right' as const },
            ].map((person, i) => {
              if (!person) return (
                <InViewScale key={i}>
                  <div className="text-7xl leading-none opacity-40" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#c9a84c' }}>&amp;</div>
                </InViewScale>
              );

              const Wrapper = person.direction === 'left' ? InViewSlideLeft : InViewSlideRight;
              return (
                <Wrapper key={i} transition={{ duration: 0.7, delay: 0.15 }}>
                  <div className="flex flex-col items-center text-center gap-4">
                    <motion.div
                      className="w-36 h-36 rounded-full border-4 overflow-hidden shrink-0"
                      style={{ borderColor: '#c9a84c', boxShadow: '0 0 0 6px rgba(201,168,76,0.12)' }}
                      whileHover={{ scale: 1.08 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      {person.photo ? (
                        <img src={person.photo} alt={person.nickname} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl" style={{ background: 'rgba(201,168,76,0.08)' }}>
                          👤
                        </div>
                      )}
                    </motion.div>
                    <div>
                      <h3 className="text-2xl font-bold italic" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#f0e0b0' }}>
                        {person.nickname}
                      </h3>
                      {person.fullName && person.nickname !== person.fullName && (
                        <p className="text-sm mt-0.5 italic" style={{ color: '#c9a84c' }}>{person.fullName}</p>
                      )}
                      <p className="text-xs mt-1 opacity-60">{person.parents || `${person.label} beloved parents`}</p>
                    </div>
                  </div>
                </Wrapper>
              );
            })}
          </div>
        </section>

        {/* ── Countdown ── */}
        {custom_data.countdownTarget && (
          <section className="py-14 px-6 text-center relative" style={{ background: 'rgba(201,168,76,0.04)', borderTop: '1px solid rgba(201,168,76,0.12)', borderBottom: '1px solid rgba(201,168,76,0.12)' }}>
            <FloatingParticles count={10} color="#c9a84c" minSize={1} maxSize={3} />
            <InView>
              <p className="text-xs uppercase tracking-[0.35em] mb-2" style={{ color: '#c9a84c' }}>Menuju Hari Bahagia</p>
              <h2 className="text-3xl italic mb-10" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#e8c96e' }}>Counting Down</h2>
              <Countdown target={custom_data.countdownTarget} />
            </InView>
          </section>
        )}

        {/* ── Event Details ── */}
        <section className="py-14 px-6">
          <InView>
            <p className="text-center text-xs uppercase tracking-[0.35em] mb-2" style={{ color: '#c9a84c' }}>Rangkaian Acara</p>
            <h2 className="text-center text-3xl italic mb-10" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#e8c96e' }}>Wedding Events</h2>
          </InView>
          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            <InViewSlideLeft transition={{ duration: 0.6, delay: 0.1 }}>
              <EventCard title="Akad Nikah" subtitle="Holy Matrimony" date={formatDate(custom_data.akadDate)} time={custom_data.akadTime} venue={custom_data.akadVenue} address={custom_data.akadAddress} />
            </InViewSlideLeft>
            <InViewSlideRight transition={{ duration: 0.6, delay: 0.2 }}>
              <EventCard title="Resepsi" subtitle="Wedding Reception" date={formatDate(custom_data.receptionDate)} time={custom_data.receptionTime} venue={custom_data.receptionVenue} address={custom_data.receptionAddress} />
            </InViewSlideRight>
          </div>
        </section>

        {/* ── Gallery ── */}
        {galleryPhotos.length > 0 && (
          <section className="py-14 px-6" style={{ background: 'rgba(201,168,76,0.04)', borderTop: '1px solid rgba(201,168,76,0.12)' }}>
            <InView>
              <p className="text-center text-xs uppercase tracking-[0.35em] mb-2" style={{ color: '#c9a84c' }}>Our Story</p>
              <h2 className="text-center text-3xl italic mb-10" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#e8c96e' }}>Gallery</h2>
            </InView>
            <div className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-3">
              {galleryPhotos.map((url, i) => (
                <InView
                  key={i}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  variants={{
                    hidden: { opacity: 0, scale: 0.85 },
                    visible: { opacity: 1, scale: 1 },
                  }}
                >
                  <motion.div
                    className="rounded-xl overflow-hidden aspect-square group"
                    style={{ border: '1px solid rgba(201,168,76,0.2)' }}
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <img src={url} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  </motion.div>
                </InView>
              ))}
            </div>
          </section>
        )}

        {/* ── Gift ── */}
        {custom_data.giftBankName && (
          <section className="py-14 px-6 text-center">
            <InView>
              <p className="text-xs uppercase tracking-[0.35em] mb-2" style={{ color: '#c9a84c' }}>Wedding Gift</p>
              <h2 className="text-3xl italic mb-4" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#e8c96e' }}>Hadiah Pernikahan</h2>
              <p className="max-w-md mx-auto text-sm mb-8 opacity-60">Kehadiran Anda adalah hadiah terbesar. Namun jika ingin memberikan tanda kasih, dapat mengirimkan melalui:</p>
            </InView>
            <InViewScale transition={{ duration: 0.5, delay: 0.2 }}>
              <div className="max-w-sm mx-auto rounded-2xl p-6 border border-[#c9a84c]/30 space-y-2" style={{ background: 'rgba(201,168,76,0.06)' }}>
                <p className="text-sm uppercase tracking-widest" style={{ color: '#c9a84c' }}>{custom_data.giftBankName}</p>
                <p className="text-3xl font-bold tracking-wider" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#f0e0b0' }}>{custom_data.giftBankAccount}</p>
                <p className="text-sm opacity-50">a.n. {custom_data.giftAccountHolder}</p>
                <motion.button
                  onClick={() => handleCopy(custom_data.giftBankAccount)}
                  className="mt-4 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-all"
                  style={{ background: 'linear-gradient(135deg, #c9a84c, #e8c96e)', color: '#0d1b2a' }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Copy No. Rekening
                </motion.button>
              </div>
            </InViewScale>
          </section>
        )}

        {/* ── RSVP ── */}
        <section className="py-14 px-6" style={{ background: 'rgba(201,168,76,0.04)', borderTop: '1px solid rgba(201,168,76,0.12)', borderBottom: '1px solid rgba(201,168,76,0.12)' }}>
          <InView>
            <p className="text-center text-xs uppercase tracking-[0.35em] mb-2" style={{ color: '#c9a84c' }}>Konfirmasi Kehadiran</p>
            <h2 className="text-center text-3xl italic mb-10" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#e8c96e' }}>RSVP</h2>
            <div className="max-w-lg mx-auto">
              <RsvpForm invitationId={invitationId} theme="dark" />
            </div>
          </InView>
        </section>

        {/* ── Closing ── */}
        <section className="py-14 px-6 text-center max-w-2xl mx-auto relative">
          <FloatingSparkles count={10} color="#c9a84c" />
          <InView transition={{ duration: 0.8 }}>
            <GoldDivider />
            <p className="text-lg sm:text-xl italic leading-relaxed mb-4" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#d4bfa0' }}>
              &ldquo;{custom_data.closingMessage || 'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.'}&rdquo;
            </p>
            <p className="text-sm" style={{ color: '#c9a84c' }}>{custom_data.coupleNames || 'Bride & Groom'}</p>
            <GoldDivider />
            <p className="text-xs opacity-30 mt-4">Digital Invitation © {new Date().getFullYear()}</p>
          </InView>
        </section>

      </motion.div>
    </AnimatePresence>
  );
}
