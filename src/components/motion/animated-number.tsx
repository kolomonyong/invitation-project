// src/components/motion/animated-number.tsx
// Counter that smoothly animates from 0 to target value.
// Inspired by motion-primitives AnimatedNumber component.
'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'motion/react';

type AnimatedNumberProps = {
  value: number;
  className?: string;
  style?: React.CSSProperties;
  padStart?: number;
  duration?: number;
};

export function AnimatedNumber({
  value,
  className,
  style,
  padStart = 2,
  duration = 1200,
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const startTime = Date.now();
    const startValue = 0;
    const endValue = Math.max(0, value);

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValue + (endValue - startValue) * eased);
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className={className} style={style}>
      {String(displayValue).padStart(padStart, '0')}
    </span>
  );
}
