import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 px-4 overflow-hidden bg-[var(--bg-page)]">
      {/* Animated Background Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Purple orbs */}
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(129, 81, 217, 0.4) 0%, rgba(129, 81, 217, 0.1) 40%, transparent 70%)',
            filter: 'blur(60px)',
          }}
          animate={{ x: [0, 50, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          initial={{ top: '-10%', right: '-5%' }}
        />

        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(129, 81, 217, 0.35) 0%, rgba(129, 81, 217, 0.08) 50%, transparent 70%)',
            filter: 'blur(50px)',
          }}
          animate={{ x: [0, -40, 0], y: [0, 50, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          initial={{ top: '30%', right: '10%' }}
        />

        <motion.div
          className="absolute w-[300px] h-[300px] rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(129, 81, 217, 0.3) 0%, rgba(106, 62, 196, 0.15) 40%, transparent 70%)',
            filter: 'blur(40px)',
          }}
          animate={{ x: [0, 30, 0], y: [0, -40, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          initial={{ bottom: '10%', right: '20%' }}
        />

        <motion.div
          className="absolute w-[350px] h-[350px] rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(129, 81, 217, 0.35) 0%, rgba(106, 62, 196, 0.1) 50%, transparent 70%)',
            filter: 'blur(50px)',
          }}
          animate={{ x: [0, -25, 0], y: [0, 20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}
          initial={{ top: '5%', left: '-5%' }}
        />

        {/* White/Beigish orbs */}
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(245, 245, 220, 0.4) 0%, rgba(245, 245, 220, 0.1) 40%, transparent 70%)', // beige gradient
            filter: 'blur(60px)',
          }}
          animate={{ x: [0, -40, 0], y: [0, 20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          initial={{ top: '20%', left: '-10%' }}
        />

        <motion.div
          className="absolute w-[250px] h-[250px] rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(245, 245, 220, 0.35) 0%, rgba(245, 245, 220, 0.08) 50%, transparent 70%)',
            filter: 'blur(50px)',
          }}
          animate={{ x: [0, -20, 0], y: [0, 15, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          initial={{ top: '-5%', left: '5%' }}
        />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent-wash)] border border-[var(--accent-primary)]/30 rounded-full mb-6"
            >
              <Sparkles size={16} className="text-[var(--accent-primary)]" />
              <span className="text-sm font-medium text-[var(--accent-primary)]">
                Take Control of Your Finances
              </span>
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
              className="mb-8 max-w-xl"
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
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-strong)] text-white rounded-full font-semibold text-lg shadow-lg shadow-[var(--accent-glow)] min-w-[240px] justify-center"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Start Tracking Today
                <ArrowRight size={20} />
              </motion.a>

              <motion.a
                href="#features"
                className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border border-[#333333] text-[var(--text-primary)] rounded-full font-medium text-lg hover:bg-white/5 min-w-[240px] justify-center transition-colors"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                Learn More
              </motion.a>
            </motion.div>
          </motion.div>

          {/* RIGHT SIDE – FLOATING VISUAL */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
            className="relative hidden lg:flex items-center justify-center h-[600px]"
          >
            <motion.div
              className="relative w-full max-w-md"
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            >
              {/* Main Card */}
              <div className="bg-[var(--bg-card)] border] rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
                <div className="flex justify-between mb-6">
                  <div>
                    <p className="text-sm text-[var(--text-muted)]">Total Balance</p>
                    <p className="text-3xl font-bold">₱12,847.50</p>
                  </div>
                  <div className="w-12 h-12 bg-[var(--accent-wash)] rounded-2xl flex items-center justify-center">
                    ₱
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-2xl bg-[var(--bg-page)]">
                    <p className="text-xs text-[var(--text-muted)]">Income</p>
                    <p className="text-xl text-green-400">+₱15,240</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[var(--bg-page)]">
                    <p className="text-xs text-[var(--text-muted)]">Expenses</p>
                    <p className="text-xl text-red-400">-₱6,180</p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Monthly Budget</span>
                    <span>68%</span>
                  </div>
                  <div className="h-2 bg-[var(--bg-page)] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-strong)]"
                      initial={{ width: 0 }}
                      animate={{ width: '68%' }}
                      transition={{ duration: 1.5, delay: 1 }}
                    />
                  </div>
                </div>
              </div>

              {/* Floating Mini Cards */}
              <motion.div
                className="absolute -top-12 -right-6 bg-[var(--bg-card)] border] rounded-2xl p-4 shadow-xl backdrop-blur-xl"
                animate={{
                  y: [0, 15, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.5,
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <span className="text-xl">↗</span>
                  </div>
                  <div>
                    <p className="text-[var(--text-muted)] text-xs">Saved</p>
                    <p className="text-lg font-semibold text-green-400">+15%</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute -bottom-16 -left-6 bg-[var(--bg-card)] border] rounded-2xl p-4 shadow-xl backdrop-blur-xl"
                animate={{
                  y: [0, -15, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 1,
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[var(--accent-wash)] rounded-xl flex items-center justify-center">
                    <span className="text-xl">📊</span>
                  </div>

                  <div className="flex flex-col">
                    <p className="text-[var(--text-muted)] text-xs">Insights</p>
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      12 New
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
