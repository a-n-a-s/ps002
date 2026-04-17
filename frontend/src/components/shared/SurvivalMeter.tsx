import { motion } from 'framer-motion';

interface SurvivalMeterProps {
  value: number;
  climbing?: boolean;
  stages?: number[];
}

export function SurvivalMeter({ value, climbing = false, stages }: SurvivalMeterProps) {
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (value / 100) * circumference;

  const color = value < 40 ? '#FF003C' : value < 70 ? '#FFD600' : '#00FF66';
  const label = value < 40 ? 'Critical' : value < 70 ? 'Improving' : 'Stable';

  return (
    <div className="p-5 rounded-2xl bg-white/3 border border-white/8 flex flex-col items-center gap-2">
      <span className="text-xs font-bold uppercase tracking-widest text-text-muted">Survival Probability</span>

      <div className="relative w-28 h-28">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
          <motion.circle
            cx="50" cy="50" r="40" fill="none"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: climbing ? 2 : 1, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 6px ${color}66)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-2xl font-display font-black"
            style={{ color }}
          >
            {value}%
          </motion.span>
          <span className="text-[9px] uppercase tracking-widest" style={{ color }}>{label}</span>
        </div>
      </div>

      {stages && (
        <div className="flex items-center gap-1.5 mt-1">
          {stages.map((stage, i) => (
            <div key={i} className="flex items-center gap-1">
              <motion.span
                initial={{ opacity: 0.3 }}
                animate={{ opacity: i === stages.length - 1 ? 1 : 0.5 }}
                className="text-sm font-bold tabular-nums"
                style={{ color: i === stages.length - 1 ? '#00FF66' : 'rgba(255,255,255,0.4)' }}
              >
                {stage}%
              </motion.span>
              {i < stages.length - 1 && (
                <span className="text-white/20 text-xs">→</span>
              )}
            </div>
          ))}
        </div>
      )}

      <motion.span
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-xs text-success font-medium"
      >
        ↑ +{Math.min(100 - value, 36)}% with donor confirmed
      </motion.span>
    </div>
  );
}

interface InventoryRowProps {
  bloodType: string;
  units: number;
}

export function InventoryRow({ bloodType, units }: InventoryRowProps) {
  const maxUnits = 20;
  const percentage = (units / maxUnits) * 100;

  let variant: 'critical' | 'warning' | 'success' = 'success';
  if (units < 3) variant = 'critical';
  else if (units < 8) variant = 'warning';

  const colorClass =
    variant === 'critical' ? 'bg-blood' : variant === 'warning' ? 'bg-warning' : 'bg-success';
  const textColorClass =
    variant === 'critical' ? 'text-blood' : variant === 'warning' ? 'text-warning' : 'text-success';

  return (
    <div className={`flex items-center gap-2 py-1.5 px-2 rounded-lg transition-all ${variant === 'critical' ? 'bg-blood/5' : ''}`}>
      <span className={`w-8 text-xs font-bold ${textColorClass}`}>{bloodType}</span>
      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${colorClass}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      <span className={`text-xs font-bold tabular-nums ${textColorClass}`}>{units}u</span>
      {variant === 'critical' && (
        <span className="text-[10px] font-bold text-blood bg-blood/10 px-1.5 py-0.5 rounded">LOW</span>
      )}
    </div>
  );
}
