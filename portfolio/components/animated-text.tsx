"use client";

import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedTextProps {
  text: string;
  className?: string;
  once?: boolean;
}

export function AnimatedText({ text, className, once = true }: AnimatedTextProps) {
  const words = text.split(' ');
  const controls = useAnimation();

  useEffect(() => {
    controls.start((i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 },
    }));
  }, [controls]);

  return (
    <motion.div className={cn('flex flex-wrap', className)}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          custom={i}
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          className="mr-2"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}