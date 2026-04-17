import { motion } from 'framer-motion';
import { Activity, Users, Clock, Zap } from 'lucide-react';

interface LiveMetricsBarProps {
  activeEmergencies: number;
  donorsOnline: number;
  avgTime: number;
  livesSaved: number;
}

export function LiveMetricsBar({ activeEmergencies, donorsOnline, avgTime, livesSaved }: LiveMetricsBarProps) {
  const metrics = [
    {
      icon: Activity,
      value: activeEmergencies,
      label: 'Active Emergencies',
      color: 'text-blood',
      bg: 'bg-blood/10',
      border: 'border-blood/20',
      pulse: true,
    },
    {
      icon: Users,
      value: donorsOnline,
      label: 'Donors Online',
      color: 'text-success',
      bg: 'bg-success/8',
      border: 'border-success/15',
      pulse: false,
    },
    {
      icon: Clock,
      value: `${avgTime}m`,
      label: 'Avg Time-to-Blood',
      color: 'text-info',
      bg: 'bg-info/8',
      border: 'border-info/15',
      pulse: false,
    },
    {
      icon: Zap,
      value: livesSaved,
      label: 'Lives Saved Today',
      color: 'text-warning',
      bg: 'bg-warning/8',
      border: 'border-warning/15',
      pulse: false,
    },
  ];

  return (
    <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5 bg-black/30 backdrop-blur-sm overflow-x-auto">
      {metrics.map((m, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border ${m.bg} ${m.border} flex-shrink-0`}
        >
          <div className="relative">
            <m.icon className={`w-4 h-4 ${m.color}`} />
            {m.pulse && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-blood">
                <span className="absolute inset-0 rounded-full bg-blood animate-ping opacity-75" />
              </span>
            )}
          </div>
          <div>
            <p className={`text-base font-display font-black leading-none ${m.color}`}>
              {m.value}
            </p>
            <p className="text-[9px] text-white/40 uppercase tracking-wider mt-0.5">{m.label}</p>
          </div>
        </motion.div>
      ))}

      <div className="ml-auto flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/3 border border-white/8">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="w-2 h-2 rounded-full bg-success"
        />
        <span className="text-[10px] font-bold text-success uppercase tracking-wider">System Live</span>
      </div>
    </div>
  );
}
