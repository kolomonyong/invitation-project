// src/components/motion/text-effect.tsx
// Animated text that reveals per-word or per-character.
// Inspired by motion-primitives TextEffect component.
'use client';

import { useMemo } from 'react';
import { motion, type Variant } from 'motion/react';

type TextEffectProps = {
  children: string;
  per?: 'word' | 'char';
  delay?: number;
  className?: string;
  variants?: {
    hidden: Variant;
    visible: Variant;
  };
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'span' | 'div';
  style?: React.CSSProperties;
};

const defaultVariants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(6px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
};

export function TextEffect({
  children,
  per = 'word',
  delay = 0,
  className,
  variants = defaultVariants,
  as: Tag = 'p',
  style,
}: TextEffectProps) {
  const MotionTag = motion.create(Tag);

  const segments = useMemo(() => {
    if (per === 'char') {
      return children.split('').map((char, i) => ({ text: char, key: i }));
    }
    return children.split(' ').map((word, i) => ({ text: word, key: i }));
  }, [children, per]);

  return (
    <MotionTag
      className={className}
      style={style}
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: per === 'char' ? 0.03 : 0.08, delayChildren: delay }}
    >
      {segments.map((segment) => (
        <motion.span
          key={segment.key}
          variants={variants}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ display: 'inline-block', whiteSpace: 'pre' }}
        >
          {segment.text}
          {per === 'word' ? ' ' : ''}
        </motion.span>
      ))}
    </MotionTag>
  );
}

// Preset: slide-up text effect
export function TextSlideUp({
  children,
  delay = 0,
  className,
  style,
  as = 'p',
}: Omit<TextEffectProps, 'per' | 'variants'>) {
  return (
    <TextEffect
      per="word"
      delay={delay}
      className={className}
      style={style}
      as={as}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      {children}
    </TextEffect>
  );
}
