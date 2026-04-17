import { useState, useEffect } from 'react';
import { Card, Button, Badge, Progress } from '../ui';
import { MapPin, Clock, Heart, Shield } from 'lucide-react';

interface LiveTrackingProps {
  donorName: string;
  donorId: string;
  bloodType: string;
  eta: number;
  onAmbulanceDispatch?: () => void;
}

export function LiveTracking({
  donorName,
  donorId,
  bloodType,
  eta,
  onAmbulanceDispatch,
}: LiveTrackingProps) {
  const [survivalChance, setSurvivalChance] = useState(78);

  // Simulate survival updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSurvivalChance(s => Math.min(s + 1, 95));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full flex flex-col">
      {/* Map Area */}
      <div className="flex-1 relative bg-bg-secondary">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-16 h-16 text-warning mx-auto animate-pulse" />
            <p className="text-text-muted mt-2">Live donor tracking</p>
            <p className="text-xs text-text-muted">Location updating every 5s</p>
          </div>
        </div>

        {/* Status overlay */}
        <div className="absolute top-4 left-4 px-4 py-2 rounded-lg bg-bg-primary/90 backdrop-blur">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-warning animate-pulse" />
            <span className="text-sm font-semibold text-warning">EN ROUTE</span>
          </div>
        </div>

        {/* ETA overlay */}
        <div className="absolute top-4 right-4 px-4 py-2 rounded-lg bg-bg-primary/90 backdrop-blur">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-text-muted" />
            <span className="text-lg font-display font-black text-text-primary">{eta}m</span>
          </div>
        </div>
      </div>

      {/* Info Panel */}
      <div className="p-4 border-t border-white/5">
        {/* Donor Info */}
        <Card className="mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center">
                <Heart className="w-6 h-6 text-warning" />
              </div>
              <div>
                <h3 className="font-display font-bold text-text-primary">{donorName}</h3>
                <p className="text-sm text-text-muted">{bloodType} · {donorId}</p>
              </div>
            </div>
            <Badge variant="warning">En Route</Badge>
          </div>
        </Card>

        {/* Survival Probability */}
        <Card className="mb-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-3">
            Survival Probability
          </h4>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Progress value={survivalChance} variant={survivalChance > 70 ? 'success' : 'warning'} />
            </div>
            <span className="text-2xl font-display font-black text-success">{survivalChance}%</span>
          </div>
        </Card>

        {/* Fallback Option */}
        <Card className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-info" />
              <span className="font-semibold text-text-primary">Fallback Option</span>
            </div>
          </div>
          <p className="text-sm text-text-muted mb-3">
            City Blood Bank has 2 units O- available as backup
          </p>
          <Button variant="secondary" className="w-full">
            Dispatch from City Bank
          </Button>
        </Card>

        {/* Ambulance Dispatch */}
        {onAmbulanceDispatch && (
          <Button variant="primary" className="w-full" onClick={onAmbulanceDispatch}>
            🚑 Request Ambulance (Simulation)
          </Button>
        )}
      </div>
    </div>
  );
}