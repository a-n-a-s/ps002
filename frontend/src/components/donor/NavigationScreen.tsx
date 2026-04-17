import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Card } from '../ui';
import { Phone, MapPin } from 'lucide-react';

interface NavigationScreenProps {
  hospitalName: string;
  distance: string;
  eta: number;
  onArrived: () => void;
}

export function NavigationScreen({ hospitalName, distance, eta, onArrived }: NavigationScreenProps) {
  const [arrived, setArrived] = useState(false);

  const handleArrived = () => {
    setArrived(true);
    onArrived();
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Map Area */}
      <div className="relative h-[60vh] bg-bg-secondary">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-16 h-16 text-blood mx-auto animate-bounce" />
            <p className="text-text-muted mt-2">Route visualization</p>
            <p className="text-xs text-text-muted">(Mapbox with Directions API)</p>
          </div>
        </div>
        
        {/* ETA Badge */}
        <div className="absolute top-4 left-4 px-4 py-2 rounded-lg bg-bg-primary/90 backdrop-blur">
          <p className="text-xs text-text-muted uppercase tracking-wider">ETA</p>
          <p className="text-2xl font-display font-black text-blood">{eta} min</p>
        </div>

        {/* Distance Badge */}
        <div className="absolute top-4 right-4 px-4 py-2 rounded-lg bg-bg-primary/90 backdrop-blur">
          <p className="text-xs text-text-muted uppercase tracking-wider">Distance</p>
          <p className="text-lg font-semibold text-text-primary">{distance}</p>
        </div>
      </div>

      {/* Bottom Card */}
      <div className="p-6">
        <Card className="max-w-lg mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-blood/10 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-blood" />
            </div>
            <div>
              <h3 className="font-display font-bold text-text-primary">{hospitalName}</h3>
              <p className="text-sm text-text-muted">ICU · Emergency Ward</p>
            </div>
          </div>

          <div className="flex gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm text-text-muted">
              <Phone className="w-4 h-4" />
              <span>Call Hospital</span>
            </div>
          </div>

          {!arrived ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <p className="text-center text-lg text-text-sub mb-4">
                "You're saving a life right now"
              </p>
              <Button variant="accept" className="w-full" onClick={handleArrived}>
                ✓ I've Arrived
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/20 flex items-center justify-center">
                <span className="text-3xl">✓</span>
              </div>
              <h3 className="text-xl font-display font-bold text-success mb-2">
                Check In Complete!
              </h3>
              <p className="text-text-muted">
                Proceed to the donation counter
              </p>
            </motion.div>
          )}
        </Card>
      </div>
    </div>
  );
}