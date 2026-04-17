import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface LivesSavedCounterProps {
  target: number;
  duration?: number;
}

export function LivesSavedCounter({ target, duration = 1500 }: LivesSavedCounterProps) {
  const [count, setCount] = useState(0);
  const frameRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // cubic-bezier ease out
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(ease * target));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [target, duration]);

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 1.4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="w-14 h-14 rounded-full bg-blood/15 flex items-center justify-center border border-blood/25"
        style={{ boxShadow: '0 0 20px rgba(255,0,60,0.2)' }}
      >
        <Heart className="w-7 h-7 text-blood fill-blood/30" />
      </motion.div>

      <motion.span
        className="text-6xl font-display font-black tabular-nums"
        style={{
          background: 'linear-gradient(135deg, #FF003C 0%, #FF4D79 50%, #FF003C 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        {count}
      </motion.span>

      <div className="text-center">
        <p className="text-sm font-bold text-text-primary">Lives Saved</p>
        <p className="text-xs text-success mt-0.5">+3 this month</p>
      </div>
    </div>
  );
}
