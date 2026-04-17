import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, User, Droplet, MapPin, Calendar, Weight, Check, ChevronRight } from 'lucide-react';
import { BloodGroupSelector } from '../../../components/donor/BloodGroupSelector';

interface DonorOnboardingProps {
  onComplete: (profile: DonorProfile) => void;
}

interface DonorProfile {
  name: string;
  bloodType: string;
  age: string;
  weight: string;
  lastDonation: string;
  location: string;
  isAvailable: boolean;
}

const STEPS = [
  { id: 1, label: 'Blood Type', icon: Droplet },
  { id: 2, label: 'Profile', icon: User },
  { id: 3, label: 'Location', icon: MapPin },
  { id: 4, label: 'Ready', icon: Check },
];

export function DonorOnboarding({ onComplete }: DonorOnboardingProps) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<DonorProfile>({
    name: '',
    bloodType: '',
    age: '',
    weight: '',
    lastDonation: '',
    location: '',
    isAvailable: true,
  });
  const [detectingGPS, setDetectingGPS] = useState(false);
  const [healthCheck, setHealthCheck] = useState<null | 'eligible' | 'ineligible'>(null);

  const detectGPS = () => {
    setDetectingGPS(true);
    setTimeout(() => {
      setProfile(p => ({ ...p, location: 'Hyderabad, Telangana' }));
      setDetectingGPS(false);
    }, 1500);
  };

  const runHealthCheck = () => {
    const weight = parseInt(profile.weight);
    const age = parseInt(profile.age);
    if (weight >= 50 && age >= 18 && age <= 65) {
      setHealthCheck('eligible');
    } else {
      setHealthCheck('ineligible');
    }
  };

  const canProceed = () => {
    if (step === 1) return !!profile.bloodType;
    if (step === 2) return !!profile.name && !!profile.age && !!profile.weight;
    if (step === 3) return !!profile.location;
    return true;
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blood rounded-full mix-blend-screen filter blur-[150px] opacity-5" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-info rounded-full mix-blend-screen filter blur-[150px] opacity-[0.03]" />
      </div>

      <div className="w-full max-w-lg relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blood/10 border border-blood/20 mb-4">
            <span className="w-2 h-2 rounded-full bg-blood animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-blood">Donor Registration</span>
          </div>
          <h1 className="text-3xl font-display font-black text-white">Join BloodLink</h1>
          <p className="text-white/50 mt-2">Set up your donor profile in 60 seconds</p>
        </motion.div>

        {/* Step indicators */}
        <div className="flex items-center justify-between mb-8 px-2">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <motion.div
                animate={{
                  backgroundColor: step > s.id ? '#FF003C' : step === s.id ? 'rgba(255,0,60,0.15)' : 'rgba(255,255,255,0.05)',
                  borderColor: step >= s.id ? '#FF003C' : 'rgba(255,255,255,0.1)',
                }}
                className="w-9 h-9 rounded-full border-2 flex items-center justify-center"
              >
                {step > s.id ? (
                  <Check className="w-4 h-4 text-white" />
                ) : (
                  <s.icon className={`w-4 h-4 ${step === s.id ? 'text-blood' : 'text-white/30'}`} />
                )}
              </motion.div>
              {i < STEPS.length - 1 && (
                <div className="flex-1 h-px mx-2 w-10 sm:w-16"
                  style={{ background: step > s.id ? '#FF003C' : 'rgba(255,255,255,0.1)' }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Content card */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          className="rounded-2xl border border-white/10 bg-white/3 backdrop-blur-xl p-6"
          style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}
        >
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-display font-bold text-white">What's your blood type?</h2>
              <p className="text-sm text-white/50">Select your blood group to get started</p>
              <BloodGroupSelector
                selected={profile.bloodType}
                onChange={bt => setProfile(p => ({ ...p, bloodType: bt }))}
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-display font-bold text-white">Your Profile</h2>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-white/40 mb-2 block">Full Name</label>
                <input
                  type="text" value={profile.name}
                  onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g., Rahul Sharma"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/25 focus:border-blood/50 focus:outline-none transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-white/40 mb-2 block flex items-center gap-1">
                    <User className="w-3 h-3" /> Age
                  </label>
                  <input
                    type="number" value={profile.age}
                    onChange={e => setProfile(p => ({ ...p, age: e.target.value }))}
                    placeholder="25"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/25 focus:border-blood/50 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-white/40 mb-2 block flex items-center gap-1">
                    <Weight className="w-3 h-3" /> Weight (kg)
                  </label>
                  <input
                    type="number" value={profile.weight}
                    onChange={e => setProfile(p => ({ ...p, weight: e.target.value }))}
                    placeholder="70"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/25 focus:border-blood/50 focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-white/40 mb-2 block flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Last Donation Date
                </label>
                <input
                  type="date" value={profile.lastDonation}
                  onChange={e => setProfile(p => ({ ...p, lastDonation: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-blood/50 focus:outline-none transition-colors"
                />
              </div>

              {/* Health eligibility check */}
              {profile.age && profile.weight && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {healthCheck === null ? (
                    <button
                      onClick={runHealthCheck}
                      className="w-full py-2.5 rounded-xl border border-info/30 text-info text-sm font-semibold hover:bg-info/5 transition-colors"
                    >
                      ⚡ Run Instant Health Eligibility Check
                    </button>
                  ) : (
                    <div className={`px-4 py-3 rounded-xl border text-sm font-semibold flex items-center gap-2 ${
                      healthCheck === 'eligible'
                        ? 'bg-success/10 border-success/30 text-success'
                        : 'bg-blood/10 border-blood/30 text-blood'
                    }`}>
                      {healthCheck === 'eligible' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                      {healthCheck === 'eligible' ? 'You are eligible to donate blood!' : 'You may not meet eligibility criteria'}
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-display font-bold text-white">Your Location</h2>
              <p className="text-sm text-white/50">We use this to match you with nearby emergencies</p>

              <button
                onClick={detectGPS}
                disabled={detectingGPS}
                className="w-full py-4 rounded-xl border border-info/30 bg-info/5 text-info font-semibold flex items-center justify-center gap-3 hover:bg-info/10 transition-all"
              >
                {detectingGPS ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-info border-t-transparent rounded-full"
                    />
                    Detecting location...
                  </>
                ) : (
                  <>
                    <MapPin className="w-5 h-5" />
                    Auto-detect my location
                  </>
                )}
              </button>

              {profile.location && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-success/10 border border-success/20"
                >
                  <Check className="w-4 h-4 text-success flex-shrink-0" />
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wider">Detected Location</p>
                    <p className="font-semibold text-white">{profile.location}</p>
                  </div>
                </motion.div>
              )}

              <div className="relative flex items-center gap-3">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-xs text-white/30">or enter manually</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              <input
                type="text" value={profile.location}
                onChange={e => setProfile(p => ({ ...p, location: e.target.value }))}
                placeholder="City, State"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/25 focus:border-blood/50 focus:outline-none transition-colors"
              />
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="text-center py-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  className="w-20 h-20 rounded-full bg-success/15 border border-success/30 flex items-center justify-center mx-auto mb-4"
                >
                  <Check className="w-10 h-10 text-success" />
                </motion.div>
                <h2 className="text-2xl font-display font-black text-white">You're all set!</h2>
                <p className="text-white/50 mt-2">Welcome to BloodLink, {profile.name}.</p>
              </div>

              {/* Profile summary */}
              <div className="rounded-xl bg-white/3 border border-white/8 divide-y divide-white/5">
                {[
                  { label: 'Blood Type', value: profile.bloodType, color: 'text-blood' },
                  { label: 'Age', value: `${profile.age} years` },
                  { label: 'Weight', value: `${profile.weight} kg` },
                  { label: 'Location', value: profile.location },
                ].map(item => (
                  <div key={item.label} className="flex justify-between items-center px-4 py-2.5">
                    <span className="text-sm text-white/40">{item.label}</span>
                    <span className={`text-sm font-bold ${item.color || 'text-white'}`}>{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="px-4 py-3 rounded-xl bg-blood/8 border border-blood/20 text-sm text-white/70">
                🔔 You'll receive emergency alerts when O- blood is critically needed nearby.
              </div>
            </div>
          )}
        </motion.div>

        {/* Navigation */}
        <div className="flex gap-3 mt-5">
          {step > 1 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="px-6 py-3 rounded-xl border border-white/10 text-white/50 hover:text-white hover:border-white/20 transition-all font-semibold text-sm"
            >
              Back
            </button>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={!canProceed()}
            onClick={() => {
              if (step < 4) setStep(s => s + 1);
              else onComplete(profile);
            }}
            className="flex-1 py-3.5 rounded-xl font-display font-bold text-white uppercase tracking-wider
              bg-gradient-to-r from-blood to-[#FF4D79] disabled:opacity-40 disabled:cursor-not-allowed
              flex items-center justify-center gap-2 transition-all"
            style={{ boxShadow: '0 0 25px rgba(255,0,60,0.3)' }}
          >
            {step < 4 ? 'Continue' : 'Enter Donor Dashboard'}
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
