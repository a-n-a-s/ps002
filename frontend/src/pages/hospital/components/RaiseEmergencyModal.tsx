import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Droplet, MapPin, AlertTriangle, Check, AlertOctagon, Zap } from 'lucide-react';
import { Button, Card } from '../../../components/ui';
import { BLOOD_TYPES } from '../../../data/mock';

interface RaiseEmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { bloodType: string; hospital: string; location: string; urgency: string; units: number; patientCondition: string }) => void;
}

export function RaiseEmergencyModal({ isOpen, onClose, onSubmit }: RaiseEmergencyModalProps) {
  const [step, setStep] = useState(1);
  const [bloodType, setBloodType] = useState('');
  const [hospital, setHospital] = useState('');
  const [location, setLocation] = useState('');
  const [urgency, setUrgency] = useState('');
  const [units, setUnits] = useState(1);
  const [patientCondition, setPatientCondition] = useState('');
  const [showCriticalWarning, setShowCriticalWarning] = useState(false);

  if (!isOpen) return null;

  const handleUrgencySelect = (level: string) => {
    setUrgency(level);
    if (level === 'critical') {
      setTimeout(() => setShowCriticalWarning(true), 200);
    }
  };

  const handleSubmit = () => {
    onSubmit({ bloodType, hospital, location, urgency, units, patientCondition });
    onClose();
    setStep(1); setBloodType(''); setHospital(''); setLocation('');
    setUrgency(''); setUnits(1); setPatientCondition('');
  };

  const urgencyConfig = {
    critical: { bg: 'bg-blood/15 border-blood/50', text: 'text-blood', icon: AlertOctagon, label: '🔴 Critical', description: 'Life-threatening. Zero delay.' },
    warning: { bg: 'bg-warning/15 border-warning/50', text: 'text-warning', icon: AlertTriangle, label: '🟡 Urgent', description: 'Needed within 30 minutes.' },
    normal: { bg: 'bg-info/15 border-info/30', text: 'text-info', icon: Droplet, label: '🟢 Standard', description: 'Needed within 2 hours.' },
  } as const;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Critical warning modal */}
        <AnimatePresence>
          {showCriticalWarning && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative z-60 w-full max-w-sm rounded-2xl border border-blood/40 bg-[#1a0008] p-6 text-center"
              style={{ boxShadow: '0 0 60px rgba(255,0,60,0.3)' }}
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="w-16 h-16 rounded-full bg-blood/20 border border-blood/40 flex items-center justify-center mx-auto mb-4"
              >
                <Zap className="w-8 h-8 text-blood" />
              </motion.div>
              <h2 className="text-xl font-display font-black text-blood mb-2">⚠️ Zero Human Delay Mode</h2>
              <p className="text-sm text-white/70 mb-5">
                This will activate <strong className="text-white">Zero Human Delay Mode</strong>.
                AI will simultaneously alert all matched donors, bypass queues, and initiate auto-calls.
                No confirmation required.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCriticalWarning(false)}
                  className="flex-1 py-2.5 rounded-xl border border-white/15 text-white/60 text-sm font-semibold hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCriticalWarning(false)}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blood to-[#FF4D79] text-white text-sm font-bold"
                  style={{ boxShadow: '0 0 20px rgba(255,0,60,0.4)' }}
                >
                  Activate — CRITICAL
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!showCriticalWarning && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-lg rounded-2xl border border-white/15 bg-[#080812] shadow-2xl overflow-hidden z-50"
            style={{ boxShadow: '0 25px 80px rgba(0,0,0,0.6)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blood/15 border border-blood/25 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-blood" />
                </div>
                <div>
                  <h2 className="text-lg font-display font-bold text-white">Raise Emergency</h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    {[1, 2, 3].map(s => (
                      <div key={s} className="flex items-center gap-1">
                        <div className={`w-5 h-1.5 rounded-full transition-all duration-300 ${step >= s ? 'bg-blood' : 'bg-white/10'}`} />
                      </div>
                    ))}
                    <span className="text-xs text-white/30 ml-1">Step {step}/3</span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-white/50" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                    <div>
                      <label className="block text-xs font-bold text-white/40 uppercase tracking-wider mb-3">
                        Select Blood Type
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {BLOOD_TYPES.map(type => (
                          <motion.button
                            key={type}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => setBloodType(type)}
                            className={`p-3 rounded-xl text-center font-display font-black text-sm transition-all ${
                              bloodType === type
                                ? 'bg-gradient-to-br from-blood to-[#FF4D79] text-white shadow-[0_0_15px_rgba(255,0,60,0.3)]'
                                : 'bg-white/4 border border-white/8 text-white/60 hover:border-blood/30 hover:text-white'
                            }`}
                          >
                            {type}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-white/40 uppercase tracking-wider mb-3">
                        Urgency Level
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {Object.entries(urgencyConfig).map(([key, cfg]) => (
                          <motion.button
                            key={key}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleUrgencySelect(key)}
                            className={`p-3 rounded-xl border text-center transition-all ${
                              urgency === key ? cfg.bg : 'bg-white/3 border-white/8 hover:border-white/15'
                            }`}
                          >
                            <cfg.icon className={`w-5 h-5 mx-auto mb-1 ${urgency === key ? cfg.text : 'text-white/30'}`} />
                            <p className={`text-xs font-bold ${urgency === key ? cfg.text : 'text-white/50'}`}>{cfg.label}</p>
                            <p className="text-[9px] text-white/30 mt-0.5">{cfg.description}</p>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-white/40 uppercase tracking-wider mb-2">
                        Units Required
                      </label>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setUnits(u => Math.max(1, u - 1))}
                          className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all"
                        >−</button>
                        <span className="text-3xl font-display font-black text-white tabular-nums w-12 text-center">{units}</span>
                        <button
                          onClick={() => setUnits(u => u + 1)}
                          className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all"
                        >+</button>
                        <span className="text-sm text-white/40">units (450ml each)</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-xs font-bold text-white/40 uppercase tracking-wider mb-2">Hospital Name</label>
                      <input
                        type="text" value={hospital}
                        onChange={e => setHospital(e.target.value)}
                        placeholder="e.g., KIMS Hospital"
                        className="w-full px-4 py-3 rounded-xl bg-white/4 border border-white/8 text-white placeholder:text-white/25 focus:border-blood/50 focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-white/40 uppercase tracking-wider mb-2">Location / Ward</label>
                      <input
                        type="text" value={location}
                        onChange={e => setLocation(e.target.value)}
                        placeholder="e.g., ICU 3B"
                        className="w-full px-4 py-3 rounded-xl bg-white/4 border border-white/8 text-white placeholder:text-white/25 focus:border-blood/50 focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-white/40 uppercase tracking-wider mb-2">
                        Patient Condition <span className="text-white/20 normal-case font-normal">(optional)</span>
                      </label>
                      <textarea
                        value={patientCondition}
                        onChange={e => setPatientCondition(e.target.value)}
                        placeholder="e.g., Post-surgery patient, trauma case..."
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl bg-white/4 border border-white/8 text-white placeholder:text-white/25 focus:border-blood/50 focus:outline-none transition-colors resize-none"
                      />
                    </div>
                    <Card variant="ai" className="p-3">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-info mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-white/80">AI will automatically:</p>
                          <ul className="mt-1.5 space-y-1">
                            {['Find nearest compatible donors', 'Calculate optimal routing', 'Send multi-channel alerts'].map((item, i) => (
                              <li key={i} className="flex items-center gap-1.5 text-xs text-white/50">
                                <Check className="w-2.5 h-2.5 text-success" />{item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="rounded-xl border border-white/8 divide-y divide-white/5">
                      {[
                        { label: 'Blood Type', value: bloodType, color: 'text-blood' },
                        { label: 'Units', value: `${units} units (${units * 450}ml)`, color: 'text-white' },
                        { label: 'Urgency', value: urgencyConfig[urgency as keyof typeof urgencyConfig]?.label || urgency, color: urgency === 'critical' ? 'text-blood' : urgency === 'warning' ? 'text-warning' : 'text-info' },
                        { label: 'Hospital', value: hospital },
                        { label: 'Location', value: location },
                        ...(patientCondition ? [{ label: 'Condition', value: patientCondition }] : []),
                      ].map((item, i) => (
                        <div key={i} className="flex justify-between items-center px-4 py-2.5 text-sm">
                          <span className="text-white/40">{item.label}</span>
                          <span className={`font-semibold ${item.color || 'text-white/80'}`}>{item.value}</span>
                        </div>
                      ))}
                    </div>

                    {urgency === 'critical' && (
                      <motion.div
                        animate={{ borderColor: ['rgba(255,0,60,0.3)', 'rgba(255,0,60,0.6)', 'rgba(255,0,60,0.3)'] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="px-4 py-3 rounded-xl bg-blood/8 border text-sm"
                      >
                        <p className="text-blood font-semibold">⚡ Zero Human Delay Mode active</p>
                        <p className="text-white/50 text-xs mt-1">Simultaneous alerts will be sent to all matched donors.</p>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-6 py-4 border-t border-white/8 bg-white/2">
              {step > 1 && (
                <Button variant="ghost" onClick={() => setStep(s => s - 1)} className="flex-1">Back</Button>
              )}
              {step < 3 ? (
                <Button
                  variant="primary"
                  onClick={() => setStep(s => s + 1)}
                  className="flex-1"
                  disabled={step === 1 && (!bloodType || !urgency)}
                >
                  Continue
                </Button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  className="flex-1 py-3 rounded-lg font-bold text-sm text-white bg-gradient-to-r from-blood to-[#FF4D79] flex items-center justify-center gap-2"
                  style={{ boxShadow: '0 0 25px rgba(255,0,60,0.35)' }}
                >
                  <AlertTriangle className="w-4 h-4" />
                  Raise Emergency Now
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
