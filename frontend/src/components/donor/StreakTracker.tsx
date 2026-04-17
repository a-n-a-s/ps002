import { motion } from 'framer-motion';
import { Flame, Calendar } from 'lucide-react';

interface StreakTrackerProps {
  streak: number;
  donatedDays?: boolean[]; // last 12 days, true = donated
}

export function StreakTracker({ streak, donatedDays }: StreakTrackerProps) {
  // Default: last 12 days pattern based on streak
  const days = donatedDays || Array.from({ length: 12 }, (_, i) => {
    const dayIndex = 11 - i;
    return dayIndex < streak;
  }).reverse();

  const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F'];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-text-muted" />
          <span className="text-xs font-bold uppercase tracking-widest text-text-muted">
            Donation Streak
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-warning/10 border border-warning/20">
          <Flame className="w-3 h-3 text-warning" />
          <span className="text-sm font-display font-black text-warning">{streak}</span>
          <span className="text-xs text-warning/70">days</span>
        </div>
      </div>

      <div className="flex items-end gap-1.5">
        {days.map((donated, i) => (
          <div key={i} className="flex flex-col items-center gap-1 flex-1">
            <motion.div
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              className={`
                w-full rounded-sm transition-all duration-300
                ${donated
                  ? 'bg-gradient-to-t from-blood to-[#FF4D79]'
                  : 'bg-white/8 border border-white/10'
                }
              `}
              style={{
                height: donated ? '20px' : '12px',
                boxShadow: donated ? '0 0 8px rgba(255,0,60,0.4)' : 'none',
              }}
            />
            <span className="text-[9px] text-text-muted font-medium">{dayLabels[i]}</span>
          </div>
        ))}
      </div>

      <p className="text-xs text-text-muted text-center">
        Last 12 days · {days.filter(Boolean).length} donations recorded
      </p>
    </div>
  );
}
