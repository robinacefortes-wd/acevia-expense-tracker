import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import React, { useState } from 'react';

const metrics = [
  { label: 'Total Income', value: '₱120,000', color: '#8151d9' },
  { label: 'Total Expenses', value: '₱57,055', color: '#b91010' },
  { label: 'Savings', value: '₱31,500', color: '#f59e0b' },
];

const Hero: React.FC = () => {
  const [activeMetric, setActiveMetric] = useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveMetric(prev => (prev + 1) % metrics.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="relative overflow-hidden bg-[var(--bg-page)]"
      style={{ minHeight: '100vh' }}
    >
      {/* Animated Background Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(129, 81, 217, 0.4) 0%, rgba(129, 81, 217, 0.1) 40%, transparent 70%)',
            filter: 'blur(60px)',
          }}
          animate={{ x: [0, 50, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          initial={{ top: '-10%', right: '-5%' }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(129, 81, 217, 0.35) 0%, rgba(129, 81, 217, 0.08) 50%, transparent 70%)',
            filter: 'blur(50px)',
          }}
          animate={{ x: [0, -40, 0], y: [0, 50, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          initial={{ top: '30%', right: '10%' }}
        />
        <motion.div
          className="absolute w-[300px] h-[300px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(129, 81, 217, 0.3) 0%, rgba(106, 62, 196, 0.15) 40%, transparent 70%)',
            filter: 'blur(40px)',
          }}
          animate={{ x: [0, 30, 0], y: [0, -40, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          initial={{ bottom: '10%', right: '20%' }}
        />
        <motion.div
          className="absolute w-[350px] h-[350px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(129, 81, 217, 0.35) 0%, rgba(106, 62, 196, 0.1) 50%, transparent 70%)',
            filter: 'blur(50px)',
          }}
          animate={{ x: [0, -25, 0], y: [0, 20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}
          initial={{ top: '5%', left: '-5%' }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(245, 245, 220, 0.4) 0%, rgba(245, 245, 220, 0.1) 40%, transparent 70%)',
            filter: 'blur(60px)',
          }}
          animate={{ x: [0, -40, 0], y: [0, 20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          initial={{ top: '20%', left: '-10%' }}
        />
        <motion.div
          className="absolute w-[250px] h-[250px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(245, 245, 220, 0.35) 0%, rgba(245, 245, 220, 0.08) 50%, transparent 70%)',
            filter: 'blur(50px)',
          }}
          animate={{ x: [0, -20, 0], y: [0, 15, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          initial={{ top: '-5%', left: '5%' }}
        />
      </div>

      {/* RIGHT SIDE — Full height edge-to-edge */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
        className="hidden lg:block absolute top-0 bottom-0 right-0"
        style={{ width: '45%', zIndex: 1 }}
      >

        {/* Fade mask — left edge */}
        <div
          className="absolute inset-y-0 left-0 z-10 pointer-events-none"
          style={{
            width: '220px',
            background: 'linear-gradient(to right, var(--bg-page) 0%, transparent 100%)',
          }}
        />

        {/* Fade mask — top edge */}
        <div
          className="absolute inset-x-0 top-0 z-10 pointer-events-none"
          style={{
            height: '140px',
            background: 'linear-gradient(to bottom, var(--bg-page) 0%, transparent 100%)',
          }}
        />

        {/* Fade mask — bottom edge */}
        <div
          className="absolute inset-x-0 bottom-0 z-10 pointer-events-none"
          style={{
            height: '140px',
            background: 'linear-gradient(to top, var(--bg-page) 0%, transparent 100%)',
          }}
        />

        {/* Purple glow */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background: 'radial-gradient(ellipse 60% 50% at 60% 50%, rgba(129,81,217,0.12) 0%, transparent 70%)',
          }}
        />

        {/* Video */}
        <video
          src="/dashboard-preview.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
      </motion.div>

      {/* LEFT SIDE — Text content */}
      <div
        className="relative z-10 flex items-center"
        style={{ minHeight: '100vh', paddingLeft: '16rem', paddingRight: '4rem' }}
      >
        <motion.div
          className="w-full lg:w-[45%]"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Badge */}
          <motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.2, duration: 0.5 }}
  className="flex items-center gap-3 mb-8"
>
  <div className="h-px w-8" style={{ backgroundColor: '#8151d9' }} />
  <span className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: '#8151d9' }}>
    Expense Tracker
  </span>
  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.15)' }}>/</span>
  <span className="text-xs uppercase tracking-[0.3em]" style={{ color: 'rgba(255,255,255,0.3)' }}>
    Beta
  </span>
  <div className="h-px w-8" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
</motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="font-bold mb-6"
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              lineHeight: '1',
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
            }}
          >
            Track Expenses,
            <br />
            <span className="text-[var(--accent-primary)]">Build Better</span>
            <br />
            Habits
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mb-8 max-w-lg"
            style={{
              fontSize: 'clamp(1.125rem, 2.5vw, 1.25rem)',
              lineHeight: '1.6',
              color: 'var(--text-secondary)',
            }}
          >
            The simplest way to monitor your spending, manage budgets, and gain
            insights into your financial health—all in one beautiful app.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 mb-8"
          >
            <motion.a
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-strong)] text-white rounded-full font-semibold text-lg shadow-lg shadow-[var(--accent-glow)] min-w-[220px] justify-center"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Start Tracking Today
              <ArrowRight size={20} />
            </motion.a>

            <motion.a
              href="#features"
              className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border border-[#333333] text-[var(--text-primary)] rounded-full font-medium text-lg hover:bg-white/5 min-w-[220px] justify-center transition-colors"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              Learn More
            </motion.a>
          </motion.div>

          {/* Glowing metric pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6 }}
            className="flex items-center gap-3 flex-wrap"
          >
            {metrics.map((metric, i) => (
              <div
                key={metric.label}
                className="flex items-center gap-2 px-4 py-2 rounded-full"
                style={{
                  backgroundColor: activeMetric === i ? `${metric.color}18` : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${activeMetric === i ? `${metric.color}50` : 'rgba(255,255,255,0.08)'}`,
                  boxShadow: activeMetric === i ? `0 0 16px ${metric.color}25` : 'none',
                  transition: 'all 0.4s ease',
                }}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: metric.color,
                    boxShadow: activeMetric === i ? `0 0 6px ${metric.color}` : 'none',
                    transition: 'all 0.4s ease',
                  }}
                />
                <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {metric.label}
                </span>
                <span className="text-xs font-bold" style={{ color: activeMetric === i ? metric.color : 'rgba(255,255,255,0.7)' }}>
                  {metric.value}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;