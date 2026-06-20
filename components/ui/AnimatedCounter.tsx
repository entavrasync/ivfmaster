'use client';

import { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  duration?: number;
}

export function AnimatedCounter({
  value,
  suffix = '',
  duration = 2000,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let startValue = 0;
          const increment = value / (duration / 16);
          const interval = setInterval(() => {
            startValue += increment;
            if (startValue >= value) {
              setCount(value);
              clearInterval(interval);
            } else {
              setCount(Math.floor(startValue));
            }
          }, 16);

          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [value, duration]);

  return (
    <div ref={ref} className="text-4xl font-bold text-ivf-pink">
      {count.toLocaleString()}
      {suffix}
    </div>
  );
}
