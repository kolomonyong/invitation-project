"use client";

import { useState } from 'react';
import RsvpForm from "../RsvpForm";
import Image from "next/image";
import { motion, AnimatePresence } from 'motion/react';
import { InView, InViewScale, InViewSlideLeft } from '@/components/motion/in-view';
import { TextEffect } from '@/components/motion/text-effect';
import { FloatingParticles } from '@/components/motion/floating-particles';
import JSConfetti from 'js-confetti';
import { useEffect, useRef } from 'react';

type BirthdayTemplateProps = {
  invitationId: string;
  custom_data: {
    hostName?: string;
    eventDate?: string;
    eventLocation?: string;
    mainImage?: string;
  };
};

export default function BirthdayTemplate1({
  invitationId,
  custom_data,
}: Readonly<BirthdayTemplateProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const jsConfettiRef = useRef<JSConfetti | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && !jsConfettiRef.current) {
        jsConfettiRef.current = new JSConfetti();
    }
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    if (jsConfettiRef.current) {
        jsConfettiRef.current.addConfetti({
            confettiColors: ['#ff0a54', '#ff477e', '#ff7096', '#ff85a1', '#fbb1bd', '#f9bec7'],
            confettiNumber: 150,
        });
    }
  };

  const formattedDate = custom_data.eventDate
    ? new Date(custom_data.eventDate).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "A wonderful day";

  if (!isOpen) {
    return (
        <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
            <FloatingParticles count={20} color="#ff7096" minSize={3} maxSize={8} />
            
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden relative z-10 border-4 border-white transform transition-transform">
                <div className="p-10 text-center flex flex-col items-center justify-center min-h-[400px]">
                    <motion.div 
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                        className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mb-6 text-4xl"
                    >
                        🎉
                    </motion.div>
                    
                    <TextEffect as="p" per="word" delay={0.5} className="text-gray-500 font-bold uppercase tracking-widest text-sm mb-4">
                        You're Invited To
                    </TextEffect>
                    
                    <TextEffect 
                        as="h1" 
                        per="char" 
                        delay={1} 
                        className="text-4xl md:text-5xl font-extrabold text-pink-500 mb-8 leading-tight"
                    >
                        {`${custom_data.hostName || "Our Friend"}'s Birthday`}
                    </TextEffect>
                    
                    <motion.button
                        onClick={handleOpen}
                        className="bg-pink-500 text-white font-bold py-4 px-10 rounded-full shadow-lg shadow-pink-500/30 w-full"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 2, type: 'spring' }}
                        whileHover={{ scale: 1.05, backgroundColor: "#ec4899" }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Let's Celebrate! 🎈
                    </motion.button>
                </div>
            </div>
        </div>
    );
  }

  return (
    <AnimatePresence>
        <motion.div 
            className="min-h-screen bg-pink-50 flex items-center justify-center p-4 font-sans relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", duration: 0.8 }}
        >
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden z-10">
            {custom_data.mainImage && (
            <motion.div 
                className="relative w-full h-72"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <Image
                src={custom_data.mainImage}
                alt={custom_data.hostName || "Invitation Photo"}
                fill
                sizes="(max-width: 768px) 100vw, 500px"
                className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
            </motion.div>
            )}

            <div className="p-8 -mt-6 relative z-20 bg-white rounded-t-3xl">
            <InView>
                <h1 className="text-3xl font-black text-center mb-1 text-gray-800">
                    You&apos;re Invited!
                </h1>
                <p className="text-center text-gray-500 font-medium mb-6">to celebrate the birthday of</p>
            </InView>

            <InViewScale transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}>
                <div className="text-center mb-10 bg-pink-50 p-6 rounded-2xl border border-pink-100">
                    <p className="text-5xl font-extrabold text-pink-500 tracking-tight leading-none">
                        {custom_data.hostName || "Our Friend"}
                    </p>
                </div>
            </InViewScale>

            <div className="space-y-6 text-center">
                <InViewSlideLeft transition={{ delay: 0.3 }}>
                    <div className="flex flex-col items-center justify-center p-4 rounded-xl hover:bg-gray-50 transition-colors">
                        <div className="w-10 h-10 bg-pink-100 text-pink-500 rounded-full flex items-center justify-center mb-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        </div>
                        <p className="font-bold text-sm uppercase tracking-widest text-gray-400 mb-1">When</p>
                        <p className="text-xl font-bold text-gray-800">{formattedDate}</p>
                    </div>
                </InViewSlideLeft>
                
                <InViewSlideLeft transition={{ delay: 0.4 }}>
                    <div className="flex flex-col items-center justify-center p-4 rounded-xl hover:bg-gray-50 transition-colors">
                        <div className="w-10 h-10 bg-pink-100 text-pink-500 rounded-full flex items-center justify-center mb-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        </div>
                        <p className="font-bold text-sm uppercase tracking-widest text-gray-400 mb-1">Where</p>
                        <p className="text-xl font-bold text-gray-800">{custom_data.eventLocation || "A special place"}</p>
                    </div>
                </InViewSlideLeft>
            </div>

            <InView transition={{ delay: 0.5 }}>
                <div className="mt-10 border-t-2 border-dashed border-gray-200 pt-8">
                    <h2 className="text-2xl font-black text-center mb-6 text-gray-800 flex items-center justify-center gap-2">
                        <span>RSVP</span>
                        <span className="text-pink-500">Now</span>
                    </h2>
                    <RsvpForm invitationId={invitationId} />
                </div>
            </InView>
            </div>
        </div>
        </motion.div>
    </AnimatePresence>
  );
}
