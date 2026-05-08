import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section
      className="relative overflow-hidden bg-[var(--bg-page)]"
      style={{ minHeight: '100vh' }}
    >
      {/* FULL PAGE BACKGROUND IMAGE */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `url("/acevia-hero-background.jpg")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.4,
        }}
      />

      {/* Animated Background Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-1">
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(129, 81, 217, 0.3) 0%, rgba(129, 81, 217, 0.05) 40%, transparent 70%)',
            filter: 'blur(60px)',
          }}
          animate={{ x: [0, 50, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          initial={{ top: '-10%', right: '-5%' }}
        />
      </div>

      {/* MAIN CONTENT CONTAINER - Changed to a flex column with space-between */}
      <div
        className="relative z-10 flex flex-col justify-between"
        style={{ minHeight: '100vh', padding: 'clamp(2rem, 6vw, 8rem)' }}
      >
        
        {/* TOP LEFT: HEADLINE */}
        <motion.div
          className="w-full lg:w-[60%]"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <motion.h1
            className="font-bold"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              lineHeight: '1',
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
            }}
          >
            Track Expenses,
            <br />
            <span className="text-[var(--accent-primary)]">Build Better Habits</span>
          </motion.h1>
        </motion.div>

        {/* BOTTOM RIGHT: SUBTEXT AND BUTTON */}
        <motion.div
          className="w-full lg:w-[40%] self-end text-right flex flex-col items-end"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        >
          <motion.p
            className="mb-8"
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              lineHeight: '1.6',
              color: 'var(--text-secondary)',
              maxWidth: '400px'
            }}
          >
            The simplest way to monitor your spending, manage budgets, and gain
            insights into your financial health. All in one beautiful app.
          </motion.p>

          <motion.div className="flex justify-end w-full">
            <motion.a
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-strong)] text-white rounded-full font-semibold text-lg shadow-lg shadow-[var(--accent-glow)] min-w-[220px] justify-center"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Start Tracking Today
              <ArrowRight size={20} />
            </motion.a>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;