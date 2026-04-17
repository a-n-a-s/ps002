import { motion } from 'framer-motion';
import { AlertTriangle, MapPin, Clock, Activity } from 'lucide-react';
import { ACTIVE_EMERGENCIES } from '../../../data/mock';

export function EmergencyList() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-widest text-text-muted">Active Emergencies</h2>
        <motion.span
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="px-2 py-0.5 rounded-full bg-blood/20 text-blood text-xs font-black border border-blood/20"
        >
          {ACTIVE_EMERGENCIES.length}
        </motion.span>
      </div>

      {ACTIVE_EMERGENCIES.map((emergency, index) => {
        const isCritical = emergency.status === 'critical';
        return (
          <motion.div
            key={emergency.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.01, y: -1 }}
            className={`
              group relative cursor-pointer rounded-xl border p-4 transition-all duration-200
              ${isCritical
                ? 'bg-gradient-to-br from-blood/8 to-transparent border-blood/30 hover:border-blood/50'
                : 'bg-gradient-to-br from-warning/5 to-transparent border-warning/20 hover:border-warning/40'
              }
            `}
            style={{
              boxShadow: isCritical
                ? '0 0 20px rgba(255,0,60,0.08)'
                : '0 0 15px rgba(255,214,0,0.06)',
            }}
          >
            {/* Critical pulse border */}
            {isCritical && (
              <motion.div
                animate={{ opacity: [0, 0.4, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-xl border border-blood/60 pointer-events-none"
              />
            )}

            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isCritical ? 'bg-blood/15' : 'bg-warning/10'}`}>
                  <AlertTriangle className={`w-3.5 h-3.5 ${isCritical ? 'text-blood' : 'text-warning'}`} />
                </div>
                <div>
                  <span className="text-xs font-black tracking-tight text-text-primary">{emergency.id}</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${isCritical ? 'bg-blood animate-pulse' : 'bg-warning'}`} />
                    <span className={`text-[10px] font-bold uppercase ${isCritical ? 'text-blood' : 'text-warning'}`}>
                      {isCritical ? 'Critical' : 'Warning'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Hospital trust score */}
              <div className="text-right">
                <div className="text-[10px] text-white/30 uppercase tracking-wider">Trust</div>
                <div className="text-xs font-black text-success">⭐ 88%</div>
              </div>
            </div>

            <p className="text-sm font-semibold text-text-primary mb-1">{emergency.hospital}</p>
            <div className="flex items-center gap-3 text-xs text-text-muted mb-3">
              <span className="flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5" />{emergency.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" />2m ago
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-3xl font-display font-black text-blood" style={{ textShadow: '0 0 20px rgba(255,0,60,0.4)' }}>
                {emergency.bloodType}
              </span>
              <div className="text-right">
                <div className="flex items-center gap-1 mb-1">
                  <Activity className="w-3 h-3 text-text-muted" />
                  <span className="text-[10px] text-text-muted uppercase tracking-wider">Survival</span>
                </div>
                <span className={`text-lg font-display font-black ${isCritical ? 'text-blood' : 'text-warning'}`}>
                  {emergency.survivalRate}%
                </span>
              </div>
            </div>

            {/* Survival progress bar */}
            <div className="mt-2 h-1.5 bg-white/8 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${emergency.survivalRate}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                className={`h-full rounded-full ${isCritical ? 'bg-gradient-to-r from-blood to-[#FF4D79]' : 'bg-gradient-to-r from-warning to-[#FFB800]'}`}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
