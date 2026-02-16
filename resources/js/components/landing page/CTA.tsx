import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';

const CTA: React.FC = () => {
  return (
    <section id="cta" className="py-24 px-4 bg-[var(--bg-page)]">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-[var(--bg-card)] rounded-3xl p-12 md:p-16 text-center relative overflow-hidden backdrop-blur-md"
        >
          {/* --- INTERNAL ORBS ONLY --- */}
          {/* Top Right Orb */}
          <div 
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full blur-[100px] opacity-40 pointer-events-none"
            style={{ background: 'var(--accent-primary)', zIndex: 0 }}
          />
          
          {/* Bottom Left Orb */}
          <div 
            className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full blur-[100px] opacity-20 pointer-events-none"
            style={{ background: 'var(--accent-strong)', zIndex: 0 }}
          />

          <div className="relative z-10">
            <h2
              className="font-bold mb-4"
              style={{
                fontSize: 'clamp(1.875rem, 4vw, 3rem)',
                lineHeight: '1.1',
                letterSpacing: '-0.015em',
                color: 'var(--text-primary)',
              }}
            >
              Ready to Take Control of
              <br />
              Your Financial Future?
            </h2>

            <p
              className="max-w-2xl mx-auto mb-8"
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.125rem)',
                lineHeight: '1.6',
                color: 'var(--text-secondary)',
              }}
            >
              Join thousands of users who are already saving more and spending
              smarter with our intuitive expense tracking platform.
            </p>

            {/* Benefits List */}
            <div className="flex flex-wrap items-center justify-center gap-6 mb-10">
              {['Free to get started', 'No credit card required', 'Cancel anytime'].map((text) => (
                <div key={text} className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-[var(--accent-primary)] rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(129,81,217,0.3)]">
                    <Check size={14} className="text-white" strokeWidth={3} />
                  </div>
                  <span className="text-sm md:text-base font-medium text-[var(--text-primary)]">
                    {text}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <motion.a
              href="/login"
              type="button"
              className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-strong)] text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Start Tracking Today
              <ArrowRight size={20} />
            </motion.a>

            <p className="mt-6 text-sm text-[var(--text-muted)]">
              Get started in less than 2 minutes · No setup fees
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;