import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Plus, Map, Navigation, GitBranch, Droplet } from 'lucide-react';
import { LiveTicker, NavigationBar } from '../../components/shared';
import { useSocket } from '../../hooks/useSocket';
import { EmergencyList, AIMatchPanel, RightPanel, RaiseEmergencyModal } from './components';
import { LiveMetricsBar } from '../../components/hospital/LiveMetricsBar';
import { TomTomMap } from '../../components/hospital/TomTomMap';
import { CascadeTimeline } from '../../components/hospital/CascadeTimeline';
import { LiveTracking } from '../../components/hospital/LiveTracking';
import { BloodBankPanel } from '../../components/hospital/BloodBankPanel';
import { DEMO_METRICS, DEMO_STEPS } from '../../data/mock';
import { motion } from 'framer-motion';

type CenterTab = 'map' | 'tracking' | 'cascade' | 'inventory';

const CENTER_TABS = [
  { id: 'map' as const, label: 'Live Map', icon: Map },
  { id: 'tracking' as const, label: 'Tracking', icon: Navigation },
  { id: 'cascade' as const, label: 'Cascade', icon: GitBranch },
  { id: 'inventory' as const, label: 'Blood Banks', icon: Droplet },
];

export default function HospitalsPage() {
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<CenterTab>('map');
  const { metrics } = useSocket();

  const displayMetrics = {
    livesSaved: metrics.livesSaved || DEMO_METRICS.livesSaved,
    donorsOnline: metrics.donorsOnline || DEMO_METRICS.donorsOnline,
    avgTime: Math.round(metrics.avgTimeToBlood || DEMO_METRICS.avgTime),
    activeEmergencies: metrics.activeEmergencies || DEMO_METRICS.activeEmergencies,
  };

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      {/* Live ticker */}
      <LiveTicker items={[
        { label: 'Lives Saved', value: displayMetrics.livesSaved, color: 'success' },
        { label: 'Donors Online', value: displayMetrics.donorsOnline, color: 'success' },
        { label: 'Avg Time', value: `${displayMetrics.avgTime}m`, color: 'info' },
        { label: 'O- Critical', value: 2, color: 'blood' },
      ]} />

      {/* Nav bar */}
      <NavigationBar
        emergencyCount={displayMetrics.activeEmergencies}
        donorCount={displayMetrics.donorsOnline}
        avgTime={displayMetrics.avgTime}
        livesSaved={displayMetrics.livesSaved}
      />

      {/* Live metrics bar */}
      <LiveMetricsBar
        activeEmergencies={displayMetrics.activeEmergencies}
        donorsOnline={displayMetrics.donorsOnline}
        avgTime={displayMetrics.avgTime}
        livesSaved={displayMetrics.livesSaved}
      />

      {/* Command center layout */}
      <main className="flex-1 grid grid-cols-12 overflow-hidden">
        {/* LEFT PANEL — Emergency list + AI matches */}
        <div className="col-span-12 lg:col-span-3 border-r border-white/5 flex flex-col overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
            <Link to="/" className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors">
              <ChevronLeft className="w-3.5 h-3.5" />Back
            </Link>
            <div className="w-px h-4 bg-white/10 mx-1" />
            <span className="text-xs font-bold uppercase tracking-widest text-text-muted">Hospital Command</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin">
            <EmergencyList />
            <AIMatchPanel />
          </div>
        </div>

        {/* CENTER — Tabbed content */}
        <div className="col-span-12 lg:col-span-6 flex flex-col border-r border-white/5">
          {/* Center tab bar */}
          <div className="flex items-center gap-1 px-3 py-2 border-b border-white/5 bg-white/2">
            {CENTER_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all duration-200 flex-1 justify-center
                  ${activeTab === tab.id
                    ? 'bg-gradient-to-r from-blood to-[#FF4D79] text-white shadow-[0_0_12px_rgba(255,0,60,0.25)]'
                    : 'text-text-muted hover:text-white hover:bg-white/5'
                  }
                `}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span className="hidden sm:block">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Center content */}
          <div className="flex-1 relative overflow-hidden">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 p-4"
            >
              {activeTab === 'map' && (
                <div className="absolute inset-0 p-4">
                  <TomTomMap hospitalLocation={{ lat: 17.385, lng: 78.486 }} emergencyLocation={{ lat: 17.38, lng: 78.49 }} />
                </div>
              )}
              {activeTab === 'tracking' && (
                <div className="h-full flex items-start justify-center pt-4">
                  <div className="w-full max-w-lg">
                    <LiveTracking donorName="Ravi K." donorId="D1" bloodType="O-" eta={8} />
                  </div>
                </div>
              )}
              {activeTab === 'cascade' && (
                <div className="h-full overflow-y-auto">
                  <CascadeTimeline emergencyId="EMG-0041" steps={DEMO_STEPS} />
                </div>
              )}
              {activeTab === 'inventory' && (
                <div className="h-full overflow-y-auto">
                  <BloodBankPanel />
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="col-span-12 lg:col-span-3 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4">
            <RightPanel activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
        </div>
      </main>

      {/* FAB — Raise Emergency */}
      <div className="fixed bottom-6 right-6 z-30">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-3.5 rounded-2xl font-bold text-sm text-white
            bg-gradient-to-r from-blood to-[#FF4D79] shadow-lg transition-all animate-critical"
          style={{ boxShadow: '0 0 30px rgba(255,0,60,0.4), 0 8px 32px rgba(0,0,0,0.3)' }}
        >
          <Plus className="w-5 h-5" />
          Raise Emergency
        </motion.button>
      </div>

      <RaiseEmergencyModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={(data) => {
          console.log('Emergency raised:', data);
          setShowModal(false);
        }}
      />
    </div>
  );
}
