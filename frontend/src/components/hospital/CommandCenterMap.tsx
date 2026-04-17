import { motion } from 'framer-motion';

// SVG-based command center city map with animated elements
export function CommandCenterMap() {
  const donors = [
    { x: 28, y: 38, bloodType: 'O-', active: true, name: 'Ravi K.' },
    { x: 55, y: 25, bloodType: 'A+', active: true, name: 'Priya S.' },
    { x: 72, y: 60, bloodType: 'B+', active: false, name: 'Arjun M.' },
    { x: 20, y: 68, bloodType: 'O+', active: true, name: 'Neha R.' },
    { x: 82, y: 35, bloodType: 'AB+', active: true, name: 'Vikram T.' },
    { x: 40, y: 72, bloodType: 'O-', active: true, name: 'Divya K.' },
    { x: 65, y: 80, bloodType: 'A-', active: false, name: 'Rohit P.' },
    { x: 88, y: 70, bloodType: 'B-', active: true, name: 'Ananya M.' },
  ];

  const hospitals = [
    { x: 50, y: 50, name: 'KIMS Hospital', emergency: true },
    { x: 30, y: 30, name: 'Apollo', emergency: false },
    { x: 75, y: 45, name: 'Care Hospital', emergency: false },
  ];

  const bloodBanks = [
    { x: 60, y: 65, name: 'City Blood Bank' },
    { x: 22, y: 50, name: 'Red Cross' },
  ];

  const bloodTypeColors: Record<string, string> = {
    'O-': '#FF003C', 'O+': '#FF4D79', 'A+': '#FF6B35',
    'A-': '#FF8C42', 'B+': '#C44EFF', 'B-': '#9B59FF',
    'AB+': '#00E5FF', 'AB-': '#00FF66',
  };

  return (
    <div className="relative w-full h-full bg-[#05050E] rounded-2xl overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent to-[#05050E]/80 pointer-events-none z-10" />

      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        {/* Background grid */}
        {Array.from({ length: 11 }, (_, i) => i * 10).map(v => (
          <g key={v}>
            <line x1={v} y1="0" x2={v} y2="100" stroke="rgba(0,229,255,0.04)" strokeWidth="0.3" />
            <line x1="0" y1={v} x2="100" y2={v} stroke="rgba(0,229,255,0.04)" strokeWidth="0.3" />
          </g>
        ))}

        {/* City roads */}
        <path d="M0 50 Q25 35 50 50 Q75 65 100 50" stroke="rgba(255,255,255,0.07)" strokeWidth="2" fill="none" />
        <path d="M50 0 Q35 25 50 50 Q65 75 50 100" stroke="rgba(255,255,255,0.07)" strokeWidth="1.5" fill="none" />
        <path d="M0 25 L100 75" stroke="rgba(255,255,255,0.04)" strokeWidth="1" fill="none" />
        <path d="M0 75 L100 25" stroke="rgba(255,255,255,0.04)" strokeWidth="1" fill="none" />
        <path d="M15 0 L15 100" stroke="rgba(255,255,255,0.03)" strokeWidth="0.8" fill="none" />
        <path d="M85 0 L85 100" stroke="rgba(255,255,255,0.03)" strokeWidth="0.8" fill="none" />

        {/* Blood banks */}
        {bloodBanks.map((bank, i) => (
          <g key={i}>
            <rect x={bank.x - 3} y={bank.y - 3} width="6" height="6"
              fill="rgba(255,214,0,0.1)" stroke="#FFD600" strokeWidth="0.7" rx="1" />
            <text x={bank.x} y={bank.y - 4} fontSize="2.5" fill="#FFD600" textAnchor="middle" fontWeight="bold">
              {bank.name}
            </text>
          </g>
        ))}

        {/* Hospital emergency rings */}
        {hospitals.map((hosp, i) => (
          <g key={i}>
            {hosp.emergency && (
              <>
                <motion.circle cx={hosp.x} cy={hosp.y} r="5" fill="rgba(255,0,60,0.06)"
                  animate={{ r: [5, 20, 5], opacity: [0.8, 0, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                />
                <motion.circle cx={hosp.x} cy={hosp.y} r="5" fill="rgba(255,0,60,0.04)"
                  animate={{ r: [5, 30, 5], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 + 0.3 }}
                />
              </>
            )}
            {/* Hospital pin */}
            <rect x={hosp.x - 4} y={hosp.y - 4} width="8" height="8" rx="1.5"
              fill={hosp.emergency ? 'rgba(255,0,60,0.2)' : 'rgba(0,229,255,0.1)'}
              stroke={hosp.emergency ? '#FF003C' : '#00E5FF'} strokeWidth="0.8"
            />
            <text x={hosp.x} y={hosp.y + 1} fontSize="4" fill="white" textAnchor="middle" fontWeight="bold">+</text>
            <text x={hosp.x} y={hosp.y - 6} fontSize="2.5" fill={hosp.emergency ? '#FF003C' : '#00E5FF'} textAnchor="middle" fontWeight="bold">
              {hosp.name}
            </text>
          </g>
        ))}

        {/* Donor dots */}
        {donors.map((donor, i) => {
          const color = bloodTypeColors[donor.bloodType] || '#00FF66';
          return (
            <g key={i}>
              {donor.active && (
                <motion.circle cx={donor.x} cy={donor.y} r="3" fill="none" stroke={color} strokeWidth="0.7"
                  animate={{ r: [3, 8], opacity: [0.8, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.25 }}
                />
              )}
              <circle cx={donor.x} cy={donor.y} r="2.5"
                fill={donor.active ? color : 'rgba(255,255,255,0.15)'}
                style={{ filter: donor.active ? `drop-shadow(0 0 3px ${color}88)` : 'none' }}
              />
              <text x={donor.x} y={donor.y - 4} fontSize="2.2" fill="rgba(255,255,255,0.6)" textAnchor="middle">
                {donor.bloodType}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Overlay legend */}
      <div className="absolute bottom-3 left-3 flex flex-col gap-1.5 z-20">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-success" style={{ boxShadow: '0 0 6px #00FF6680' }} />
          <span className="text-[10px] text-white/60 font-medium">Donors Online</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-blood" />
          <span className="text-[10px] text-white/60 font-medium">Emergency</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm border border-warning" />
          <span className="text-[10px] text-white/60 font-medium">Blood Bank</span>
        </div>
      </div>

      {/* Stats overlay */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-1">
        <div className="px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur border border-success/20 text-[10px]">
          <span className="text-success font-bold">● 8 donors</span>
          <span className="text-white/40 ml-1">online</span>
        </div>
        <div className="px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur border border-blood/20 text-[10px]">
          <span className="text-blood font-bold">⚠ 1 emergency</span>
          <span className="text-white/40 ml-1">active</span>
        </div>
      </div>
    </div>
  );
}
