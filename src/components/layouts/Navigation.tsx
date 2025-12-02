'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';

export function Navigation() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  return [
    ['Features', '#'],
    ['Reviews', '#'],
    ['Pricing', '#'],
    ['FAQs', '#'],
  ].map(([label, href], index) => (
    <Link
      key={label}
      href={href}
      className="relative -mx-3 -my-2 rounded-lg px-3 py-2 text-sm font-medium"
      onMouseEnter={() => {
        if (timeoutRef.current) {
          window.clearTimeout(timeoutRef.current);
        }
        setHoveredIndex(index);
      }}
      onMouseLeave={() => {
        timeoutRef.current = window.setTimeout(() => {
          setHoveredIndex(null);
        }, 200);
      }}
    >
      <AnimatePresence>
        {hoveredIndex === index && (
          <motion.span
            className="absolute inset-0 rounded-lg bg-yellow-400"
            layoutId="hoverBackground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5, transition: { duration: 0.15 } }}
            exit={{
              opacity: 0,
              transition: { duration: 0.15 },
            }}
          />
        )}
      </AnimatePresence>
      <span className="relative z-10">{label}</span>
    </Link>
  ));
}
