import { AlertTriangle, Check } from 'lucide-react';
import { Card, Badge } from '../../../components/ui';
import { SurvivalMeter, InventoryRow } from '../../../components/shared';
import { CascadeTimeline } from '../../../components/hospital/CascadeTimeline';
import { BLOOD_INVENTORY, DEMO_STEPS } from '../../../data/mock';
import { LiveTracking } from '../../../components/hospital/LiveTracking';

interface RightPanelProps {
  activeTab: 'map' | 'tracking' | 'cascade' | 'inventory';
  onTabChange: (tab: 'map' | 'tracking' | 'cascade' | 'inventory') => void;
}

const TABS = [
  { id: 'map', label: 'Map' },
  { id: 'tracking', label: 'Tracking' },
  { id: 'cascade', label: 'Cascade' },
  { id: 'inventory', label: 'Inventory' },
] as const;

export function RightPanel({ activeTab, onTabChange }: RightPanelProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex gap-2 mb-6 bg-white/5 p-1.5 rounded-xl">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 py-2.5 px-3 text-sm font-bold rounded-lg transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-blood to-[#FF4D79] text-white shadow-[0_0_15px_rgba(255,0,60,0.3)]'
                : 'text-text-muted hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'map' && (
          <div className="space-y-4">
            <SurvivalMeter value={78} />
            
            <Card className="p-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-4">
                Critical Blood Types
              </h4>
              <div className="space-y-3">
                {BLOOD_INVENTORY.filter(b => b.critical).map((blood) => (
                  <div key={blood.type} className="flex items-center gap-3 p-2 rounded-lg bg-blood/10">
                    <div className="w-8 h-8 rounded-lg bg-blood/20 flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4 text-blood" />
                    </div>
                    <div className="flex-1">
                      <span className="font-bold text-text-primary">{blood.type}</span>
                    </div>
                    <span className="text-sm font-bold text-blood">{blood.units} units</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'tracking' && (
          <LiveTracking donorName="Ravi K." donorId="D1" bloodType="O-" eta={8} />
        )}

        {activeTab === 'cascade' && (
          <CascadeTimeline emergencyId="EMG-0041" steps={DEMO_STEPS} />
        )}

        {activeTab === 'inventory' && (
          <div className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-text-muted">
                  Blood Inventory
                </h4>
                <Badge variant="success">8 types</Badge>
              </div>
              <div className="space-y-2">
                {BLOOD_INVENTORY.map((blood) => (
                  <InventoryRow 
                    key={blood.type} 
                    bloodType={blood.type} 
                    units={blood.units} 
                  />
                ))}
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-success/10 to-transparent border-success/20">
              <div className="flex items-center gap-3 mb-3">
                <Check className="w-5 h-5 text-success" />
                <span className="font-semibold text-text-primary">Stock Status</span>
              </div>
              <p className="text-sm text-text-muted">
                6 of 8 blood types are above critical threshold
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
