import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface NavBarProps {
  emergencyCount: number;
  donorCount: number;
  avgTime: number;
  livesSaved: number;
}

export function NavigationBar({ emergencyCount, donorCount, avgTime, livesSaved }: NavBarProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="sticky top-8 z-40 min-h-12 bg-bg-primary/95 backdrop-blur-xl border-b border-white/5 flex items-center justify-between gap-3 px-3 sm:px-6 py-2">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2.5 group">
        <div className="w-8 h-8 rounded-[50%_50%_50%_10%] bg-blood flex items-center justify-center"
          style={{ boxShadow: '0 0 12px rgba(255,0,60,0.5)', animation: 'heartbeat 1.4s ease-in-out infinite' }}>
          <Heart className="w-4 h-4 text-white fill-white" />
        </div>
        <span className="font-display font-bold text-base sm:text-lg tracking-tight text-text-primary group-hover:text-blood transition-colors">
          BLOODLINK
        </span>
        <span className="hidden lg:inline text-xs font-semibold text-text-muted tracking-widest uppercase">Command</span>
      </Link>

      {/* Live metrics */}
      <div className="hidden md:flex items-center gap-5">
        <NavMetric label="Emerg" value={emergencyCount} color="blood" />
        <div className="w-px h-6 bg-white/5" />
        <NavMetric label="Donors" value={donorCount} color="success" />
        <div className="w-px h-6 bg-white/5" />
        <NavMetric label="Avg" value={`${avgTime}m`} color="info" />
        <div className="w-px h-6 bg-white/5" />
        <NavMetric label="Saved" value={livesSaved} color="success" />
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Live indicator */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blood/10 border border-blood/25">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blood opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blood" />
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-blood hidden sm:block">LIVE</span>
        </div>

        {/* Clock */}
        <span className="hidden sm:inline text-sm font-mono text-text-muted tabular-nums">
          {time.toLocaleTimeString('en-US', { hour12: false })}
        </span>

        {/* Theme toggle — rightmost */}
        <ThemeToggle />
      </div>
    </nav>
  );
}

function NavMetric({ label, value, color }: { label: string; value: number | string; color: 'blood' | 'success' | 'info' }) {
  const colorMap = { blood: 'text-blood', success: 'text-success', info: 'text-info' };
  return (
    <div className="flex flex-col items-center">
      <span className={`text-lg font-display font-black tracking-tight ${colorMap[color]}`}>{value}</span>
      <span className="text-[10px] font-semibold uppercase tracking-widest text-text-muted -mt-1">{label}</span>
    </div>
  );
}
