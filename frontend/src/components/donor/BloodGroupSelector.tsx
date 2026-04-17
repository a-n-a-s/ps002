import { motion } from 'framer-motion';

const BLOOD_GROUPS = [
  { type: 'O-', color: '#FF003C', glow: 'rgba(255,0,60,0.4)', label: 'Universal Donor' },
  { type: 'O+', color: '#FF4D79', glow: 'rgba(255,77,121,0.4)', label: 'Most Common' },
  { type: 'A+', color: '#FF6B35', glow: 'rgba(255,107,53,0.4)', label: '2nd Common' },
  { type: 'A-', color: '#FF8C42', glow: 'rgba(255,140,66,0.4)', label: 'Common' },
  { type: 'B+', color: '#C44EFF', glow: 'rgba(196,78,255,0.4)', label: '3rd Common' },
  { type: 'B-', color: '#9B59FF', glow: 'rgba(155,89,255,0.4)', label: 'Rare' },
  { type: 'AB+', color: '#00E5FF', glow: 'rgba(0,229,255,0.4)', label: 'Universal Recipient' },
  { type: 'AB-', color: '#00FF66', glow: 'rgba(0,255,102,0.4)', label: 'Rare Plasma' },
];

interface BloodGroupSelectorProps {
  selected: string;
  onChange: (type: string) => void;
}

function BloodDrop({ color, selected }: { color: string; selected: boolean }) {
  return (
    <svg viewBox="0 0 40 50" className="w-8 h-10">
      <path
        d="M20 4 C20 4, 4 22, 4 32 C4 42, 11.6 48, 20 48 C28.4 48, 36 42, 36 32 C36 22, 20 4, 20 4Z"
        fill={selected ? color : 'rgba(255,255,255,0.08)'}
        stroke={selected ? color : 'rgba(255,255,255,0.15)'}
        strokeWidth="1"
        style={{
          filter: selected ? `drop-shadow(0 0 8px ${color})` : 'none',
          transition: 'all 0.3s ease',
        }}
      />
      {selected && (
        <path
          d="M14 30 C14 26, 17 22, 20 20"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

export function BloodGroupSelector({ selected, onChange }: BloodGroupSelectorProps) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {BLOOD_GROUPS.map((group, i) => (
        <motion.button
          key={group.type}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onChange(group.type)}
          className={`
            relative flex flex-col items-center gap-1 p-3 rounded-xl border transition-all duration-200
            ${selected === group.type
              ? 'border-white/30 bg-white/10'
              : 'border-white/10 bg-white/3 hover:border-white/20 hover:bg-white/5'
            }
          `}
          style={{
            boxShadow: selected === group.type ? `0 0 20px ${group.glow}` : 'none',
          }}
        >
          <BloodDrop color={group.color} selected={selected === group.type} />
          <span
            className="text-base font-display font-black tracking-tight"
            style={{ color: selected === group.type ? group.color : 'rgba(255,255,255,0.7)' }}
          >
            {group.type}
          </span>
          {selected === group.type && (
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-[9px] font-semibold uppercase tracking-wider text-center leading-tight"
              style={{ color: group.color }}
            >
              {group.label}
            </motion.span>
          )}
        </motion.button>
      ))}
    </div>
  );
}
