import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, PieChart, Bell, Lock, Smartphone } from 'lucide-react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <Wallet size={28} className="text-accent-primary" />,
    title: 'Smart Expense Tracking',
    description: 'Automatically categorize and track every expense. Set up custom categories that match your lifestyle.',
  },
  {
    icon: <TrendingUp size={28} className="text-accent-primary" />,
    title: 'Budget Management',
    description: 'Create personalized budgets for different categories. Get real-time alerts when you\'re approaching limits.',
  },
  {
    icon: <PieChart size={28} className="text-accent-primary" />,
    title: 'Visual Analytics & Insights',
    description: 'Beautiful charts and reports that help you understand your spending patterns and make smarter decisions.',
  },
  {
    icon: <Bell size={28} className="text-accent-primary" />,
    title: 'Smart Notifications',
    description: 'Stay informed with intelligent alerts about unusual spending, upcoming bills, and budget milestones.',
  },
  {
    icon: <Lock size={28} className="text-accent-primary" />,
    title: 'Bank-Level Security',
    description: 'Your financial data is protected with enterprise-grade encryption and security measures.',
  },
  {
    icon: <Smartphone size={28} className="text-accent-primary" />,
    title: 'Multi-Device Sync',
    description: 'Access your expense data seamlessly across all your devices. Track on-the-go with our app.',
  },
];

const Features: React.FC = () => {
  return (
    <section id="features" className="py-24 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white tracking-tight">
            Everything You Need to <br /> <span className="text-accent-primary">Master Your Money</span>
          </h2>
          <p className="max-w-2xl mx-auto text-muted text-lg">
            Powerful features designed to make expense tracking effortless and financial insights actionable.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-card border border-white/5 rounded-2xl p-8 hover:border-accent-primary/50 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-accent-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
              <p className="text-muted leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;