import { useState } from 'react';
import { Droplet, Info, Check } from 'lucide-react';
import { Card } from '../../../components/ui';
import { BLOOD_TYPES, BLOOD_INFO, DONOR_PROFILE } from '../../../data/mock';

export function BloodTypeCard() {
  const [selectedType, setSelectedType] = useState<string | null>(DONOR_PROFILE.bloodType);
  const [showInfo, setShowInfo] = useState(false);

  return (
    <Card className="relative overflow-hidden border-white/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blood/10 flex items-center justify-center">
            <Droplet className="w-5 h-5 text-blood" />
          </div>
          <div>
            <h3 className="text-lg font-display font-bold text-text-primary">Blood Type</h3>
            <p className="text-sm text-text-muted">Your blood type for emergencies</p>
          </div>
        </div>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
        >
          <Info className="w-4 h-4 text-text-muted" />
        </button>
      </div>

      <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
        {BLOOD_TYPES.map((type) => {
          const isSelected = selectedType === type;
          const isYourType = type === DONOR_PROFILE.bloodType;

          return (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`relative p-4 rounded-xl text-center transition-all duration-200 ${
                isSelected
                  ? 'bg-gradient-to-br from-blood to-[#FF4D79] text-white shadow-[0_0_25px_rgba(255,0,60,0.4)] scale-105'
                  : 'bg-white/5 border border-white/10 text-text-primary hover:border-blood/50 hover:bg-white/10'
              }`}
            >
              <span className="text-xl font-display font-black">{type}</span>
              {isYourType && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-success flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {showInfo && selectedType && BLOOD_INFO[selectedType] && (
        <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blood mt-0.5" />
            <div>
              <p className="font-semibold text-text-primary">{BLOOD_INFO[selectedType].description}</p>
              <p className="text-sm text-text-muted mt-1">
                Compatible recipients: {BLOOD_INFO[selectedType].compatible}
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
