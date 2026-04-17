import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown } from 'lucide-react';

interface AlertScreenProps {
  bloodType: string;
  hospitalName: string;
  distance: string;
  urgency: 'critical' | 'warning' | 'stable';
  survival: number;
  onAccept: () => void;
  onDecline: () => void;
}

const DECLINE_REASONS = [
  'Currently unavailable',
  'Location too far',
  'Health issue',
  'At work',
  'Recent donation',
  'Other',
];

const ALERT_CHANNELS = [
  { icon: '📱', label: 'App notification sent', time: '2s ago', color: '#00FF66' },
  { icon: '💬', label: 'WhatsApp sent', time: '3s ago', color: '#25D366' },
  { icon: '📞', label: 'Auto-call initiated', time: '4s ago', color: '#00E5FF' },
];

export function AlertScreen({
  bloodType,
  hospitalName,
  distance,
  survival,
  onAccept,
  onDecline,
}: AlertScreenProps) {
  const [timeLeft, setTimeLeft] = useState(45);
  const [showDeclineMenu, setShowDeclineMenu] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [channelIndex, setChannelIndex] = useState(0);

  // Countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(t => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Progressive channel reveal
  useEffect(() => {
    const timer = setInterval(() => {
      setChannelIndex(i => Math.min(i + 1, ALERT_CHANNELS.length - 1));
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const survivalImproved = Math.min(survival + 36, 100);

  // SVG arc for survival meter
  const radius = 52;
  const circ = 2 * Math.PI * radius;
  const arcOffset = circ - (survivalImproved / 100) * circ;
  const baseOffset = circ - (survival / 100) * circ;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#05050A]/98 overflow-y-auto py-6"
    >
      {/* Pulsing red border */}
      <motion.div
        animate={{
          boxShadow: [
            'inset 0 0 0px rgba(255,0,60,0)',
            'inset 0 0 60px rgba(255,0,60,0.2)',
            'inset 0 0 0px rgba(255,0,60,0)',
          ],
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="fixed inset-0 pointer-events-none z-[9998]"
      />

      <div className="w-full max-w-md mx-4">
        {/* Header badge */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-center mb-4"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blood/15 border border-blood/40 text-blood text-xs font-bold uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-blood animate-ping absolute" />
            <span className="w-2 h-2 rounded-full bg-blood relative" />
            Emergency Alert — Respond Now
          </span>
        </motion.div>

        {/* Main card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 20 }}
          className="relative rounded-2xl overflow-hidden border border-blood/30 bg-gradient-to-b from-[#1a0008] to-[#05050A]"
          style={{ boxShadow: '0 0 40px rgba(255,0,60,0.2), 0 0 100px rgba(255,0,60,0.05)' }}
        >
          {/* Blood type hero */}
          <div className="text-center pt-8 pb-4">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 400, damping: 15 }}
              className="text-[90px] font-display font-black leading-none"
              style={{
                background: 'linear-gradient(135deg, #FF003C, #FF4D79)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: 'none',
                filter: 'drop-shadow(0 0 20px rgba(255,0,60,0.6))',
              }}
            >
              {bloodType}
            </motion.div>
            <p className="text-white/50 font-semibold uppercase tracking-widest text-sm mt-1">
              Blood Needed Urgently
            </p>
          </div>

          {/* Info row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="flex items-center justify-center gap-6 px-6 py-3 bg-white/3 border-y border-white/5"
          >
            <div className="text-center">
              <p className="text-xs text-white/40 uppercase tracking-wider">Hospital</p>
              <p className="font-bold text-white text-sm mt-0.5">{hospitalName}</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <p className="text-xs text-white/40 uppercase tracking-wider">Distance</p>
              <p className="font-bold text-info text-sm mt-0.5">{distance}</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <p className="text-xs text-white/40 uppercase tracking-wider">ETA</p>
              <p className="font-bold text-success text-sm mt-0.5">8 min</p>
            </div>
          </motion.div>

          {/* Survival meter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="px-6 py-5 flex items-center gap-5"
          >
            <div className="relative w-28 h-28 flex-shrink-0">
              <svg className="-rotate-90 w-full h-full" viewBox="0 0 120 120">
                {/* Track */}
                <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                {/* Base survival */}
                <circle
                  cx="60" cy="60" r={radius} fill="none"
                  stroke="rgba(255,0,60,0.25)" strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circ} strokeDashoffset={baseOffset}
                />
                {/* Improved survival (animated) */}
                <motion.circle
                  cx="60" cy="60" r={radius} fill="none"
                  stroke="#00FF66" strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circ}
                  initial={{ strokeDashoffset: circ }}
                  animate={{ strokeDashoffset: arcOffset }}
                  transition={{ delay: 0.8, duration: 1.2, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-display font-black text-success">{survivalImproved}%</span>
                <span className="text-[9px] text-white/40 uppercase tracking-wider">If You Act</span>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white/80 leading-snug">
                Your response could raise the patient's survival probability from{' '}
                <span className="text-blood font-bold">{survival}%</span> to{' '}
                <span className="text-success font-bold">{survivalImproved}%</span>
              </p>

              {/* Alert channels */}
              <div className="mt-3 space-y-1">
                {ALERT_CHANNELS.slice(0, channelIndex + 1).map((ch, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 text-xs"
                  >
                    <span>{ch.icon}</span>
                    <span style={{ color: ch.color }} className="font-medium">{ch.label}</span>
                    <span className="text-white/30">— {ch.time}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Countdown timer */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col items-center py-4 border-t border-white/5"
          >
            <span className="text-xs text-white/40 uppercase tracking-widest mb-1">Respond within</span>
            <motion.span
              animate={timeLeft < 10 ? {
                color: ['#FF003C', '#FF6B6B', '#FF003C'],
                scale: [1, 1.05, 1],
              } : {}}
              transition={{ duration: 0.5, repeat: Infinity }}
              className={`text-5xl font-mono font-black tabular-nums ${timeLeft < 10 ? 'text-blood' : 'text-white'}`}
            >
              {timeDisplay}
            </motion.span>
            {/* Progress bar */}
            <div className="w-full px-6 mt-2">
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-blood to-warning"
                  initial={{ width: '100%' }}
                  animate={{ width: `${(timeLeft / 45) * 100}%` }}
                  transition={{ duration: 1, ease: 'linear' }}
                />
              </div>
            </div>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="px-6 pb-6 space-y-3"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onAccept}
              className="w-full py-4 rounded-xl font-display font-bold text-lg text-white
                bg-gradient-to-r from-[#00CC52] to-[#00FF66] uppercase tracking-wider
                shadow-[0_0_30px_rgba(0,255,102,0.4)] transition-all"
            >
              ✓ Accept — I Can Donate
            </motion.button>

            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setShowDeclineMenu(!showDeclineMenu)}
                className="w-full py-3 rounded-xl font-semibold text-white/60 border border-white/10
                  bg-white/3 hover:bg-white/6 hover:text-white/80 transition-all flex items-center justify-center gap-2"
              >
                ✗ Decline
                <ChevronDown className={`w-4 h-4 transition-transform ${showDeclineMenu ? 'rotate-180' : ''}`} />
              </motion.button>

              <AnimatePresence>
                {showDeclineMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute bottom-full left-0 right-0 mb-2 bg-[#0a0a18] border border-white/10 rounded-xl overflow-hidden z-10"
                    style={{ boxShadow: '0 -10px 40px rgba(0,0,0,0.5)' }}
                  >
                    <p className="px-4 py-2 text-xs text-white/40 uppercase tracking-wider border-b border-white/5">
                      Reason for declining
                    </p>
                    {DECLINE_REASONS.map(reason => (
                      <button
                        key={reason}
                        onClick={() => {
                          setDeclineReason(reason);
                          setShowDeclineMenu(false);
                          onDecline();
                        }}
                        className={`w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-white/5 flex items-center justify-between ${declineReason === reason ? 'text-blood' : 'text-white/70'}`}
                      >
                        {reason}
                        {declineReason === reason && <X className="w-3 h-3" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}