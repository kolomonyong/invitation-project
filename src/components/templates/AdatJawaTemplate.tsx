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

const GOLD = '#C9A84C';
const GOLD_LIGHT = '#E8C96E';
const CREAM = '#F5E6D0';
const BG_DEEP = '#1A0E08';
const BG_MID = '#2C1810';
const BG_LIGHT = '#3D2218';

function GoldDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-5">
      <div className="h-px flex-1 max-w-[80px]" style={{ background: 'linear-gradient(to right, transparent, #C9A84C)' }} />
      <span style={{ color: GOLD, fontSize: '1rem' }}>✦</span>
      <div className="h-px flex-1 max-w-[80px]" style={{ background: 'linear-gradient(to left, transparent, #C9A84C)' }} />
    </div>
  );
}

function CountdownBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-xl text-2xl font-bold border"
        style={{ background: 'rgba(201,168,76,0.12)', borderColor: 'rgba(201,168,76,0.4)', color: GOLD_LIGHT, fontFamily: 'Cormorant Infant, serif' }}>
        {String(Math.max(0, value)).padStart(2, '0')}
      </div>
      <span className="text-[10px] uppercase tracking-widest" style={{ color: GOLD }}>{label}</span>
    </div>
  );
}

function Countdown({ target }: { target: string }) {
  const { days, hours, minutes, seconds } = useCountdown(target);
  const passed = days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0;
  if (passed) return <p className="text-xl italic" style={{ color: GOLD_LIGHT, fontFamily: 'Alex Brush, cursive' }}>Hari Bahagia Telah Tiba ✨</p>;
  return (
    <div className="flex gap-3 sm:gap-5 justify-center">
      <CountdownBox label="Hari" value={days} />
      <CountdownBox label="Jam" value={hours} />
      <CountdownBox label="Menit" value={minutes} />
      <CountdownBox label="Detik" value={seconds} />
    </div>
  );
}

function MusicPlayer({ src }: { src: string }) {
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
      <motion.button
        onClick={toggle}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-2xl border"
        style={{ background: `linear-gradient(135deg, ${GOLD}, #8B6914)`, borderColor: 'rgba(201,168,76,0.5)' }}
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

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };
  return (
    <button onClick={copy} className="mt-2 px-4 py-2 text-sm rounded-lg font-medium border flex items-center gap-2 mx-auto"
      style={{ background: copied ? 'rgba(201,168,76,0.3)' : 'rgba(201,168,76,0.1)', borderColor: 'rgba(201,168,76,0.4)', color: GOLD_LIGHT }}>
      {copied ? (
        <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Tersalin!</>
      ) : (
        <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>{label}</>
      )}
    </button>
  );
}

function GalleryCarousel({ photos }: { photos: string[] }) {
  const [cur, setCur] = useState(0);
  useEffect(() => {
    if (photos.length <= 1) return;
    const t = setInterval(() => setCur(c => (c + 1) % photos.length), 2500);
    return () => clearInterval(t);
  }, [photos.length]);

  if (!photos.length) return null;
  return (
    <div className="relative w-full overflow-hidden rounded-xl" style={{ aspectRatio: '4/3' }}>
      <AnimatePresence mode="wait">
        <motion.img key={cur} src={photos[cur]} alt="" className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }} />
      </AnimatePresence>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {photos.map((_, i) => (
          <button key={i} onClick={() => setCur(i)} className="rounded-full transition-all duration-300"
            style={{ width: i === cur ? 20 : 6, height: 6, background: i === cur ? GOLD : 'rgba(255,255,255,0.5)' }} />
        ))}
      </div>
    </div>
  );
}

export default function AdatJawaTemplate({ invitationId, custom_data: d }: Props) {
  const [opened, setOpened] = useState(false);
  const coupleNames = d.coupleNames || 'Pengantin & Pengantin';
  const brideNick = d.brideNickname || 'Mempelai Wanita';
  const groomNick = d.groomNickname || 'Mempelai Pria';
  const countdownTarget = d.countdownTarget || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  const galleryPhotos = [d.galleryPhoto1, d.galleryPhoto2, d.galleryPhoto3, d.galleryPhoto4, d.galleryPhoto5, d.galleryPhoto6].filter(Boolean) as string[];

  const loveStory: LoveStoryItem[] = d.loveStory || [
    { year: '2018', text: 'Kami pertama kali bertemu di sebuah acara yang mempertemukan dua hati yang kemudian tak terpisahkan.' },
    { year: '2020', text: 'Setelah berbagi momen indah bersama, kami semakin yakin bahwa kami saling melengkapi.' },
    { year: '2023', text: 'Momen yang tidak terlupakan ketika lamaran diajukan dengan penuh cinta dan ketulusan.' },
    { year: '2024', text: 'Petualangan baru kami dimulai. Semoga Allah SWT memberkahi pernikahan kami.' },
  ];

  const sectionBg = { background: `linear-gradient(180deg, ${BG_DEEP} 0%, ${BG_MID} 50%, ${BG_DEEP} 100%)`, color: CREAM };

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif', background: BG_DEEP, minHeight: '100vh', overflowX: 'hidden' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Pinyon+Script&family=Alex+Brush&family=Cormorant+Infant:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Poppins:wght@300;400;500;600&display=swap');`}</style>

      {/* ── COVER ── */}
      <AnimatePresence>
        {!opened && (
          <motion.div key="cover" exit={{ opacity: 0, y: -40 }} transition={{ duration: 0.8 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-between py-16 px-6 text-center"
            style={{ background: `linear-gradient(160deg, ${BG_DEEP} 0%, ${BG_MID} 50%, #4A2A18 100%)` }}>
            {/* Top ornament */}
            <motion.img src="/templates/adat-jawa/corner-ornament.jpg" alt="" className="w-28 mix-blend-screen opacity-50"
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 0.5, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }} />

            {/* Middle */}
            <div className="flex flex-col items-center gap-4">
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                style={{ color: GOLD, fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
                — Undangan Pernikahan —
              </motion.p>
              <motion.img src="/templates/adat-jawa/gunungan.jpg" alt="Gunungan" className="w-36 mix-blend-screen opacity-80"
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 0.8, scale: 1 }} transition={{ delay: 0.7, duration: 1, type: 'spring' }} />
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
                <p style={{ color: CREAM, fontSize: '0.8rem', letterSpacing: '0.1em' }}>Kepada Yth.</p>
                <p style={{ color: GOLD_LIGHT, fontSize: '1.05rem', fontWeight: 600, marginTop: 4 }}>{d.guestName || 'Tamu Undangan'}</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}>
                <p style={{ color: 'rgba(245,230,208,0.6)', fontSize: '0.7rem', marginBottom: 4 }}>The Wedding of</p>
                <h1 style={{ fontFamily: 'Pinyon Script, cursive', fontSize: '2.8rem', color: GOLD_LIGHT, lineHeight: 1.1 }}>{coupleNames}</h1>
                {d.akadDate && <p style={{ color: 'rgba(245,230,208,0.6)', fontSize: '0.75rem', marginTop: 8, letterSpacing: '0.12em' }}>{d.akadDate}</p>}
              </motion.div>
            </div>

            {/* Button */}
            <motion.div className="flex flex-col items-center gap-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }}>
              <motion.span animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 2 }}
                style={{ color: 'rgba(201,168,76,0.4)', fontSize: '0.65rem', letterSpacing: '0.2em' }}>▼ ▼ ▼</motion.span>
              <motion.button onClick={() => setOpened(true)} whileHover={{ scale: 1.05, boxShadow: `0 0 24px ${GOLD}60` }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-8 py-3 rounded-full font-medium text-sm border"
                style={{ background: `linear-gradient(135deg, ${GOLD}, #8B6914)`, borderColor: 'rgba(201,168,76,0.6)', color: BG_DEEP, letterSpacing: '0.08em' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Buka Undangan
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MAIN CONTENT ── */}
      {opened && (
        <div>
          {/* HERO / AYAT */}
          <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 overflow-hidden text-center"
            style={{ background: `linear-gradient(180deg, ${BG_DEEP} 0%, ${BG_MID} 60%, ${BG_DEEP} 100%)`, color: CREAM }}>
            <FloatingParticles count={18} color="#C9A84C" className="opacity-30" />
            <motion.img src="/templates/adat-jawa/gunungan.jpg" alt="" className="w-28 mix-blend-screen opacity-70 mb-6"
              initial={{ opacity: 0, y: -30 }} animate={{ opacity: 0.7, y: 0 }} transition={{ duration: 1 }} />
            <motion.div className="flex items-center gap-4 mb-4"
              initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 1, type: 'spring' }}>
              <span style={{ fontFamily: 'Pinyon Script, cursive', fontSize: '5rem', color: GOLD_LIGHT, lineHeight: 1 }}>{brideNick?.[0] || 'E'}</span>
              <span style={{ color: GOLD, fontSize: '2rem' }}>&amp;</span>
              <span style={{ fontFamily: 'Pinyon Script, cursive', fontSize: '5rem', color: GOLD_LIGHT, lineHeight: 1 }}>{groomNick?.[0] || 'S'}</span>
            </motion.div>
            <GoldDivider />
            <InView>
              <blockquote className="max-w-xs mx-auto">
                <p style={{ color: 'rgba(245,230,208,0.82)', fontSize: '0.82rem', lineHeight: 1.9, fontStyle: 'italic' }}>
                  &ldquo;{d.openingQuote || 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya.'}&rdquo;
                </p>
                <footer className="mt-3" style={{ color: GOLD, fontSize: '0.72rem', letterSpacing: '0.1em' }}>
                  — {d.openingQuoteSource || 'QS. Ar-Rum : 21'} —
                </footer>
              </blockquote>
            </InView>
            <InView>
              <div className="mt-8">
                <p style={{ color: CREAM, fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 8 }}>The Wedding of</p>
                <h2 style={{ fontFamily: 'Pinyon Script, cursive', fontSize: '3.2rem', color: GOLD_LIGHT, lineHeight: 1.1 }}>{coupleNames}</h2>
              </div>
            </InView>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.8 }} className="mt-10" style={{ color: 'rgba(201,168,76,0.4)' }}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" /></svg>
            </motion.div>
          </section>

          {/* COUPLE PROFILES */}
          <section style={sectionBg} className="px-6 py-16">
            <InView>
              <div className="text-center mb-10">
                <h2 style={{ fontFamily: 'Cormorant Infant, serif', fontSize: '1.5rem', color: GOLD_LIGHT, marginBottom: 8 }}>We Are Getting Married!</h2>
                <p style={{ color: 'rgba(245,230,208,0.65)', fontSize: '0.8rem', maxWidth: 280, margin: '0 auto', lineHeight: 1.8 }}>
                  Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan.
                </p>
              </div>
            </InView>
            <div className="flex flex-col gap-8 max-w-sm mx-auto">
              {/* Bride */}
              <InView>
                <div className="flex flex-col items-center gap-4 p-6 rounded-2xl border"
                  style={{ background: 'rgba(201,168,76,0.05)', borderColor: 'rgba(201,168,76,0.2)' }}>
                  <div className="relative w-36 h-36">
                    {d.bridePhoto ? (
                      <img src={d.bridePhoto} alt={brideNick} className="w-full h-full object-cover rounded-full border-2" style={{ borderColor: GOLD }} />
                    ) : (
                      <div className="w-full h-full rounded-full flex items-center justify-center text-5xl border-2" style={{ background: 'rgba(201,168,76,0.08)', borderColor: GOLD }}>👰</div>
                    )}
                    <img src="/templates/adat-jawa/corner-ornament.jpg" alt="" className="absolute -top-2 -left-2 w-10 mix-blend-screen opacity-50" />
                    <img src="/templates/adat-jawa/corner-ornament.jpg" alt="" className="absolute -bottom-2 -right-2 w-10 mix-blend-screen opacity-50 rotate-180" />
                  </div>
                  <div className="text-center">
                    <h3 style={{ fontFamily: 'Pinyon Script, cursive', fontSize: '2.4rem', color: GOLD_LIGHT, lineHeight: 1 }}>{brideNick}</h3>
                    <p style={{ color: CREAM, fontWeight: 500, marginTop: 4, fontSize: '0.88rem' }}>{d.brideFullName || 'Nama Lengkap Mempelai'}</p>
                    <p style={{ color: 'rgba(245,230,208,0.55)', fontSize: '0.75rem', marginTop: 4, lineHeight: 1.7 }}>{d.brideParents || 'Putri dari Bapak & Ibu ...'}</p>
                  </div>
                </div>
              </InView>
              <div className="text-center" style={{ color: GOLD, fontFamily: 'Pinyon Script, cursive', fontSize: '2.8rem' }}>&amp;</div>
              {/* Groom */}
              <InView>
                <div className="flex flex-col items-center gap-4 p-6 rounded-2xl border"
                  style={{ background: 'rgba(201,168,76,0.05)', borderColor: 'rgba(201,168,76,0.2)' }}>
                  <div className="relative w-36 h-36">
                    {d.groomPhoto ? (
                      <img src={d.groomPhoto} alt={groomNick} className="w-full h-full object-cover rounded-full border-2" style={{ borderColor: GOLD }} />
                    ) : (
                      <div className="w-full h-full rounded-full flex items-center justify-center text-5xl border-2" style={{ background: 'rgba(201,168,76,0.08)', borderColor: GOLD }}>🤵</div>
                    )}
                    <img src="/templates/adat-jawa/corner-ornament.jpg" alt="" className="absolute -top-2 -right-2 w-10 mix-blend-screen opacity-50 scale-x-[-1]" />
                    <img src="/templates/adat-jawa/corner-ornament.jpg" alt="" className="absolute -bottom-2 -left-2 w-10 mix-blend-screen opacity-50 rotate-90" />
                  </div>
                  <div className="text-center">
                    <h3 style={{ fontFamily: 'Pinyon Script, cursive', fontSize: '2.4rem', color: GOLD_LIGHT, lineHeight: 1 }}>{groomNick}</h3>
                    <p style={{ color: CREAM, fontWeight: 500, marginTop: 4, fontSize: '0.88rem' }}>{d.groomFullName || 'Nama Lengkap Mempelai'}</p>
                    <p style={{ color: 'rgba(245,230,208,0.55)', fontSize: '0.75rem', marginTop: 4, lineHeight: 1.7 }}>{d.groomParents || 'Putra dari Bapak & Ibu ...'}</p>
                  </div>
                </div>
              </InView>
            </div>
          </section>

          {/* GALLERY HERO */}
          {galleryPhotos.length > 0 && (
            <section className="px-4 py-2" style={{ background: BG_DEEP }}>
              <GalleryCarousel photos={galleryPhotos} />
            </section>
          )}

          {/* SAVE THE DATE */}
          <section className="px-6 py-16 text-center"
            style={{ background: `linear-gradient(160deg, ${BG_MID}, ${BG_LIGHT}, ${BG_MID})`, color: CREAM }}>
            <InView>
              <img src="/templates/adat-jawa/gunungan.jpg" alt="" className="w-24 mx-auto mb-5 mix-blend-screen opacity-70" />
              <h2 style={{ fontFamily: 'Pinyon Script, cursive', fontSize: '2.5rem', color: GOLD_LIGHT, marginBottom: 4 }}>Save the Date</h2>
              <GoldDivider />
              <div className="my-6"><Countdown target={countdownTarget} /></div>
              <p style={{ color: 'rgba(245,230,208,0.65)', fontSize: '0.78rem', maxWidth: 270, margin: '0 auto', lineHeight: 1.9 }}>
                Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami.
              </p>
            </InView>
          </section>

          {/* AKAD & RESEPSI */}
          <section style={sectionBg} className="px-6 py-16">
            <InView>
              <h2 style={{ fontFamily: 'Pinyon Script, cursive', fontSize: '2.2rem', color: GOLD_LIGHT, textAlign: 'center', marginBottom: 20 }}>Waktu &amp; Tempat</h2>
            </InView>
            <div className="flex flex-col gap-6 max-w-sm mx-auto">
              {/* Akad */}
              <InView>
                <div className="p-6 rounded-2xl border text-center" style={{ background: 'rgba(201,168,76,0.06)', borderColor: 'rgba(201,168,76,0.25)' }}>
                  <div className="inline-flex items-center justify-center w-11 h-11 rounded-full mb-3 border" style={{ borderColor: GOLD, color: GOLD }}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 style={{ color: GOLD_LIGHT, fontFamily: 'Cormorant Infant, serif', fontSize: '1.1rem', marginBottom: 6 }}>Akad Nikah</h3>
                  <GoldDivider />
                  <p style={{ color: CREAM, fontSize: '0.82rem' }}>{d.akadDate || 'Hari, DD Bulan YYYY'}</p>
                  <p style={{ color: CREAM, fontSize: '0.82rem', marginTop: 2, marginBottom: 6 }}>{d.akadTime || '08.00 – 10.00 WIB'}</p>
                  <p style={{ color: GOLD, fontWeight: 600, fontSize: '0.82rem' }}>{d.akadVenue || 'Nama Gedung / Masjid'}</p>
                  <p style={{ color: 'rgba(245,230,208,0.55)', fontSize: '0.72rem', marginTop: 3, lineHeight: 1.7 }}>{d.akadAddress || 'Alamat lokasi akad nikah'}</p>
                  {d.akadMapsUrl && (
                    <a href={d.akadMapsUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 rounded-lg text-xs border"
                      style={{ borderColor: GOLD, color: GOLD }}>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Google Maps
                    </a>
                  )}
                </div>
              </InView>

              {/* Resepsi */}
              <InView>
                <div className="p-6 rounded-2xl border text-center" style={{ background: 'rgba(201,168,76,0.06)', borderColor: 'rgba(201,168,76,0.25)' }}>
                  <div className="inline-flex items-center justify-center w-11 h-11 rounded-full mb-3 border" style={{ borderColor: GOLD, color: GOLD }}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <h3 style={{ color: GOLD_LIGHT, fontFamily: 'Cormorant Infant, serif', fontSize: '1.1rem', marginBottom: 6 }}>Resepsi</h3>
                  <GoldDivider />
                  <p style={{ color: CREAM, fontSize: '0.82rem' }}>{d.receptionDate || 'Hari, DD Bulan YYYY'}</p>
                  <p style={{ color: CREAM, fontSize: '0.82rem', marginTop: 2, marginBottom: 6 }}>{d.receptionTime || '11.00 – 17.00 WIB'}</p>
                  <p style={{ color: GOLD, fontWeight: 600, fontSize: '0.82rem' }}>{d.receptionVenue || 'Nama Gedung Resepsi'}</p>
                  <p style={{ color: 'rgba(245,230,208,0.55)', fontSize: '0.72rem', marginTop: 3, lineHeight: 1.7 }}>{d.receptionAddress || 'Alamat lokasi resepsi pernikahan'}</p>
                  {d.receptionMapsUrl && (
                    <a href={d.receptionMapsUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 rounded-lg text-xs border"
                      style={{ borderColor: GOLD, color: GOLD }}>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Google Maps
                    </a>
                  )}
                </div>
              </InView>

              {/* Live Streaming */}
              {d.livestreamUrl1 && (
                <InView>
                  <div className="p-5 rounded-2xl border text-center" style={{ background: 'rgba(201,168,76,0.06)', borderColor: 'rgba(201,168,76,0.25)' }}>
                    <h3 style={{ color: GOLD_LIGHT, fontFamily: 'Cormorant Infant, serif', fontSize: '1.05rem', marginBottom: 4 }}>Live Streaming</h3>
                    <p style={{ color: 'rgba(245,230,208,0.6)', fontSize: '0.75rem', marginBottom: 10 }}>Saksikan momen bahagia kami secara virtual</p>
                    <a href={d.livestreamUrl1} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium"
                      style={{ background: `linear-gradient(135deg, ${GOLD}, #8B6914)`, color: BG_DEEP }}>
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
            <section style={{ background: BG_DEEP }} className="px-6 py-16">
              <InView>
                <img src="/templates/adat-jawa/gunungan.jpg" alt="" className="w-20 mx-auto mb-4 mix-blend-screen opacity-60" />
                <h2 style={{ fontFamily: 'Pinyon Script, cursive', fontSize: '2.2rem', color: GOLD_LIGHT, textAlign: 'center', marginBottom: 12 }}>Our Gallery</h2>
                <GoldDivider />
              </InView>
              <div className="mt-4 grid grid-cols-3 gap-2 max-w-sm mx-auto">
                {galleryPhotos.map((p, i) => (
                  <InView key={i}>
                    <div className="rounded-lg overflow-hidden aspect-square border" style={{ borderColor: 'rgba(201,168,76,0.2)' }}>
                      <img src={p} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                    </div>
                  </InView>
                ))}
              </div>
            </section>
          )}

          {/* LOVE STORY */}
          <section style={{ background: `linear-gradient(180deg, ${BG_MID}, ${BG_DEEP})`, color: CREAM }} className="px-6 py-16">
            <InView>
              <img src="/templates/adat-jawa/gunungan.jpg" alt="" className="w-20 mx-auto mb-4 mix-blend-screen opacity-60" />
              <h2 style={{ fontFamily: 'Pinyon Script, cursive', fontSize: '2.2rem', color: GOLD_LIGHT, textAlign: 'center', marginBottom: 8 }}>Love Story</h2>
              <GoldDivider />
            </InView>
            <div className="mt-8 max-w-sm mx-auto">
              {loveStory.map((item, i) => (
                <InView key={i}>
                  <div className="flex gap-4 pb-8">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 text-xs font-bold" style={{ borderColor: GOLD, background: BG_DEEP, color: GOLD }}>✦</div>
                      {i < loveStory.length - 1 && <div className="w-px flex-1 mt-1" style={{ background: 'rgba(201,168,76,0.25)', minHeight: 24 }} />}
                    </div>
                    <div className="flex-1">
                      <span className="text-xs font-bold px-3 py-1 rounded-full inline-block mb-2" style={{ background: 'rgba(201,168,76,0.15)', color: GOLD }}>{item.year}</span>
                      <p style={{ color: 'rgba(245,230,208,0.72)', fontSize: '0.8rem', lineHeight: 1.8 }}>{item.text}</p>
                    </div>
                  </div>
                </InView>
              ))}
            </div>
          </section>

          {/* LOVE GIFT */}
          {(d.giftBankAccount || d.giftAddress) && (
            <section style={sectionBg} className="px-6 py-16">
              <InView>
                <img src="/templates/adat-jawa/gunungan.jpg" alt="" className="w-20 mx-auto mb-4 mix-blend-screen opacity-60" />
                <h2 style={{ fontFamily: 'Pinyon Script, cursive', fontSize: '2.2rem', color: GOLD_LIGHT, textAlign: 'center', marginBottom: 4 }}>Love Gift</h2>
                <p style={{ color: 'rgba(245,230,208,0.6)', fontSize: '0.75rem', textAlign: 'center', marginBottom: 12 }}>Tanpa mengurangi rasa hormat, bagi yang ingin memberikan tanda kasih</p>
                <GoldDivider />
              </InView>
              <div className="flex flex-col gap-5 max-w-sm mx-auto mt-4">
                {d.giftBankAccount && (
                  <InView>
                    <div className="p-5 rounded-2xl border text-center" style={{ background: 'rgba(201,168,76,0.06)', borderColor: 'rgba(201,168,76,0.25)' }}>
                      <svg className="w-8 h-8 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: GOLD }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      <p style={{ color: GOLD_LIGHT, fontWeight: 600, fontSize: '0.88rem' }}>{d.giftBankName || 'Transfer Bank'}</p>
                      <p style={{ color: CREAM, fontSize: '1.1rem', fontWeight: 700, letterSpacing: '0.08em', marginTop: 4 }}>{d.giftBankAccount}</p>
                      <p style={{ color: 'rgba(245,230,208,0.55)', fontSize: '0.75rem', marginTop: 2 }}>a.n {d.giftAccountHolder || 'Nama Pemilik'}</p>
                      <CopyButton text={d.giftBankAccount} label="Salin Nomor Rekening" />
                    </div>
                  </InView>
                )}
                {d.giftAddress && (
                  <InView>
                    <div className="p-5 rounded-2xl border text-center" style={{ background: 'rgba(201,168,76,0.06)', borderColor: 'rgba(201,168,76,0.25)' }}>
                      <svg className="w-8 h-8 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: GOLD }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      <p style={{ color: GOLD_LIGHT, fontWeight: 600, fontSize: '0.88rem', marginBottom: 4 }}>Kirim Kado</p>
                      {d.giftRecipientName && <p style={{ color: CREAM, fontSize: '0.85rem', fontWeight: 600 }}>{d.giftRecipientName}</p>}
                      <p style={{ color: 'rgba(245,230,208,0.6)', fontSize: '0.75rem', lineHeight: 1.7 }}>{d.giftAddress}</p>
                      <CopyButton text={d.giftAddress} label="Salin Alamat" />
                    </div>
                  </InView>
                )}
              </div>
            </section>
          )}

          {/* WISHES / RSVP */}
          <section style={{ background: `linear-gradient(180deg, ${BG_DEEP}, ${BG_MID})`, color: CREAM }} className="px-6 py-16">
            <InView>
              <img src="/templates/adat-jawa/gunungan.jpg" alt="" className="w-20 mx-auto mb-4 mix-blend-screen opacity-60" />
              <h2 style={{ fontFamily: 'Pinyon Script, cursive', fontSize: '2.2rem', color: GOLD_LIGHT, textAlign: 'center', marginBottom: 4 }}>Wishes</h2>
              <p style={{ color: 'rgba(245,230,208,0.6)', fontSize: '0.75rem', textAlign: 'center', marginBottom: 12 }}>Ucapan Selamat &amp; Do&apos;a</p>
              <GoldDivider />
            </InView>
            <div className="mt-4 max-w-sm mx-auto">
              <RsvpForm invitationId={invitationId} theme="dark" />
            </div>
          </section>

          {/* CLOSING */}
          <section className="px-6 py-20 text-center"
            style={{ background: `linear-gradient(160deg, ${BG_MID}, ${BG_LIGHT}, ${BG_DEEP})`, color: CREAM }}>
            <InView>
              <img src="/templates/adat-jawa/gunungan.jpg" alt="" className="w-28 mx-auto mb-6 mix-blend-screen opacity-70" />
              <h2 style={{ fontFamily: 'Cormorant Infant, serif', color: GOLD_LIGHT, fontSize: '1.15rem', letterSpacing: '0.05em' }}>Terima Kasih</h2>
              <GoldDivider />
              <p style={{ color: 'rgba(245,230,208,0.68)', fontSize: '0.8rem', maxWidth: 270, margin: '0 auto 16px', lineHeight: 1.9 }}>
                {d.closingMessage || "Suatu kebahagiaan & kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan do'a restu."}
              </p>
              <p style={{ color: 'rgba(245,230,208,0.45)', fontSize: '0.72rem', marginBottom: 6 }}>Kami yang Berbahagia</p>
              <h3 style={{ fontFamily: 'Pinyon Script, cursive', fontSize: '2.5rem', color: GOLD_LIGHT }}>{coupleNames}</h3>
              <div className="flex justify-center mt-8 opacity-40">
                <img src="/templates/adat-jawa/corner-ornament.jpg" alt="" className="w-24 mix-blend-screen" />
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
