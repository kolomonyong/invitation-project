// src/components/motion/in-view.tsx
// Scroll-triggered reveal animation wrapper.
// Inspired by motion-primitives InView component.
'use client';

import { useRef, useEffect, useState, type ReactNode } from 'react';
import {
  motion,
  useInView,
  type Variant,
  type Transition,
} from 'motion/react';

type InViewProps = {
  children: ReactNode;
  variants?: {
    hidden: Variant;
    visible: Variant;
  };
  transition?: Transition;
  viewOptions?: {
    once?: boolean;
    margin?: string;
    amount?: number | 'some' | 'all';
  };
  className?: string;
  as?: 'div' | 'section' | 'article' | 'span';
};

const defaultVariants = {
  hidden: { opacity: 0, y: 32, filter: 'blur(4px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
};

export function InView({
  children,
  variants = defaultVariants,
  transition = { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  viewOptions = { once: true, margin: '-64px', amount: 0.15 },
  className,
}: InViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: viewOptions.once,
    margin: viewOptions.margin as `${number}px`,
    amount: viewOptions.amount === 'some' ? 0.1 : viewOptions.amount === 'all' ? 1 : viewOptions.amount,
  });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Preset: slide from left
export function InViewSlideLeft(props: Omit<InViewProps, 'variants'>) {
  return (
    <InView
      {...props}
      variants={{
        hidden: { opacity: 0, x: -60, filter: 'blur(4px)' },
        visible: { opacity: 1, x: 0, filter: 'blur(0px)' },
      }}
    />
  );
}

// Preset: slide from right
export function InViewSlideRight(props: Omit<InViewProps, 'variants'>) {
  return (
    <InView
      {...props}
      variants={{
        hidden: { opacity: 0, x: 60, filter: 'blur(4px)' },
        visible: { opacity: 1, x: 0, filter: 'blur(0px)' },
      }}
    />
  );
}

// Preset: scale up
export function InViewScale(props: Omit<InViewProps, 'variants'>) {
  return (
    <InView
      {...props}
      variants={{
        hidden: { opacity: 0, scale: 0.85 },
        visible: { opacity: 1, scale: 1 },
      }}
    />
  );
}
