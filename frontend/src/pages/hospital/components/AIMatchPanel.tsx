import { motion } from 'framer-motion';
import { Bot, MapPin, Zap, Phone, MessageSquare, Bell, TrendingUp } from 'lucide-react';
import { AI_MATCHES } from '../../../data/mock';
import { SurvivalMeter } from '../../../components/shared/SurvivalMeter';

const SURVIVAL_STAGES = [42, 58, 78];

const CHANNELS = [
  { icon: Bell, label: 'App notification', color: '#00FF66', time: '2s ago' },
  { icon: MessageSquare, label: 'WhatsApp sent', color: '#25D366', time: '3s ago' },
  { icon: Phone, label: 'Auto-call initiated', color: '#00E5FF', time: '4s ago' },
];

const STATUS_CONFIG = {
  alerting: { label: '⚡ Alerting...', bg: 'bg-warning/10 border-warning/30', dot: 'bg-warning', text: 'text-warning' },
  standby: { label: '⏳ Standby', bg: 'bg-info/5 border-info/10', dot: 'bg-info', text: 'text-info' },
  arrived: { label: '✓ Arrived', bg: 'bg-success/10 border-success/30', dot: 'bg-success', text: 'text-success' },
};

export function AIMatchPanel() {
  return (
    <div className="mt-8 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-ai/15 border border-ai/25 flex items-center justify-center">
            <Bot className="w-4 h-4 text-ai" />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-text-muted">AI Match Engine</h2>
            <p className="text-[10px] text-ai">Processing 142 donors...</p>
          </div>
        </div>
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-ai/10 border border-ai/20"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-ai" />
          <span className="text-[9px] font-bold text-ai uppercase tracking-wider">Live</span>
        </motion.div>
      </div>

      {/* Survival meter */}
      <SurvivalMeter value={58} climbing stages={SURVIVAL_STAGES} />

      {/* Ranked donor list */}
      <div className="space-y-2">
        {AI_MATCHES.map((match, index) => {
          const statusCfg = STATUS_CONFIG[match.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.standby;
          return (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className={`rounded-xl border p-3 transition-all duration-200 ${statusCfg.bg}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  {/* Rank badge */}
                  <div className="w-6 h-6 rounded-full bg-white/8 flex items-center justify-center text-xs font-black text-white/50">
                    {index + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-text-primary text-sm">{match.name}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-blood/15 text-blood border border-blood/20">
                        {match.bloodType}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="flex items-center gap-1 text-[11px] text-text-muted">
                        <MapPin className="w-2.5 h-2.5" />{match.distance}km
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-text-muted">
                        <Zap className="w-2.5 h-2.5" />Score: {match.score}
                      </span>
                      <span className="text-[11px] text-text-muted">ETA: {Math.round(match.distance * 3.5)} min</span>
                    </div>
                  </div>
                </div>

                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-bold ${statusCfg.bg} ${statusCfg.text}`}>
                  <motion.div
                    animate={match.status === 'alerting' ? { scale: [1, 1.3, 1] } : {}}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`}
                  />
                  {statusCfg.label}
                </div>
              </div>

              {/* Alert channels for alerting donor */}
              {match.status === 'alerting' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-2.5 pt-2.5 border-t border-warning/15 space-y-1"
                >
                  {CHANNELS.map((ch, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.15 }}
                      className="flex items-center gap-2 text-[11px]"
                    >
                      <ch.icon className="w-3 h-3" style={{ color: ch.color }} />
                      <span style={{ color: ch.color }} className="font-medium">{ch.label}</span>
                      <span className="text-white/25 ml-auto">{ch.time}</span>
                    </motion.div>
                  ))}
                  <div className="flex items-center gap-1 mt-1 text-[10px] text-ai italic">
                    <TrendingUp className="w-2.5 h-2.5" />
                    AI: Highest score, nearest match selected
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      <button className="w-full py-2 text-xs text-text-muted hover:text-text-primary transition-colors border border-white/5 rounded-xl hover:border-white/10 hover:bg-white/3">
        View all 12 AI-ranked matches →
      </button>
    </div>
  );
}
