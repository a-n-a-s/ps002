import { useState } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { Card } from '../../../components/ui';
import { DONOR_PROFILE } from '../../../data/mock';

export function AvailabilityToggle() {
  const [isAvailable, setIsAvailable] = useState(DONOR_PROFILE.isAvailable);

  return (
    <Card className="relative overflow-hidden border-white/10 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
            isAvailable 
              ? 'bg-success/20 shadow-[0_0_20px_rgba(0,255,102,0.2)]' 
              : 'bg-white/5'
          }`}>
            {isAvailable ? (
              <Wifi className="w-6 h-6 text-success" />
            ) : (
              <WifiOff className="w-6 h-6 text-text-muted" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-display font-bold text-text-primary">Availability Status</h3>
            <p className="text-sm text-text-muted">
              {isAvailable 
                ? 'You can receive emergency requests' 
                : 'You will not receive requests'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAvailable(!isAvailable)}
          className={`relative w-20 h-10 rounded-full transition-all duration-300 flex items-center ${
            isAvailable 
              ? 'bg-success shadow-[0_0_15px_rgba(0,255,102,0.3)]' 
              : 'bg-white/10'
          }`}
        >
          <span 
            className={`absolute w-8 h-8 rounded-full bg-white shadow-lg transition-all duration-300 flex items-center justify-center ${
              isAvailable ? 'left-[44px]' : 'left-[8px]'
            }`}
          />
          <span className={`absolute text-xs font-bold transition-all duration-300 ${
            isAvailable ? 'left-3 text-success' : 'right-3 text-text-muted'
          }`}>
            {isAvailable ? 'ON' : 'OFF'}
          </span>
        </button>
      </div>

      {isAvailable && (
        <div className="mt-6 pt-6 border-t border-white/5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-muted">Response time expectation</span>
            <span className="text-success font-medium">Under 5 minutes</span>
          </div>
        </div>
      )}
    </Card>
  );
}
