'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCountdown } from '@/hooks/useCountdown';
import RsvpForm from '../RsvpForm';
import { InView } from '@/components/motion/in-view';
import { FloatingParticles } from '@/components/motion/floating-particles';

type LoveStoryItem = { year: string; text: string };

type Props = {
  invitationId: string;
  custom_data: {
    coupleNames?: string;
    brideNickname?: string;
    brideFullName?: string;
    brideParents?: string;
    bridePhoto?: string;
    groomNickname?: string;
    groomFullName?: string;
    groomParents?: string;
    groomPhoto?: string;
    openingQuote?: string;
    openingQuoteSource?: string;
    akadDate?: string;
    akadTime?: string;
    akadVenue?: string;
    akadAddress?: string;
    akadMapsUrl?: string;
    receptionDate?: string;
    receptionTime?: string;
    receptionVenue?: string;
    receptionAddress?: string;
    receptionMapsUrl?: string;
    countdownTarget?: string;
    galleryPhoto1?: string;
    galleryPhoto2?: string;
    galleryPhoto3?: string;
    galleryPhoto4?: string;
    galleryPhoto5?: string;
    galleryPhoto6?: string;
    loveStory?: LoveStoryItem[];
    loveStory1Year?: string;
    loveStory1Text?: string;
    loveStory2Year?: string;
    loveStory2Text?: string;
    loveStory3Year?: string;
    loveStory3Text?: string;
    loveStory4Year?: string;
    loveStory4Text?: string;
    giftBankName?: string;
    giftBankAccount?: string;
    giftAccountHolder?: string;
    giftRecipientName?: string;
    giftAddress?: string;
    closingMessage?: string;
    backgroundMusicUrl?: string;
    livestreamUrl1?: string;
    guestName?: string;
  };
};

const G = '#C9A84C';
const GL = '#E8C96E';
const CR = '#F5E6D0';
const BD = '#1A0E08';
const BM = '#2C1810';
const BL = '#3D2218';

// ─── EXTRACT YOUTUBE ID ───────────────────────────────────────────────────────
function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const regexes = [
    /youtu\.be\/([^?&]+)/,
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtube\.com\/embed\/([^?&]+)/,
    /youtube\.com\/shorts\/([^?&]+)/,
  ];
  for (const r of regexes) {
    const m = url.match(r);
    if (m) return m[1];
  }
  // Maybe it's just the ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
  return null;
}

// ─── BATIK SVG PATTERN ───────────────────────────────────────────────────────
function BatikPattern({ opacity = 0.08 }: { opacity?: number }) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity }}
    >
      <defs>
        <pattern id="batik" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          {/* Kawung motif */}
          <ellipse cx="15" cy="15" rx="8" ry="5" fill="none" stroke="#C9A84C" strokeWidth="0.8" />
          <ellipse cx="15" cy="15" rx="5" ry="8" fill="none" stroke="#C9A84C" strokeWidth="0.8" />
          <ellipse cx="45" cy="15" rx="8" ry="5" fill="none" stroke="#C9A84C" strokeWidth="0.8" />
          <ellipse cx="45" cy="15" rx="5" ry="8" fill="none" stroke="#C9A84C" strokeWidth="0.8" />
          <ellipse cx="15" cy="45" rx="8" ry="5" fill="none" stroke="#C9A84C" strokeWidth="0.8" />
          <ellipse cx="15" cy="45" rx="5" ry="8" fill="none" stroke="#C9A84C" strokeWidth="0.8" />
          <ellipse cx="45" cy="45" rx="8" ry="5" fill="none" stroke="#C9A84C" strokeWidth="0.8" />
          <ellipse cx="45" cy="45" rx="5" ry="8" fill="none" stroke="#C9A84C" strokeWidth="0.8" />
          {/* Center dot */}
          <circle cx="30" cy="30" r="1.5" fill="#C9A84C" />
          <circle cx="0" cy="0" r="1.5" fill="#C9A84C" />
          <circle cx="60" cy="0" r="1.5" fill="#C9A84C" />
          <circle cx="0" cy="60" r="1.5" fill="#C9A84C" />
          <circle cx="60" cy="60" r="1.5" fill="#C9A84C" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#batik)" />
    </svg>
  );
}

// ─── ORNAMENTAL BORDER ───────────────────────────────────────────────────────
function GoldBorder() {
  return (
    <div className="absolute inset-3 pointer-events-none">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {/* Main border */}
        <rect x="1" y="1" width="98" height="98" fill="none" stroke="#C9A84C" strokeWidth="0.4" opacity="0.6" />
        <rect x="3" y="3" width="94" height="94" fill="none" stroke="#C9A84C" strokeWidth="0.2" opacity="0.4" />
        {/* Corner flourishes */}
        <path d="M1,1 Q10,1 10,10" fill="none" stroke="#C9A84C" strokeWidth="0.6" opacity="0.8" />
        <path d="M1,1 Q1,10 10,10" fill="none" stroke="#C9A84C" strokeWidth="0.6" opacity="0.8" />
        <path d="M99,1 Q90,1 90,10" fill="none" stroke="#C9A84C" strokeWidth="0.6" opacity="0.8" />
        <path d="M99,1 Q99,10 90,10" fill="none" stroke="#C9A84C" strokeWidth="0.6" opacity="0.8" />
        <path d="M1,99 Q10,99 10,90" fill="none" stroke="#C9A84C" strokeWidth="0.6" opacity="0.8" />
        <path d="M1,99 Q1,90 10,90" fill="none" stroke="#C9A84C" strokeWidth="0.6" opacity="0.8" />
        <path d="M99,99 Q90,99 90,90" fill="none" stroke="#C9A84C" strokeWidth="0.6" opacity="0.8" />
        <path d="M99,99 Q99,90 90,90" fill="none" stroke="#C9A84C" strokeWidth="0.6" opacity="0.8" />
        {/* Diamond corner ornaments */}
        <polygon points="10,10 13,7 16,10 13,13" fill="#C9A84C" opacity="0.7" transform="scale(0.4) translate(15,15)" />
        <polygon points="84,10 87,7 90,10 87,13" fill="#C9A84C" opacity="0.7" transform="scale(0.4) translate(140,15)" />
      </svg>
    </div>
  );
}

// ─── GUNUNGAN SVG (inline, no external image needed for decorative) ───────────
function GununganIcon({ size = 80, className = '' }: { size?: number; className?: string }) {
  return (
    <div className={className} style={{ width: size, height: 'auto' }}>
      <img
        src="/templates/adat-jawa/gunungan.jpg"
        alt="Gunungan"
        style={{ width: size, borderRadius: 4, display: 'block' }}
      />
    </div>
  );
}

// ─── FLOWER ORNAMENT SVG ─────────────────────────────────────────────────────
function FlowerOrnament({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
        <g key={angle} transform={`rotate(${angle} 50 50)`}>
          <ellipse cx="50" cy="25" rx="8" ry="20" fill="#C9A84C" opacity="0.7" />
        </g>
      ))}
      <circle cx="50" cy="50" r="10" fill="#E8C96E" />
      <circle cx="50" cy="50" r="5" fill="#C9A84C" />
    </svg>
  );
}

// ─── WAVY DIVIDER ─────────────────────────────────────────────────────────────
function GoldDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-5">
      <div className="h-px flex-1 max-w-[70px]" style={{ background: `linear-gradient(to right, transparent, ${G})` }} />
      <FlowerOrnament size={20} />
      <div className="h-px flex-1 max-w-[70px]" style={{ background: `linear-gradient(to left, transparent, ${G})` }} />
    </div>
  );
}

// ─── COUNTDOWN ────────────────────────────────────────────────────────────────
function CountdownBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-xl text-2xl font-bold border"
        style={{ background: 'rgba(201,168,76,0.12)', borderColor: 'rgba(201,168,76,0.4)', color: GL, fontFamily: 'Cormorant Infant, serif' }}>
        {String(Math.max(0, value)).padStart(2, '0')}
      </div>
      <span className="text-[10px] uppercase tracking-widest" style={{ color: G }}>{label}</span>
    </div>
  );
}

function Countdown({ target }: { target: string }) {
  const { days, hours, minutes, seconds } = useCountdown(target);
  const passed = days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0;
  if (passed) return <p className="text-xl italic" style={{ color: GL, fontFamily: 'Alex Brush, cursive' }}>Hari Bahagia Telah Tiba ✨</p>;
  return (
    <div className="flex gap-3 sm:gap-5 justify-center">
      <CountdownBox label="Hari" value={days} />
      <CountdownBox label="Jam" value={hours} />
      <CountdownBox label="Menit" value={minutes} />
      <CountdownBox label="Detik" value={seconds} />
    </div>
  );
}

// ─── YOUTUBE MUSIC PLAYER ────────────────────────────────────────────────────
function YouTubeMusicPlayer({ src }: { src: string }) {
  const ytId = extractYouTubeId(src);
  const [playing, setPlaying] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const sendCommand = useCallback((cmd: string) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func: cmd }),
      '*'
    );
  }, []);

  const toggle = useCallback(() => {
    if (playing) {
      sendCommand('pauseVideo');
      setPlaying(false);
    } else {
      sendCommand('playVideo');
      setPlaying(true);
    }
  }, [playing, sendCommand]);

  if (!ytId) return null;

  return (
    <>
      {/* Hidden YouTube iframe */}
      <div className="fixed -bottom-[9999px] left-0 w-1 h-1 overflow-hidden" aria-hidden="true">
        <iframe
          ref={iframeRef}
          src={`https://www.youtube.com/embed/${ytId}?autoplay=1&loop=1&playlist=${ytId}&enablejsapi=1&mute=0`}
          allow="autoplay"
          title="background music"
          style={{ width: 1, height: 1 }}
        />
      </div>
      {/* Floating button */}
      <motion.button
        onClick={toggle}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-2xl border"
        style={{ background: `linear-gradient(135deg, ${G}, #8B6914)`, borderColor: 'rgba(201,168,76,0.5)' }}
        aria-label={playing ? 'Pause music' : 'Play music'}
      >
        {playing ? (
          <motion.div className="flex gap-0.5 items-center" animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
            <div className="w-0.5 h-4 bg-white rounded-full" />
            <div className="w-0.5 h-3 bg-white rounded-full" />
            <div className="w-0.5 h-4 bg-white rounded-full" />
          </motion.div>
        ) : (
          <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
        )}
      </motion.button>
    </>
  );
}

// ─── HTML5 MUSIC PLAYER (fallback) ───────────────────────────────────────────
function AudioMusicPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) { audio.play().then(() => setPlaying(true)); }
    else { audio.pause(); setPlaying(false); }
  }, []);

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="auto" />
      <motion.button onClick={toggle} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-2xl border"
        style={{ background: `linear-gradient(135deg, ${G}, #8B6914)`, borderColor: 'rgba(201,168,76,0.5)' }}>
        {playing ? (
          <motion.div className="flex gap-0.5 items-center" animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
            <div className="w-0.5 h-4 bg-white rounded-full" /><div className="w-0.5 h-3 bg-white rounded-full" /><div className="w-0.5 h-4 bg-white rounded-full" />
          </motion.div>
        ) : (
          <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
        )}
      </motion.button>
    </>
  );
}

function MusicPlayer({ src }: { src: string }) {
  const ytId = extractYouTubeId(src);
  return ytId ? <YouTubeMusicPlayer src={src} /> : <AudioMusicPlayer src={src} />;
}

// ─── COPY BUTTON ──────────────────────────────────────────────────────────────
function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="mt-2 px-4 py-2 text-sm rounded-lg font-medium border flex items-center gap-2 mx-auto"
      style={{ background: copied ? 'rgba(201,168,76,0.3)' : 'rgba(201,168,76,0.1)', borderColor: 'rgba(201,168,76,0.4)', color: GL }}>
      {copied
        ? <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Tersalin!</>
        : <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>{label}</>}
    </button>
  );
}

// ─── GALLERY CAROUSEL ─────────────────────────────────────────────────────────
function GalleryCarousel({ photos }: { photos: string[] }) {
  const [cur, setCur] = useState(0);
  useEffect(() => {
    if (photos.length <= 1) return;
    const t = setInterval(() => setCur(c => (c + 1) % photos.length), 2800);
    return () => clearInterval(t);
  }, [photos.length]);

  if (!photos.length) return null;
  return (
    <div className="relative w-full overflow-hidden rounded-xl" style={{ aspectRatio: '4/3' }}>
      <AnimatePresence mode="wait">
        <motion.img key={cur} src={photos[cur]} alt="" className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.9 }} />
      </AnimatePresence>
      {/* Gold frame overlay */}
      <div className="absolute inset-0 pointer-events-none border-2 rounded-xl" style={{ borderColor: 'rgba(201,168,76,0.3)' }} />
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {photos.map((_, i) => (
          <button key={i} onClick={() => setCur(i)} className="rounded-full transition-all duration-300"
            style={{ width: i === cur ? 20 : 6, height: 6, background: i === cur ? G : 'rgba(255,255,255,0.5)' }} />
        ))}
      </div>
    </div>
  );
}

// ─── CURTAIN COMPONENT ────────────────────────────────────────────────────────
function Curtain({ onOpen }: { onOpen: () => void }) {
  const [opening, setOpening] = useState(false);

  const handleOpen = () => {
    setOpening(true);
    setTimeout(onOpen, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" style={{ background: BD }}>
      {/* Left curtain panel */}
      <motion.div
        className="absolute top-0 left-0 w-1/2 h-full origin-left"
        animate={opening ? { scaleX: 0 } : { scaleX: 1 }}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
        style={{
          background: `linear-gradient(to right, ${BD}, ${BM})`,
          transformOrigin: 'left center',
          zIndex: 10,
        }}
      >
        <BatikPattern opacity={0.12} />
        {/* Fold lines */}
        {[15, 30, 50, 70, 85].map(x => (
          <div key={x} className="absolute top-0 h-full w-px" style={{ left: `${x}%`, background: 'rgba(201,168,76,0.08)' }} />
        ))}
        {/* Gold trim on right edge */}
        <div className="absolute top-0 right-0 w-1 h-full" style={{ background: `linear-gradient(to bottom, ${G}, transparent, ${G})`, opacity: 0.5 }} />
        {/* Tassel at top */}
        <div className="absolute top-0 right-0 flex flex-col items-center gap-0.5 pt-0">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-0.5 rounded-full" style={{ height: 12 + i * 4, background: G, opacity: 0.6 }} />
          ))}
        </div>
      </motion.div>

      {/* Right curtain panel */}
      <motion.div
        className="absolute top-0 right-0 w-1/2 h-full"
        animate={opening ? { scaleX: 0 } : { scaleX: 1 }}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
        style={{
          background: `linear-gradient(to left, ${BD}, ${BM})`,
          transformOrigin: 'right center',
          zIndex: 10,
        }}
      >
        <BatikPattern opacity={0.12} />
        {[15, 30, 50, 70, 85].map(x => (
          <div key={x} className="absolute top-0 h-full w-px" style={{ left: `${x}%`, background: 'rgba(201,168,76,0.08)' }} />
        ))}
        <div className="absolute top-0 left-0 w-1 h-full" style={{ background: `linear-gradient(to bottom, ${G}, transparent, ${G})`, opacity: 0.5 }} />
        <div className="absolute top-0 left-0 flex flex-col items-center gap-0.5 pt-0">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-0.5 rounded-full" style={{ height: 12 + i * 4, background: G, opacity: 0.6 }} />
          ))}
        </div>
      </motion.div>

      {/* Center content (visible between curtains before open) */}
      <div className="absolute inset-0 flex flex-col items-center justify-between py-14 px-8 text-center z-20">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <GununganIcon size={100} className="mx-auto opacity-90" />
        </motion.div>

        <motion.div className="flex flex-col items-center gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
          <p style={{ color: G, fontSize: '0.65rem', letterSpacing: '0.35em', textTransform: 'uppercase' }}>
            — Undangan Pernikahan —
          </p>
          <div className="w-24 h-px" style={{ background: `linear-gradient(to right, transparent, ${G}, transparent)` }} />
          <p style={{ color: CR, fontSize: '0.78rem', letterSpacing: '0.1em' }}>Kepada Yth.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1 }}>
          <h1 style={{ fontFamily: 'Pinyon Script, cursive', fontSize: '2.8rem', color: GL, lineHeight: 1.1 }}>
            {'' /* will be populated by parent */}
          </h1>
        </motion.div>

        <motion.div className="flex flex-col items-center gap-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}>
          <motion.span animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2 }}
            style={{ color: 'rgba(201,168,76,0.5)', fontSize: '0.65rem', letterSpacing: '0.3em' }}>▼ ▼ ▼</motion.span>
          <motion.button
            onClick={handleOpen}
            whileHover={{ scale: 1.05, boxShadow: `0 0 30px ${G}50` }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-8 py-3 rounded-full font-medium text-sm border"
            style={{ background: `linear-gradient(135deg, ${G}, #8B6914)`, borderColor: 'rgba(201,168,76,0.6)', color: BD, letterSpacing: '0.08em' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Buka Undangan
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

// ─── MAIN TEMPLATE ────────────────────────────────────────────────────────────
export default function AdatJawaTemplate({ invitationId, custom_data: d }: Props) {
  const [opened, setOpened] = useState(false);
  const coupleNames = d.coupleNames || 'Pengantin & Pengantin';
  const brideNick = d.brideNickname || 'Mempelai Wanita';
  const groomNick = d.groomNickname || 'Mempelai Pria';
  const countdownTarget = d.countdownTarget || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  const galleryPhotos = [d.galleryPhoto1, d.galleryPhoto2, d.galleryPhoto3, d.galleryPhoto4, d.galleryPhoto5, d.galleryPhoto6].filter(Boolean) as string[];

  // Build love story from both structured data and individual fields
  const loveStory: LoveStoryItem[] = d.loveStory || [
    ...(d.loveStory1Year && d.loveStory1Text ? [{ year: d.loveStory1Year, text: d.loveStory1Text }] : [{ year: '2018', text: 'Kami pertama kali bertemu di sebuah acara yang mempertemukan dua hati yang kemudian tak terpisahkan.' }]),
    ...(d.loveStory2Year && d.loveStory2Text ? [{ year: d.loveStory2Year, text: d.loveStory2Text }] : [{ year: '2020', text: 'Setelah berbagi momen indah bersama, kami semakin yakin bahwa kami saling melengkapi.' }]),
    ...(d.loveStory3Year && d.loveStory3Text ? [{ year: d.loveStory3Year, text: d.loveStory3Text }] : [{ year: '2023', text: 'Momen yang tidak terlupakan ketika lamaran diajukan dengan penuh cinta dan ketulusan.' }]),
    ...(d.loveStory4Year && d.loveStory4Text ? [{ year: d.loveStory4Year, text: d.loveStory4Text }] : [{ year: '2024', text: 'Petualangan baru kami dimulai. Semoga Allah SWT memberkahi pernikahan kami.' }]),
  ];

  const secBg = { background: `linear-gradient(180deg, ${BD} 0%, ${BM} 50%, ${BD} 100%)`, color: CR };

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif', background: BD, minHeight: '100vh', overflowX: 'hidden' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Pinyon+Script&family=Alex+Brush&family=Cormorant+Infant:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Poppins:wght@300;400;500;600&display=swap');`}</style>

      {/* ── CURTAIN COVER ── */}
      <AnimatePresence>
        {!opened && (
          <motion.div key="curtain" exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <Curtain onOpen={() => setOpened(true)} />
            {/* The couple info shown between curtains */}
            <div className="fixed inset-0 z-[25] flex flex-col items-center justify-center pointer-events-none">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }} className="text-center">
                <p style={{ color: 'rgba(245,230,208,0.65)', fontSize: '0.7rem', marginBottom: 4 }}>The Wedding of</p>
                <h1 style={{ fontFamily: 'Pinyon Script, cursive', fontSize: '2.6rem', color: GL, lineHeight: 1.1 }}>{coupleNames}</h1>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MAIN CONTENT ── */}
      {opened && (
        <div>
          {/* HERO / AYAT */}
          <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 overflow-hidden text-center"
            style={{ background: `linear-gradient(180deg, ${BD} 0%, ${BM} 60%, ${BD} 100%)`, color: CR }}>
            <BatikPattern opacity={0.06} />
            <FloatingParticles count={15} color="#C9A84C" className="opacity-25" />
            {/* Top ornament row */}
            <div className="flex items-center gap-3 mb-8">
              <FlowerOrnament size={22} /><div className="w-16 h-px" style={{ background: `linear-gradient(to right, transparent, ${G})` }} />
              <FlowerOrnament size={30} />
              <div className="w-16 h-px" style={{ background: `linear-gradient(to left, transparent, ${G})` }} /><FlowerOrnament size={22} />
            </div>

            <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
              <GununganIcon size={130} className="mx-auto mb-4" />
            </motion.div>

            <motion.div className="flex items-center gap-4 mb-4"
              initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 1, type: 'spring' }}>
              <span style={{ fontFamily: 'Pinyon Script, cursive', fontSize: '5rem', color: GL, lineHeight: 1 }}>{brideNick?.[0] || 'E'}</span>
              <span style={{ color: G, fontSize: '2rem' }}>&amp;</span>
              <span style={{ fontFamily: 'Pinyon Script, cursive', fontSize: '5rem', color: GL, lineHeight: 1 }}>{groomNick?.[0] || 'S'}</span>
            </motion.div>

            <GoldDivider />

            <InView>
              <blockquote className="max-w-xs mx-auto">
                <p style={{ color: 'rgba(245,230,208,0.82)', fontSize: '0.82rem', lineHeight: 1.9, fontStyle: 'italic' }}>
                  &ldquo;{d.openingQuote || 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya.'}&rdquo;
                </p>
                <footer className="mt-3" style={{ color: G, fontSize: '0.72rem', letterSpacing: '0.1em' }}>
                  — {d.openingQuoteSource || 'QS. Ar-Rum : 21'} —
                </footer>
              </blockquote>
            </InView>
            <InView>
              <div className="mt-8">
                <p style={{ color: CR, fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 8 }}>The Wedding of</p>
                <h2 style={{ fontFamily: 'Pinyon Script, cursive', fontSize: '3.2rem', color: GL, lineHeight: 1.1 }}>{coupleNames}</h2>
              </div>
            </InView>
            {/* Bottom ornament */}
            <div className="flex items-center gap-3 mt-10">
              <FlowerOrnament size={18} /><div className="w-12 h-px" style={{ background: `linear-gradient(to right, transparent, ${G})` }} />
              <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.8 }} style={{ color: 'rgba(201,168,76,0.4)' }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" /></svg>
              </motion.div>
              <div className="w-12 h-px" style={{ background: `linear-gradient(to left, transparent, ${G})` }} /><FlowerOrnament size={18} />
            </div>
          </section>

          {/* COUPLE PROFILES */}
          <section style={secBg} className="relative px-6 py-16 overflow-hidden">
            <BatikPattern opacity={0.05} />
            <InView>
              <div className="text-center mb-10">
                <FlowerOrnament size={32} className="mx-auto mb-2" />
                <h2 style={{ fontFamily: 'Cormorant Infant, serif', fontSize: '1.5rem', color: GL, marginBottom: 8 }}>We Are Getting Married!</h2>
                <p style={{ color: 'rgba(245,230,208,0.65)', fontSize: '0.8rem', maxWidth: 280, margin: '0 auto', lineHeight: 1.8 }}>
                  Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan.
                </p>
              </div>
            </InView>
            <div className="flex flex-col gap-8 max-w-sm mx-auto">
              {/* Bride */}
              <InView>
                <div className="flex flex-col items-center gap-4 p-6 rounded-2xl border relative overflow-hidden"
                  style={{ background: 'rgba(201,168,76,0.05)', borderColor: 'rgba(201,168,76,0.2)' }}>
                  {/* Corner ornaments */}
                  <svg className="absolute top-0 left-0 w-12 h-12 opacity-40" viewBox="0 0 60 60"><path d="M5,5 Q30,5 30,30 Q5,30 5,5" fill="none" stroke="#C9A84C" strokeWidth="1.5" /><circle cx="5" cy="5" r="3" fill="#C9A84C" /></svg>
                  <svg className="absolute top-0 right-0 w-12 h-12 opacity-40 scale-x-[-1]" viewBox="0 0 60 60"><path d="M5,5 Q30,5 30,30 Q5,30 5,5" fill="none" stroke="#C9A84C" strokeWidth="1.5" /><circle cx="5" cy="5" r="3" fill="#C9A84C" /></svg>
                  <svg className="absolute bottom-0 left-0 w-12 h-12 opacity-40 scale-y-[-1]" viewBox="0 0 60 60"><path d="M5,5 Q30,5 30,30 Q5,30 5,5" fill="none" stroke="#C9A84C" strokeWidth="1.5" /><circle cx="5" cy="5" r="3" fill="#C9A84C" /></svg>
                  <svg className="absolute bottom-0 right-0 w-12 h-12 opacity-40 scale-x-[-1] scale-y-[-1]" viewBox="0 0 60 60"><path d="M5,5 Q30,5 30,30 Q5,30 5,5" fill="none" stroke="#C9A84C" strokeWidth="1.5" /><circle cx="5" cy="5" r="3" fill="#C9A84C" /></svg>

                  <div className="relative w-36 h-36">
                    {/* Decorative rings */}
                    <div className="absolute inset-0 rounded-full border-2 border-dashed animate-spin" style={{ borderColor: 'rgba(201,168,76,0.2)', animationDuration: '20s' }} />
                    <div className="absolute inset-1 rounded-full border" style={{ borderColor: 'rgba(201,168,76,0.4)' }} />
                    {d.bridePhoto ? (
                      <img src={d.bridePhoto} alt={brideNick} className="w-full h-full object-cover rounded-full absolute inset-0 p-1" />
                    ) : (
                      <div className="w-full h-full rounded-full flex items-center justify-center text-5xl border-2 bg-opacity-10" style={{ background: 'rgba(201,168,76,0.08)', borderColor: G }}>👰</div>
                    )}
                  </div>
                  <div className="text-center">
                    <h3 style={{ fontFamily: 'Pinyon Script, cursive', fontSize: '2.4rem', color: GL, lineHeight: 1 }}>{brideNick}</h3>
                    <p style={{ color: CR, fontWeight: 500, marginTop: 4, fontSize: '0.88rem' }}>{d.brideFullName || 'Nama Lengkap Mempelai'}</p>
                    <div className="w-16 h-px mx-auto my-2" style={{ background: G, opacity: 0.3 }} />
                    <p style={{ color: 'rgba(245,230,208,0.55)', fontSize: '0.75rem', lineHeight: 1.7 }}>{d.brideParents || 'Putri dari Bapak & Ibu ...'}</p>
                  </div>
                </div>
              </InView>

              <div className="text-center flex items-center justify-center gap-4">
                <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${G})` }} />
                <span style={{ color: G, fontFamily: 'Pinyon Script, cursive', fontSize: '2.8rem' }}>&amp;</span>
                <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${G})` }} />
              </div>

              {/* Groom */}
              <InView>
                <div className="flex flex-col items-center gap-4 p-6 rounded-2xl border relative overflow-hidden"
                  style={{ background: 'rgba(201,168,76,0.05)', borderColor: 'rgba(201,168,76,0.2)' }}>
                  <svg className="absolute top-0 left-0 w-12 h-12 opacity-40" viewBox="0 0 60 60"><path d="M5,5 Q30,5 30,30 Q5,30 5,5" fill="none" stroke="#C9A84C" strokeWidth="1.5" /><circle cx="5" cy="5" r="3" fill="#C9A84C" /></svg>
                  <svg className="absolute top-0 right-0 w-12 h-12 opacity-40 scale-x-[-1]" viewBox="0 0 60 60"><path d="M5,5 Q30,5 30,30 Q5,30 5,5" fill="none" stroke="#C9A84C" strokeWidth="1.5" /><circle cx="5" cy="5" r="3" fill="#C9A84C" /></svg>
                  <svg className="absolute bottom-0 left-0 w-12 h-12 opacity-40 scale-y-[-1]" viewBox="0 0 60 60"><path d="M5,5 Q30,5 30,30 Q5,30 5,5" fill="none" stroke="#C9A84C" strokeWidth="1.5" /><circle cx="5" cy="5" r="3" fill="#C9A84C" /></svg>
                  <svg className="absolute bottom-0 right-0 w-12 h-12 opacity-40 scale-x-[-1] scale-y-[-1]" viewBox="0 0 60 60"><path d="M5,5 Q30,5 30,30 Q5,30 5,5" fill="none" stroke="#C9A84C" strokeWidth="1.5" /><circle cx="5" cy="5" r="3" fill="#C9A84C" /></svg>

                  <div className="relative w-36 h-36">
                    <div className="absolute inset-0 rounded-full border-2 border-dashed animate-spin" style={{ borderColor: 'rgba(201,168,76,0.2)', animationDuration: '20s', animationDirection: 'reverse' }} />
                    <div className="absolute inset-1 rounded-full border" style={{ borderColor: 'rgba(201,168,76,0.4)' }} />
                    {d.groomPhoto ? (
                      <img src={d.groomPhoto} alt={groomNick} className="w-full h-full object-cover rounded-full absolute inset-0 p-1" />
                    ) : (
                      <div className="w-full h-full rounded-full flex items-center justify-center text-5xl" style={{ background: 'rgba(201,168,76,0.08)', borderColor: G }}>🤵</div>
                    )}
                  </div>
                  <div className="text-center">
                    <h3 style={{ fontFamily: 'Pinyon Script, cursive', fontSize: '2.4rem', color: GL, lineHeight: 1 }}>{groomNick}</h3>
                    <p style={{ color: CR, fontWeight: 500, marginTop: 4, fontSize: '0.88rem' }}>{d.groomFullName || 'Nama Lengkap Mempelai'}</p>
                    <div className="w-16 h-px mx-auto my-2" style={{ background: G, opacity: 0.3 }} />
                    <p style={{ color: 'rgba(245,230,208,0.55)', fontSize: '0.75rem', lineHeight: 1.7 }}>{d.groomParents || 'Putra dari Bapak & Ibu ...'}</p>
                  </div>
                </div>
              </InView>
            </div>
          </section>

          {/* GALLERY HERO */}
          {galleryPhotos.length > 0 && (
            <section className="px-4 py-2" style={{ background: BD }}>
              <GalleryCarousel photos={galleryPhotos} />
            </section>
          )}

          {/* SAVE THE DATE */}
          <section className="relative px-6 py-16 text-center overflow-hidden"
            style={{ background: `linear-gradient(160deg, ${BM}, ${BL}, ${BM})`, color: CR }}>
            <BatikPattern opacity={0.08} />
            <InView>
              <div className="flex items-center justify-center gap-4 mb-5">
                <FlowerOrnament size={24} /><div className="w-10 h-px" style={{ background: G, opacity: 0.4 }} />
                <GununganIcon size={90} className="mx-auto" />
                <div className="w-10 h-px" style={{ background: G, opacity: 0.4 }} /><FlowerOrnament size={24} />
              </div>
              <h2 style={{ fontFamily: 'Pinyon Script, cursive', fontSize: '2.5rem', color: GL, marginBottom: 4 }}>Save the Date</h2>
              <GoldDivider />
              <div className="my-6"><Countdown target={countdownTarget} /></div>
              <p style={{ color: 'rgba(245,230,208,0.65)', fontSize: '0.78rem', maxWidth: 270, margin: '0 auto', lineHeight: 1.9 }}>
                Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami.
              </p>
            </InView>
          </section>

          {/* AKAD & RESEPSI */}
          <section style={secBg} className="relative px-6 py-16 overflow-hidden">
            <BatikPattern opacity={0.05} />
            <InView>
              <FlowerOrnament size={28} className="mx-auto mb-3" />
              <h2 style={{ fontFamily: 'Pinyon Script, cursive', fontSize: '2.2rem', color: GL, textAlign: 'center', marginBottom: 20 }}>Waktu &amp; Tempat</h2>
            </InView>
            <div className="flex flex-col gap-6 max-w-sm mx-auto">
              {/* Akad */}
              <InView>
                <div className="p-6 rounded-2xl border text-center relative overflow-hidden" style={{ background: 'rgba(201,168,76,0.06)', borderColor: 'rgba(201,168,76,0.25)' }}>
                  <GoldBorder />
                  <div className="inline-flex items-center justify-center w-11 h-11 rounded-full mb-3 border" style={{ borderColor: G, color: G }}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <h3 style={{ color: GL, fontFamily: 'Cormorant Infant, serif', fontSize: '1.1rem', marginBottom: 6 }}>Akad Nikah</h3>
                  <GoldDivider />
                  <p style={{ color: CR, fontSize: '0.82rem' }}>{d.akadDate || 'Hari, DD Bulan YYYY'}</p>
                  <p style={{ color: CR, fontSize: '0.82rem', marginTop: 2, marginBottom: 6 }}>{d.akadTime || '08.00 – 10.00 WIB'}</p>
                  <p style={{ color: G, fontWeight: 600, fontSize: '0.82rem' }}>{d.akadVenue || 'Nama Gedung / Masjid'}</p>
                  <p style={{ color: 'rgba(245,230,208,0.55)', fontSize: '0.72rem', marginTop: 3, lineHeight: 1.7 }}>{d.akadAddress || 'Alamat lokasi akad nikah'}</p>
                  {d.akadMapsUrl && (
                    <a href={d.akadMapsUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 rounded-lg text-xs border" style={{ borderColor: G, color: G }}>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      Google Maps
                    </a>
                  )}
                </div>
              </InView>

              {/* Resepsi */}
              <InView>
                <div className="p-6 rounded-2xl border text-center relative overflow-hidden" style={{ background: 'rgba(201,168,76,0.06)', borderColor: 'rgba(201,168,76,0.25)' }}>
                  <GoldBorder />
                  <div className="inline-flex items-center justify-center w-11 h-11 rounded-full mb-3 border" style={{ borderColor: G, color: G }}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                  </div>
                  <h3 style={{ color: GL, fontFamily: 'Cormorant Infant, serif', fontSize: '1.1rem', marginBottom: 6 }}>Resepsi</h3>
                  <GoldDivider />
                  <p style={{ color: CR, fontSize: '0.82rem' }}>{d.receptionDate || 'Hari, DD Bulan YYYY'}</p>
                  <p style={{ color: CR, fontSize: '0.82rem', marginTop: 2, marginBottom: 6 }}>{d.receptionTime || '11.00 – 17.00 WIB'}</p>
                  <p style={{ color: G, fontWeight: 600, fontSize: '0.82rem' }}>{d.receptionVenue || 'Nama Gedung Resepsi'}</p>
                  <p style={{ color: 'rgba(245,230,208,0.55)', fontSize: '0.72rem', marginTop: 3, lineHeight: 1.7 }}>{d.receptionAddress || 'Alamat lokasi resepsi'}</p>
                  {d.receptionMapsUrl && (
                    <a href={d.receptionMapsUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 rounded-lg text-xs border" style={{ borderColor: G, color: G }}>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      Google Maps
                    </a>
                  )}
                </div>
              </InView>

              {d.livestreamUrl1 && (
                <InView>
                  <div className="p-5 rounded-2xl border text-center" style={{ background: 'rgba(201,168,76,0.06)', borderColor: 'rgba(201,168,76,0.25)' }}>
                    <h3 style={{ color: GL, fontFamily: 'Cormorant Infant, serif', fontSize: '1.05rem', marginBottom: 4 }}>Live Streaming</h3>
                    <p style={{ color: 'rgba(245,230,208,0.6)', fontSize: '0.75rem', marginBottom: 10 }}>Saksikan momen bahagia kami secara virtual</p>
                    <a href={d.livestreamUrl1} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium"
                      style={{ background: `linear-gradient(135deg, ${G}, #8B6914)`, color: BD }}>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                      Tonton Live
                    </a>
                  </div>
                </InView>
              )}
            </div>
          </section>

          {/* OUR GALLERY GRID */}
          {galleryPhotos.length > 0 && (
            <section style={{ background: BD }} className="relative px-6 py-16 overflow-hidden">
              <BatikPattern opacity={0.06} />
              <InView>
                <FlowerOrnament size={28} className="mx-auto mb-4" />
                <h2 style={{ fontFamily: 'Pinyon Script, cursive', fontSize: '2.2rem', color: GL, textAlign: 'center', marginBottom: 12 }}>Our Gallery</h2>
                <GoldDivider />
              </InView>
              <div className="mt-4 grid grid-cols-3 gap-2 max-w-sm mx-auto">
                {galleryPhotos.map((p, i) => (
                  <InView key={i}>
                    <div className="rounded-lg overflow-hidden aspect-square border" style={{ borderColor: 'rgba(201,168,76,0.2)' }}>
                      <img src={p} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                  </InView>
                ))}
              </div>
            </section>
          )}

          {/* LOVE STORY */}
          <section style={{ background: `linear-gradient(180deg, ${BM}, ${BD})`, color: CR }} className="relative px-6 py-16 overflow-hidden">
            <BatikPattern opacity={0.05} />
            <InView>
              <FlowerOrnament size={28} className="mx-auto mb-4" />
              <h2 style={{ fontFamily: 'Pinyon Script, cursive', fontSize: '2.2rem', color: GL, textAlign: 'center', marginBottom: 8 }}>Love Story</h2>
              <GoldDivider />
            </InView>
            <div className="mt-8 max-w-sm mx-auto">
              {loveStory.map((item, i) => (
                <InView key={i}>
                  <div className="flex gap-4 pb-8">
                    <div className="flex flex-col items-center">
                      <div className="w-9 h-9 rounded-full border-2 flex items-center justify-center shrink-0" style={{ borderColor: G, background: BD, color: G }}>
                        <FlowerOrnament size={16} />
                      </div>
                      {i < loveStory.length - 1 && <div className="w-px flex-1 mt-1" style={{ background: 'rgba(201,168,76,0.25)', minHeight: 24 }} />}
                    </div>
                    <div className="flex-1">
                      <span className="text-xs font-bold px-3 py-1 rounded-full inline-block mb-2" style={{ background: 'rgba(201,168,76,0.15)', color: G }}>{item.year}</span>
                      <p style={{ color: 'rgba(245,230,208,0.72)', fontSize: '0.8rem', lineHeight: 1.8 }}>{item.text}</p>
                    </div>
                  </div>
                </InView>
              ))}
            </div>
          </section>

          {/* LOVE GIFT */}
          {(d.giftBankAccount || d.giftAddress) && (
            <section style={secBg} className="relative px-6 py-16 overflow-hidden">
              <BatikPattern opacity={0.05} />
              <InView>
                <FlowerOrnament size={28} className="mx-auto mb-4" />
                <h2 style={{ fontFamily: 'Pinyon Script, cursive', fontSize: '2.2rem', color: GL, textAlign: 'center', marginBottom: 4 }}>Love Gift</h2>
                <p style={{ color: 'rgba(245,230,208,0.6)', fontSize: '0.75rem', textAlign: 'center', marginBottom: 12 }}>Tanpa mengurangi rasa hormat, bagi yang ingin memberikan tanda kasih</p>
                <GoldDivider />
              </InView>
              <div className="flex flex-col gap-5 max-w-sm mx-auto mt-4">
                {d.giftBankAccount && (
                  <InView>
                    <div className="p-5 rounded-2xl border text-center relative overflow-hidden" style={{ background: 'rgba(201,168,76,0.06)', borderColor: 'rgba(201,168,76,0.25)' }}>
                      <GoldBorder />
                      <svg className="w-8 h-8 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: G }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                      <p style={{ color: GL, fontWeight: 600, fontSize: '0.88rem' }}>{d.giftBankName || 'Transfer Bank'}</p>
                      <p style={{ color: CR, fontSize: '1.1rem', fontWeight: 700, letterSpacing: '0.08em', marginTop: 4 }}>{d.giftBankAccount}</p>
                      <p style={{ color: 'rgba(245,230,208,0.55)', fontSize: '0.75rem', marginTop: 2 }}>a.n {d.giftAccountHolder || 'Nama Pemilik'}</p>
                      <CopyButton text={d.giftBankAccount} label="Salin Nomor Rekening" />
                    </div>
                  </InView>
                )}
                {d.giftAddress && (
                  <InView>
                    <div className="p-5 rounded-2xl border text-center relative overflow-hidden" style={{ background: 'rgba(201,168,76,0.06)', borderColor: 'rgba(201,168,76,0.25)' }}>
                      <GoldBorder />
                      <svg className="w-8 h-8 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: G }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                      <p style={{ color: GL, fontWeight: 600, fontSize: '0.88rem', marginBottom: 4 }}>Kirim Kado</p>
                      {d.giftRecipientName && <p style={{ color: CR, fontSize: '0.85rem', fontWeight: 600 }}>{d.giftRecipientName}</p>}
                      <p style={{ color: 'rgba(245,230,208,0.6)', fontSize: '0.75rem', lineHeight: 1.7 }}>{d.giftAddress}</p>
                      <CopyButton text={d.giftAddress} label="Salin Alamat" />
                    </div>
                  </InView>
                )}
              </div>
            </section>
          )}

          {/* WISHES / RSVP */}
          <section style={{ background: `linear-gradient(180deg, ${BD}, ${BM})`, color: CR }} className="relative px-6 py-16 overflow-hidden">
            <BatikPattern opacity={0.05} />
            <InView>
              <FlowerOrnament size={28} className="mx-auto mb-4" />
              <h2 style={{ fontFamily: 'Pinyon Script, cursive', fontSize: '2.2rem', color: GL, textAlign: 'center', marginBottom: 4 }}>Wishes</h2>
              <p style={{ color: 'rgba(245,230,208,0.6)', fontSize: '0.75rem', textAlign: 'center', marginBottom: 12 }}>Ucapan Selamat &amp; Do&apos;a</p>
              <GoldDivider />
            </InView>
            <div className="mt-4 max-w-sm mx-auto">
              <RsvpForm invitationId={invitationId} theme="dark" />
            </div>
          </section>

          {/* CLOSING */}
          <section className="relative px-6 py-20 text-center overflow-hidden"
            style={{ background: `linear-gradient(160deg, ${BM}, ${BL}, ${BD})`, color: CR }}>
            <BatikPattern opacity={0.07} />
            <InView>
              <div className="flex items-center justify-center gap-3 mb-6">
                <FlowerOrnament size={20} /><div className="w-8 h-px" style={{ background: G, opacity: 0.4 }} />
                <GununganIcon size={100} className="mx-auto" />
                <div className="w-8 h-px" style={{ background: G, opacity: 0.4 }} /><FlowerOrnament size={20} />
              </div>
              <h2 style={{ fontFamily: 'Cormorant Infant, serif', color: GL, fontSize: '1.15rem', letterSpacing: '0.05em' }}>Terima Kasih</h2>
              <GoldDivider />
              <p style={{ color: 'rgba(245,230,208,0.68)', fontSize: '0.8rem', maxWidth: 270, margin: '0 auto 16px', lineHeight: 1.9 }}>
                {d.closingMessage || "Suatu kebahagiaan & kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan do'a restu."}
              </p>
              <p style={{ color: 'rgba(245,230,208,0.45)', fontSize: '0.72rem', marginBottom: 6 }}>Kami yang Berbahagia</p>
              <h3 style={{ fontFamily: 'Pinyon Script, cursive', fontSize: '2.5rem', color: GL }}>{coupleNames}</h3>
              {/* Bottom ornament row */}
              <div className="flex items-center justify-center gap-4 mt-8">
                <FlowerOrnament size={18} /><FlowerOrnament size={24} /><FlowerOrnament size={18} />
              </div>
            </InView>
          </section>

          {/* MUSIC PLAYER */}
          {d.backgroundMusicUrl && <MusicPlayer src={d.backgroundMusicUrl} />}
        </div>
      )}
    </div>
  );
}
