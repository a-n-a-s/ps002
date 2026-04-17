import { motion } from 'framer-motion';
import { AlertTriangle, Droplet, Clock, ArrowLeftRight, CheckCircle } from 'lucide-react';

interface BloodBankEntry {
  type: string;
  bank: string;
  units: number;
  expiry: string;
  expiringIn: number; // hours
}

const BLOOD_BANK_DATA: BloodBankEntry[] = [
  { type: 'O-', bank: 'KIMS', units: 4, expiry: '2026-04-17', expiringIn: 6 },
  { type: 'B-', bank: 'City Bank', units: 3, expiry: '2026-04-18', expiringIn: 28 },
  { type: 'O+', bank: 'Apollo', units: 18, expiry: '2026-04-22', expiringIn: 120 },
  { type: 'A+', bank: 'KIMS', units: 12, expiry: '2026-04-20', expiringIn: 72 },
  { type: 'AB-', bank: 'Red Cross', units: 2, expiry: '2026-04-17', expiringIn: 4 },
  { type: 'B+', bank: 'Apollo', units: 9, expiry: '2026-04-21', expiringIn: 96 },
];

const REDISTRIBUTION = [
  { from: 'Apollo', to: 'KIMS', type: 'O+', surplus: 6, shortage: 4 },
];

export function BloodBankPanel() {
  const expiringSoon = BLOOD_BANK_DATA.filter(b => b.expiringIn <= 12);

  return (
    <div className="space-y-4">
      {/* Expiring alerts */}
      {expiringSoon.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-blood/8 border border-blood/25 p-3"
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-blood" />
            <span className="text-xs font-bold uppercase tracking-wider text-blood">Expiring Soon</span>
          </div>
          {expiringSoon.map((item, i) => (
            <div key={i} className="flex items-center justify-between text-xs py-1">
              <span className="font-bold text-blood">{item.units} units {item.type}</span>
              <span className="text-text-muted">at {item.bank}</span>
              <span className="text-blood font-semibold">{item.expiringIn}hrs left</span>
            </div>
          ))}
          <div className="mt-2 pt-2 border-t border-blood/15">
            <p className="text-xs text-warning italic">
              💡 Smart suggestion: Dispatch {expiringSoon[0].units} units {expiringSoon[0].type} from {expiringSoon[0].bank} immediately
            </p>
          </div>
        </motion.div>
      )}

      {/* Inventory table */}
      <div className="rounded-xl border border-white/8 overflow-hidden">
        <div className="px-4 py-2.5 bg-white/3 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplet className="w-3.5 h-3.5 text-blood" />
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Blood Inventory</span>
          </div>
          <span className="text-[10px] text-white/30">All banks</span>
        </div>

        <div className="divide-y divide-white/4">
          {BLOOD_BANK_DATA.map((item, i) => {
            const isExpiringSoon = item.expiringIn <= 12;
            const isCritical = item.units <= 3;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className={`
                  flex items-center gap-3 px-4 py-2.5 text-xs
                  ${isExpiringSoon ? 'bg-blood/5' : isCritical ? 'bg-warning/3' : ''}
                `}
              >
                <span className="w-7 font-black text-blood">{item.type}</span>
                <span className="flex-1 text-text-muted">{item.bank}</span>
                <span className={`font-bold tabular-nums ${isCritical ? 'text-blood' : 'text-text-primary'}`}>
                  {item.units}u
                </span>
                <div className="flex items-center gap-1">
                  <Clock className={`w-2.5 h-2.5 ${isExpiringSoon ? 'text-blood' : 'text-white/20'}`} />
                  <span className={`tabular-nums ${isExpiringSoon ? 'text-blood font-bold' : 'text-white/25'}`}>
                    {item.expiringIn}h
                  </span>
                </div>
                {isExpiringSoon && (
                  <motion.span
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="px-1.5 py-0.5 rounded bg-blood/20 text-blood text-[9px] font-bold uppercase"
                  >
                    Urgent
                  </motion.span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Cross-hospital redistribution */}
      <div className="rounded-xl border border-info/15 bg-info/3 p-4">
        <div className="flex items-center gap-2 mb-3">
          <ArrowLeftRight className="w-4 h-4 text-info" />
          <span className="text-xs font-bold uppercase tracking-wider text-info">Smart Redistribution</span>
        </div>

        {REDISTRIBUTION.map((item, i) => (
          <div key={i} className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-success">{item.from}</span>
                <span className="text-white/30">+{item.surplus} {item.type} surplus</span>
              </div>
              <ArrowLeftRight className="w-3 h-3 text-white/20" />
              <div className="flex items-center gap-2">
                <span className="text-white/30">-{item.shortage} shortage</span>
                <span className="font-bold text-blood">{item.to}</span>
              </div>
            </div>

            <button className="w-full py-2 rounded-lg bg-info/10 border border-info/25 text-info text-xs font-bold hover:bg-info/15 transition-all flex items-center justify-center gap-2">
              <CheckCircle className="w-3.5 h-3.5" />
              Initiate Transfer Request
            </button>
          </div>
        ))}
      </div>

      {/* Supply chain note */}
      <div className="rounded-xl border border-white/5 bg-white/2 p-3 text-center">
        <p className="text-xs text-text-muted">
          🔗 Optimal supply chain: <span className="text-success font-semibold">Apollo → KIMS → Red Cross</span>
        </p>
        <p className="text-[10px] text-white/25 mt-1">AI-calculated network flow</p>
      </div>
    </div>
  );
}
