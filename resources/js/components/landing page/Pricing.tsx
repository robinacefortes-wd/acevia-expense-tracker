import { motion } from 'framer-motion';
import { Check, Sparkles, Zap } from 'lucide-react';
import React from 'react';

const plans = [
  {
    name: 'Starter',
    badge: 'Free Forever',
    price: '0',
    description: 'Perfect for individuals just getting started with expense tracking.',
    color: '#8151d9',
    borderColor: 'rgba(129,81,217,0.3)',
    glowColor: 'rgba(129,81,217,0.15)',
    icon: Zap,
    features: [
      'Track unlimited transactions',
      'Monthly budget management',
      'Spending categories',
      'Basic analytics dashboard',
      'CSV export',
      'Mobile responsive',
    ],
    cta: 'Get Started Free',
    ctaStyle: {
      background: 'linear-gradient(135deg, #8151d9 0%, #a178e8 100%)',
      color: '#fff',
    },
    popular: false,
  },
  {
    name: 'Pro',
    badge: 'Beta — Free During Testing',
    price: '0',
    description: 'Full access to all features while we\'re in beta. No credit card needed.',
    color: '#10b981',
    borderColor: 'rgba(16,185,129,0.4)',
    glowColor: 'rgba(16,185,129,0.12)',
    icon: Sparkles,
    features: [
      'Everything in Starter',
      'Advanced analytics & charts',
      'Financial health score',
      'Savings goals tracking',
      'Weekly spending heatmap',
      'Income vs expense trends',
      'Cumulative cash flow view',
      'Avatar & profile customization',
      'Priority support',
    ],
    cta: 'Join the Beta',
    ctaStyle: {
      background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
      color: '#fff',
    },
    popular: true,
  },
];

const Pricing: React.FC = () => {
  return (
    <section
      id="pricing"
      className="relative py-24 px-4 overflow-hidden"
      style={{ backgroundColor: '#0303036e' }}
    >
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(129,81,217,0.15) 0%, transparent 70%)',
            filter: 'blur(80px)',
            top: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{
              backgroundColor: 'rgba(129,81,217,0.1)',
              border: '1px solid rgba(129,81,217,0.3)',
            }}
          >
            <Sparkles size={14} style={{ color: '#8151d9' }} />
            <span className="text-sm font-medium" style={{ color: '#c4a7f5' }}>
              Simple Pricing
            </span>
          </div>

          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
          >
            Free During{' '}
            <span style={{ color: '#8151d9' }}>Beta</span>
          </h2>
          <p
            className="text-lg max-w-xl mx-auto"
            style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}
          >
            We're currently in beta — get full access to everything at no cost.
            No credit card required, no hidden fees.
          </p>
        </motion.div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative rounded-2xl p-8 flex flex-col"
              style={{
                backgroundColor: plan.popular ? 'rgba(16,185,129,0.05)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${plan.borderColor}`,
                boxShadow: plan.popular
                  ? '0 0 40px rgba(16,185,129,0.1), 0 20px 40px rgba(0,0,0,0.3)'
                  : '0 20px 40px rgba(0,0,0,0.2)',
              }}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold"
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #34d399)',
                    color: '#fff',
                    whiteSpace: 'nowrap',
                  }}
                >
                  ✦ Currently Free — Beta Access
                </div>
              )}

              {/* Plan header */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${plan.color}20` }}
                  >
                    <plan.icon size={18} style={{ color: plan.color }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                      {plan.name}
                    </h3>
                    <span
                      className="text-xs font-medium"
                      style={{ color: plan.color }}
                    >
                      {plan.badge}
                    </span>
                  </div>
                </div>

                <p className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  {plan.description}
                </p>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-end gap-2">
                  <span
                    className="text-6xl font-black"
                    style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1 }}
                  >
                    $0
                  </span>
                  <span className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                    / month
                  </span>
                </div>
                <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  {plan.popular ? 'Free while in beta — pricing may change at launch' : 'Always free, no limits'}
                </p>
              </div>

              {/* Features */}
              <ul className="flex flex-col gap-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${plan.color}20` }}
                    >
                      <Check size={11} style={{ color: plan.color }} />
                    </div>
                    <span className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA button */}
              <motion.a
                href="/register"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 rounded-xl text-sm font-semibold text-center transition-all cursor-pointer"
                style={plan.ctaStyle}
              >
                {plan.cta}
              </motion.a>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
            No credit card required · No hidden fees · Cancel anytime
          </p>
          <div className="flex items-center justify-center gap-6 mt-4">
            {['Secure & Private', 'No Ads', 'Always Improving'].map((item) => (
              <div key={item} className="flex items-center gap-1.5">
                <Check size={12} style={{ color: '#8151d9' }} />
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{item}</span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Pricing;