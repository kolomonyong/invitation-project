// src/components/motion/floating-particles.tsx
// Decorative floating particles (stars/sparkles) for romantic backgrounds.
'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion } from 'motion/react';

type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
};

type FloatingParticlesProps = {
  count?: number;
  color?: string;
  className?: string;
  minSize?: number;
  maxSize?: number;
};

export function FloatingParticles({
  count = 20,
  color = '#c9a84c',
  className = '',
  minSize = 2,
  maxSize = 5,
}: FloatingParticlesProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: minSize + Math.random() * (maxSize - minSize),
      duration: 8 + Math.random() * 12,
      delay: Math.random() * 6,
      opacity: 0.15 + Math.random() * 0.4,
    }));
  }, [count, minSize, maxSize]);

  if (!mounted) return null;

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: color,
            boxShadow: `0 0 ${p.size * 2}px ${p.size}px ${color}40`,
          }}
          animate={{
            y: [0, -30, 0, 20, 0],
            x: [0, 15, -10, 5, 0],
            opacity: [p.opacity * 0.5, p.opacity, p.opacity * 0.7, p.opacity, p.opacity * 0.5],
            scale: [1, 1.2, 0.9, 1.1, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// Star-shaped sparkle variant
export function FloatingSparkles({
  count = 12,
  color = '#c9a84c',
  className = '',
}: Omit<FloatingParticlesProps, 'minSize' | 'maxSize'>) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sparkles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 6 + Math.random() * 10,
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 5,
    }));
  }, [count]);

  if (!mounted) return null;

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {sparkles.map((s) => (
        <motion.svg
          key={s.id}
          className="absolute"
          style={{ left: `${s.x}%`, top: `${s.y}%` }}
          width={s.size}
          height={s.size}
          viewBox="0 0 24 24"
          fill={color}
          animate={{
            opacity: [0, 0.6, 0],
            scale: [0.5, 1, 0.5],
            rotate: [0, 180],
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <path d="M12 2L13.5 8.5L20 7L15 12L20 17L13.5 15.5L12 22L10.5 15.5L4 17L9 12L4 7L10.5 8.5L12 2Z" />
        </motion.svg>
      ))}
    </div>
  );
}
