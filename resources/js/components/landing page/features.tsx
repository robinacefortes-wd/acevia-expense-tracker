import React from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  TrendingUp, 
  PieChart, 
  Bell, 
  Lock, 
  Smartphone 
} from 'lucide-react';

interface Feature {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  accent: string;
}

const features: Feature[] = [
  {
    id: "01",
    icon: <Wallet size={32} />,
    title: "Smart Expense Tracking",
    description: "Automatically categorize and track every expense. Set up custom categories that match your lifestyle.",
    accent: "text-[#8151d9]",
    className: "lg:col-span-4", 
  },
  {
    id: "02",
    icon: <TrendingUp size={32} />,
    title: "Budget Management",
    description: "Create personalized budgets for different categories.",
    accent: "text-[#8151d9]",
    className: "lg:col-span-2", 
  },
  {
    id: "03",
    icon: <PieChart size={28} />,
    title: "Visual Analytics",
    description: "Understand your spending patterns easily.",
    accent: "text-[#8151d9]",
    className: "lg:col-span-2",
  },
  {
    id: "04",
    icon: <Bell size={28} />,
    title: "Smart Notifications",
    description: "Stay informed with intelligent alerts about unusual spending, upcoming bills, and budget milestones.",
    accent: "text-[#8151d9]",
    className: "lg:col-span-4",
  },
  {
    id: "05",
    icon: <Lock size={28} />,
    title: "Bank-Level Security",
    description: "Your financial data is protected with enterprise-grade encryption and security measures.",
    accent: "text-[#8151d9]",
    className: "lg:col-span-4",
  },
  {
    id: "06",
    icon: <Smartphone size={28} />,
    title: "Multi-Device Sync",
    description: "Access your expense data seamlessly across all your devices.",
    accent: "text-[#8151d9]",
    className: "lg:col-span-2",
  },
];

const Features: React.FC = () => {
  return (
    <section 
      id="features" 
      className="relative pt-32 pb-10 px-4 overflow-hidden"
      style={{ backgroundColor: '#0303036e' }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[800px] h-[800px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(129,81,217,0.08) 0%, transparent 70%)',
            filter: 'blur(120px)',
            top: '10%',
            right: '-5%',
          }}
        />
      </div>

      <div className="max-w-[1640px] mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row-reverse gap-14 lg:items-start">
          
          {/* HEADER SECTION */}
          <div className="lg:w-[45%] lg:sticky lg:top-32 text-right flex flex-col items-end">
            <motion.h2 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-6xl md:text-7xl lg:text-8xl font-bold mb-10 text-white tracking-tighter leading-[0.95]"
              style={{ letterSpacing: '-0.04em' }}
            >
              Stay Ahead <br /> 
              <span style={{ color: '#8151d9' }}>Financially</span>
            </motion.h2>
            
            {/* Unified Font Sizes for Paragraphs */}
            <motion.p 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl leading-relaxed opacity-60 font-light mb-8 max-w-[95%]"
              style={{ color: 'rgba(255,255,255,1)' }}
            >
              Powerful features designed to make expense tracking effortless and financial insights actionable, giving you a comprehensive bird's-eye view of your financial health across every category.
            </motion.p>

            <motion.p 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl leading-relaxed opacity-60 font-light max-w-[95%]"
              style={{ color: 'rgba(255,255,255,1)' }}
            >
              Stop wondering where your money goes. Join thousands of users who have transitioned from financial uncertainty to total clarity with our bank-grade encrypted ecosystem.
            </motion.p>
          </div>

          {/* BENTO GRID */}
          <div className="lg:w-[55%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.4, 
                  delay: index * 0.05,
                  type: "tween", 
                  ease: "easeOut" 
                }}
                whileHover={{ y: -6 }}
                className={`group relative overflow-hidden rounded-3xl p-10 border border-white/5 transition-all duration-200 cursor-pointer ${feature.className}`}
                style={{ 
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                }}
              >
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                  style={{ 
                    background: 'linear-gradient(145deg, rgba(129, 81, 217, 0.12) 0%, rgba(10, 10, 10, 1) 100%)' 
                  }} 
                />

                <span className="absolute -bottom-8 -right-4 text-[160px] font-extrabold tracking-tight
                               text-neutral-800/15 group-hover:text-[#8151d9]/10 transition-colors duration-200 select-none">
                  {feature.id}
                </span>

                <div className={`${feature.accent} relative z-10 mb-8 transition-transform duration-200 group-hover:scale-110`}>
                  {feature.icon}
                </div>

                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-3 text-white">
                    {feature.title}
                  </h3>
                  <p className="leading-relaxed text-sm opacity-60 font-light" style={{ color: 'rgba(255,255,255,1)' }}>
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default Features;