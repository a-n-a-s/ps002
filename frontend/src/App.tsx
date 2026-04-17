import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { LiveTicker, NavigationBar } from './components/shared';
import { Heart, Building2, ArrowRight, Zap, Shield, Clock, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import DonorsPage from './pages/donor';
import HospitalsPage from './pages/hospital';

type PortalTheme = 'donor' | 'hospital';

const portalThemeClasses: Record<PortalTheme, {
  hoverBorder: string; glow: string; iconBox: string;
  iconColor: string; bullet: string; cta: string; bg: string;
}> = {
  donor: {
    hoverBorder: 'hover:border-blood/50',
    glow: 'from-blood/20 to-pink-500/5',
    iconBox: 'from-blood/20 to-pink-500/10 border-blood/20',
    iconColor: 'text-blood',
    bullet: 'bg-blood',
    cta: 'text-blood',
    bg: 'from-blood/5 to-transparent',
  },
  hospital: {
    hoverBorder: 'hover:border-info/50',
    glow: 'from-info/20 to-cyan-400/5',
    iconBox: 'from-info/20 to-cyan-400/10 border-info/20',
    iconColor: 'text-info',
    bullet: 'bg-info',
    cta: 'text-info',
    bg: 'from-info/5 to-transparent',
  },
};

function PortalCard({
  to, icon: Icon, title, description, features, theme, index,
}: {
  to: string; icon: typeof Heart; title: string; description: string;
  features: string[]; theme: PortalTheme; index: number;
}) {
  const classes = portalThemeClasses[theme];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.15, type: 'spring', stiffness: 120, damping: 20 }}
    >
      <Link
        to={to}
        className={`group relative block p-8 lg:p-10 rounded-2xl bg-gradient-to-br ${classes.bg} border border-white/[0.08] ${classes.hoverBorder} transition-all duration-300 overflow-hidden`}
        style={{ backdropFilter: 'blur(20px)' }}
      >
        {/* Hover glow */}
        <div className={`absolute top-0 right-0 w-80 h-80 bg-gradient-to-br ${classes.glow} rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

        <div className="relative">
          {/* Icon */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            className={`w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br ${classes.iconBox} flex items-center justify-center border`}
          >
            <Icon className={`w-10 h-10 ${classes.iconColor}`} />
          </motion.div>

          <h2 className="text-2xl lg:text-3xl font-display font-bold text-white mb-2">{title}</h2>
          <p className="text-white/55 mb-6 leading-relaxed">{description}</p>

          <ul className="space-y-2 mb-8">
            {features.map((feature, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                className="flex items-center gap-2.5 text-sm text-white/50"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${classes.bullet} flex-shrink-0`} />
                {feature}
              </motion.li>
            ))}
          </ul>

          <div className={`flex items-center gap-2 ${classes.cta} font-bold group-hover:gap-3 transition-all duration-200`}>
            <span>Enter Portal</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function StatsBanner() {
  const stats = [
    { label: 'Lives Saved', value: '23', tone: 'success' as const, suffix: '' },
    { label: 'Donors Online', value: '142', tone: 'success' as const, suffix: '' },
    { label: 'Avg Response', value: '8.4', tone: 'info' as const, suffix: 'min' },
    { label: 'Critical Alerts', value: '2', tone: 'blood' as const, suffix: '' },
  ];

  const toneClasses = { success: 'text-success', info: 'text-info', blood: 'text-blood' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="flex flex-wrap justify-center gap-8 lg:gap-16 py-8"
    >
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 + i * 0.1 }}
          className="text-center"
        >
          <p className={`text-4xl lg:text-5xl font-display font-black ${toneClasses[stat.tone]}`}>
            {stat.value}
            {stat.suffix && <span className="text-2xl ml-1">{stat.suffix}</span>}
          </p>
          <p className="text-xs uppercase tracking-widest text-white/40 mt-1">{stat.label}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}

function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-primary relative overflow-x-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blood rounded-full mix-blend-screen filter blur-[150px] opacity-8 animate-float pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-info rounded-full mix-blend-screen filter blur-[150px] opacity-[0.04] animate-float pointer-events-none" style={{ animationDelay: '2s' }} />
      <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[40%] h-[30%] bg-ai rounded-full mix-blend-screen filter blur-[180px] opacity-[0.03] pointer-events-none" />

      {/* Live ticker */}
      <LiveTicker items={[
        { label: 'Lives Saved', value: 23, color: 'success' },
        { label: 'Donors Online', value: 142, color: 'success' },
        { label: 'Avg Time', value: '8.4m', color: 'info' },
        { label: 'O- Critical', value: 2, color: 'blood' },
      ]} />

      <NavigationBar emergencyCount={1} donorCount={142} avgTime={8} livesSaved={23} />

      <main className="pt-28 md:pt-32 pb-20 px-4 sm:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">

          {/* Hero */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 }}
              className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-success/10 border border-success/20 mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
              </span>
              <span className="text-sm font-semibold text-success tracking-wide uppercase">Live Demo Active</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-display font-black tracking-tight mb-6"
            >
              <span className="bg-gradient-to-r from-[#FF003C] via-[#FF4D79] to-[#FF003C] bg-clip-text text-transparent"
                style={{ backgroundSize: '200% 100%', animation: 'gradientShift 3s ease infinite' }}>
                BLOOD
              </span>
              <span className="text-white">LINK</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="text-lg lg:text-xl text-white/55 max-w-2xl mx-auto mb-8 leading-relaxed"
            >
              Real-time emergency blood coordination powered by AI.
              <br />
              <span className="text-white font-medium">Connecting donors to hospitals in minutes, not hours.</span>
            </motion.p>

            <StatsBanner />
          </div>

          {/* Split portal cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
            <PortalCard
              to="/donor"
              icon={Heart}
              title="Donor Portal"
              description="Register as a blood donor, receive emergency alerts, and track your life-saving impact in real time."
              features={[
                'Real-time emergency alerts with 45s response',
                'AI-powered donor matching & routing',
                'Donation history, streak tracker & badges',
                'Survival probability meter',
                'AI companion during donation',
              ]}
              theme="donor"
              index={0}
            />
            <PortalCard
              to="/hospital"
              icon={Building2}
              title="Hospital Portal"
              description="Command center for emergency coordination with AI-powered donor matching and live inventory management."
              features={[
                'Live donor tracking map',
                'AI cascade visualization & escalation',
                'Real-time blood inventory intelligence',
                'Cross-hospital redistribution',
                'Zero Human Delay Mode for critical cases',
              ]}
              theme="hospital"
              index={1}
            />
          </div>

          {/* Feature pillars */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-16"
          >
            {[
              { icon: Zap, color: 'blood', title: '5× Faster', desc: 'Emergency response time vs traditional methods' },
              { icon: Shield, color: 'success', title: 'AI Powered', desc: 'Smart donor matching with 91% accuracy score' },
              { icon: Activity, color: 'info', title: 'Zero Delay', desc: 'Simultaneous multi-channel alerts in < 3 seconds' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.55 + i * 0.1 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.07] text-center hover:border-white/[0.12] transition-all duration-300"
              >
                <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-${item.color}/10 flex items-center justify-center`}>
                  <item.icon className={`w-6 h-6 text-${item.color}`} />
                </div>
                <h3 className="font-display font-bold text-white mb-1">{item.title}</h3>
                <p className="text-sm text-white/40">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Time comparison banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-center p-8 rounded-2xl bg-gradient-to-r from-white/[0.04] via-white/[0.02] to-white/[0.04] border border-white/[0.08] max-w-2xl mx-auto"
          >
            <p className="text-white/40 mb-2 text-sm uppercase tracking-wider">Traditional blood delivery</p>
            <p className="text-4xl font-display font-bold text-white/25 line-through decoration-blood/50 mb-4">
              45 minutes
            </p>
            <div className="flex items-center justify-center gap-4">
              <ArrowRight className="w-7 h-7 text-blood animate-pulse" />
              <div>
                <p className="text-5xl lg:text-6xl font-display font-black bg-gradient-to-r from-success to-emerald-400 bg-clip-text text-transparent">
                  9 minutes
                </p>
                <p className="text-sm text-success mt-1 font-semibold">With BloodLink AI</p>
              </div>
            </div>
            <p className="text-xs text-white/25 mt-4">
              Based on live demo data · {'>'}80% faster response times documented
            </p>
          </motion.div>

          {/* Subtle clock icon */}
          <div className="text-center mt-8">
            <Clock className="w-4 h-4 text-white/15 mx-auto" />
          </div>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/donor/*" element={<DonorsPage />} />
          <Route path="/hospital/*" element={<HospitalsPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
