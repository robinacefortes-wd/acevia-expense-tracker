import { motion } from 'framer-motion';
import { ArrowRight, Check, TrendingUp, PiggyBank, BarChart3, Wallet, ShieldCheck, Zap } from 'lucide-react';
import React from 'react';

const floatingIcons = [
  { icon: TrendingUp, x: '8%', y: '20%', delay: 0, duration: 6, color: '#8151d9' },
  { icon: PiggyBank, x: '88%', y: '15%', delay: 1, duration: 7, color: '#10b981' },
  { icon: BarChart3, x: '5%', y: '70%', delay: 2, duration: 5, color: '#f59e0b' },
  { icon: Wallet, x: '90%', y: '65%', delay: 0.5, duration: 8, color: '#8151d9' },
  { icon: ShieldCheck, x: '15%', y: '85%', delay: 1.5, duration: 6, color: '#10b981' },
  { icon: Zap, x: '80%', y: '80%', delay: 2.5, duration: 7, color: '#f59e0b' },
];

const stats = [
  { value: '₱1M+', label: 'Tracked by users' },
  { value: '50+', label: 'Active users' },
  { value: '99.9%', label: 'Uptime' },
];

const CTA: React.FC = () => {
  return (
    <section
      id="cta"
      className="relative py-32 px-4 overflow-hidden"
    >
      {/* Floating background icons */}
      {floatingIcons.map((item, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{ left: item.x, top: item.y }}
          animate={{ y: [0, -20, 0], opacity: [0.15, 0.35, 0.15] }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: item.delay,
          }}
        >
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{
              backgroundColor: `${item.color}12`,
              border: `1px solid ${item.color}25`,
            }}
          >
            <item.icon size={20} style={{ color: item.color }} />
          </div>
        </motion.div>
      ))}

      {/* Center glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(129,81,217,0.12) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-4xl mx-auto relative z-10">

        {/* Top divider line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full h-px mb-16 mx-auto"
          style={{
            background: 'linear-gradient(to right, transparent, rgba(129,81,217,0.5), transparent)',
            maxWidth: '400px',
          }}
        />

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-12 mb-16 flex-wrap"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <p
                className="text-4xl font-black mb-1"
                style={{ color: '#8151d9', letterSpacing: '-0.02em' }}
              >
                {stat.value}
              </p>
              <p className="text-xs uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Main heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-8"
        >
          <h2
            className="font-black mb-6"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              lineHeight: '1.05',
              letterSpacing: '-0.025em',
              color: '#ffffff',
            }}
          >
            Start Tracking.
            <br />
            <span style={{ color: '#8151d9' }}>Start Saving.</span>
            <br />
            Start Today.
          </h2>

          <p
            className="max-w-xl mx-auto"
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.15rem)',
              lineHeight: '1.7',
              color: 'rgba(255,255,255,0.45)',
            }}
          >
            Join users who are already taking control of their finances with
            Acevia — the all-in-one expense tracker built for real life.
          </p>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
        >
          <motion.a
            href="/register"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-semibold text-lg text-white"
            style={{
              background: 'linear-gradient(135deg, #8151d9 0%, #a178e8 100%)',
              boxShadow: '0 0 30px rgba(129,81,217,0.35)',
            }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Get Started for Free
            <ArrowRight size={20} />
          </motion.a>

          <motion.a
            href="#features"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-medium text-lg"
            style={{
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.6)',
            }}
            whileHover={{ scale: 1.03, borderColor: 'rgba(255,255,255,0.25)', color: '#ffffff' }}
            whileTap={{ scale: 0.98 }}
          >
            See Features
          </motion.a>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-6"
        >
          {[
            'Free to get started',
            'No credit card required',
            'No hidden fees',
            'Cancel anytime',
          ].map((text) => (
            <div key={text} className="flex items-center gap-2">
              <Check size={13} style={{ color: '#8151d9' }} />
              <span className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {text}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Bottom divider line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full h-px mt-16 mx-auto"
          style={{
            background: 'linear-gradient(to right, transparent, rgba(129,81,217,0.5), transparent)',
            maxWidth: '400px',
          }}
        />

      </div>
    </section>
  );
};

export default CTA;