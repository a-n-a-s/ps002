import { motion } from 'framer-motion';

// Animated SVG city map showing donor locations and nearby needs
export function CityMiniMap() {
  const donors = [
    { x: 35, y: 45, type: 'O-', active: true },
    { x: 55, y: 30, type: 'A+', active: true },
    { x: 70, y: 60, type: 'B+', active: false },
    { x: 25, y: 65, type: 'O+', active: true },
    { x: 80, y: 40, type: 'AB+', active: false },
  ];

  const needs = [
    { x: 50, y: 50, label: 'KIMS Hospital', urgent: true },
    { x: 30, y: 35, label: 'Apollo', urgent: false },
  ];

  return (
    <div className="relative rounded-xl overflow-hidden bg-[#080810] border border-white/8" style={{ height: 160 }}>
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        {/* Grid lines */}
        {[20, 40, 60, 80].map(v => (
          <g key={v}>
            <line x1={v} y1="0" x2={v} y2="100" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
            <line x1="0" y1={v} x2="100" y2={v} stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
          </g>
        ))}

        {/* Road network */}
        <path d="M 0 50 Q 30 30 50 50 Q 70 70 100 50" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" fill="none" />
        <path d="M 50 0 Q 40 30 50 50 Q 60 70 50 100" stroke="rgba(255,255,255,0.06)" strokeWidth="1" fill="none" />
        <path d="M 20 80 L 80 20" stroke="rgba(255,255,255,0.04)" strokeWidth="0.8" fill="none" />

        {/* Hospital need rings */}
        {needs.map((need, i) => (
          <g key={i}>
            {need.urgent && (
              <>
                <motion.circle cx={need.x} cy={need.y} r="4"
                  fill="none" stroke="#FF003C" strokeWidth="0.8"
                  animate={{ r: [4, 12, 4], opacity: [0.8, 0, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                />
                <motion.circle cx={need.x} cy={need.y} r="4"
                  fill="none" stroke="#FF003C" strokeWidth="0.6"
                  animate={{ r: [4, 18, 4], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 + 0.3 }}
                />
              </>
            )}
            <circle cx={need.x} cy={need.y} r="3" fill={need.urgent ? '#FF003C' : '#00E5FF'} />
            <text x={need.x + 4} y={need.y - 3} fontSize="3" fill="rgba(255,255,255,0.6)" fontWeight="bold">
              {need.label}
            </text>
          </g>
        ))}

        {/* Donor dots */}
        {donors.map((donor, i) => (
          <g key={i}>
            {donor.active && (
              <motion.circle cx={donor.x} cy={donor.y} r="4"
                fill="none" stroke="#00FF66" strokeWidth="0.8"
                animate={{ r: [3, 7], opacity: [0.6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
              />
            )}
            <circle
              cx={donor.x} cy={donor.y} r="2.5"
              fill={donor.active ? '#00FF66' : 'rgba(255,255,255,0.2)'}
            />
          </g>
        ))}

        {/* You marker */}
        <circle cx="50" cy="50" r="4" fill="rgba(0,229,255,0.2)" stroke="#00E5FF" strokeWidth="1" />
        <text x="53" y="53" fontSize="3" fill="#00E5FF" fontWeight="bold">YOU</text>
      </svg>

      {/* Legend */}
      <div className="absolute bottom-2 left-2 flex items-center gap-3">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-success" />
          <span className="text-[9px] text-white/50">Donors Online</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-blood" />
          <span className="text-[9px] text-white/50">Emergency</span>
        </div>
      </div>

      {/* Overlay label */}
      <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-success/15 border border-success/20">
        <span className="text-[9px] font-bold text-success uppercase tracking-wider">5 donors nearby</span>
      </div>
    </div>
  );
}
