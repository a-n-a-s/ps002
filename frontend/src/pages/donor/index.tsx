import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LiveTicker, NavigationBar } from '../../components/shared';
import { AlertScreen } from '../../components/donor/AlertScreen';
import { NavigationScreen } from '../../components/donor/NavigationScreen';
import { DonationMode } from '../../components/donor/DonationMode';
import { StatsOverview, AvailabilityToggle, BloodTypeCard, QuickActions } from './components';
import { DonorOnboarding } from './components/DonorOnboarding';
import { StreakTracker } from '../../components/donor/StreakTracker';
import { LivesSavedCounter } from '../../components/donor/LivesSavedCounter';
import { CityMiniMap } from '../../components/donor/CityMiniMap';
import { DEMO_METRICS, DONOR_PROFILE } from '../../data/mock';
import { motion } from 'framer-motion';
import { Heart, MapPin, Activity } from 'lucide-react';

type Stage = 'onboarding' | 'dashboard' | 'alert' | 'navigation' | 'donation';

export default function DonorsPage() {
  const [stage, setStage] = useState<Stage>('dashboard');
  const [showOnboarding] = useState(false); // set to true to test onboarding flow

  if (showOnboarding && stage === 'onboarding') {
    return <DonorOnboarding onComplete={() => setStage('dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <LiveTicker items={[
        { label: 'Lives Saved', value: DEMO_METRICS.livesSaved, color: 'success' },
        { label: 'Donors Online', value: DEMO_METRICS.donorsOnline, color: 'success' },
        { label: 'Avg Time', value: `${DEMO_METRICS.avgTime}m`, color: 'info' },
        { label: 'O- Critical', value: 2, color: 'blood' },
      ]} />

      <NavigationBar
        emergencyCount={DEMO_METRICS.activeEmergencies}
        donorCount={DEMO_METRICS.donorsOnline}
        avgTime={Math.round(DEMO_METRICS.avgTime)}
        livesSaved={DEMO_METRICS.livesSaved}
      />

      {stage === 'dashboard' && (
        <main className="pt-8 pb-16 px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Ambient glows */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
            <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-blood rounded-full mix-blend-screen filter blur-[150px] opacity-5" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-info rounded-full mix-blend-screen filter blur-[150px] opacity-[0.03]" />
          </div>

          <div className="max-w-6xl mx-auto relative z-10">
            {/* Page header */}
            <div className="flex items-start justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 text-xs text-text-muted mb-2">
                  <Link to="/" className="hover:text-text-primary transition-colors">Home</Link>
                  <span>/</span>
                  <span className="text-text-primary">Donor Portal</span>
                </div>
                <h1 className="text-4xl font-display font-black text-text-primary tracking-tight">
                  Donor Portal
                </h1>
                <p className="text-text-muted mt-1 flex items-center gap-2">
                  <Heart className="w-3.5 h-3.5 text-blood" />
                  Welcome back, {DONOR_PROFILE.name}
                </p>
              </div>

              {/* Availability pill */}
              <motion.div
                animate={{ boxShadow: ['0 0 0px rgba(0,255,102,0)', '0 0 15px rgba(0,255,102,0.25)', '0 0 0px rgba(0,255,102,0)'] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/25"
              >
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-sm font-bold text-success">Available to Donate</span>
              </motion.div>
            </div>

            {/* Top stats row */}
            <StatsOverview />

            {/* Mid section: Lives saved counter + Mini map + Streak */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
              {/* Lives saved counter */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-white/8 bg-white/2 backdrop-blur-sm p-6 flex flex-col items-center justify-center"
              >
                <LivesSavedCounter target={DONOR_PROFILE.livesSaved} />
              </motion.div>

              {/* City mini map */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-2xl border border-white/8 bg-white/2 backdrop-blur-sm p-4 space-y-2"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-info" />
                    <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Nearby Needs</span>
                  </div>
                  <span className="text-[10px] text-blood font-bold animate-pulse">1 CRITICAL</span>
                </div>
                <CityMiniMap />
              </motion.div>

              {/* Streak tracker */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl border border-white/8 bg-white/2 backdrop-blur-sm p-5"
              >
                <StreakTracker streak={7} />

                {/* Upcoming events from hospitals */}
                <div className="mt-4 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Activity className="w-3.5 h-3.5 text-info" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Upcoming Events</span>
                  </div>
                  <div className="space-y-1.5">
                    {[
                      { hospital: 'Apollo Hospital', event: 'Blood Drive', date: 'Apr 20' },
                      { hospital: 'KIMS', event: 'Donor Camp', date: 'Apr 25' },
                    ].map((ev, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <div>
                          <p className="font-semibold text-text-primary">{ev.event}</p>
                          <p className="text-text-muted">{ev.hospital}</p>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-info/10 border border-info/20 text-info font-bold">{ev.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Bottom row: Availability + Blood type */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <AvailabilityToggle />
              <BloodTypeCard />
            </div>

            {/* Quick actions */}
            <div className="mt-6">
              <QuickActions onTestAlert={() => setStage('alert')} />
            </div>
          </div>
        </main>
      )}

      {stage === 'alert' && (
        <AlertScreen
          bloodType="O-"
          hospitalName="KIMS Hospital"
          distance="2.1km"
          urgency="critical"
          survival={42}
          onAccept={() => setStage('navigation')}
          onDecline={() => setStage('dashboard')}
        />
      )}

      {stage === 'navigation' && (
        <NavigationScreen
          hospitalName="KIMS Hospital"
          distance="2.1km"
          eta={8}
          onArrived={() => setStage('donation')}
        />
      )}

      {stage === 'donation' && (
        <DonationMode onComplete={() => setStage('dashboard')} />
      )}
    </div>
  );
}
