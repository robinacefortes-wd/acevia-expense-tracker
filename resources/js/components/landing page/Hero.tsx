import { motion, Variants } from 'framer-motion'; // Added Variants type for TypeScript
import { ArrowRight } from 'lucide-react';
import React from 'react';

const Hero: React.FC = () => {
  // --- 1. DEFINE VARIANTS (With Types) ---
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.45, // satisfying delay
        delayChildren: 0.3,   // small initial pause
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -30 }, // Slides in from left
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

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

      {/* GRADIENT OVERLAY */}
      <div 
        className="absolute inset-0 z-1 pointer-events-none"
        style={{
          background: 'linear-gradient(to right, rgba(10,10,10,0.8) 0%, rgba(10,10,10,0.2) 60%, transparent 100%)',
        }}
      />

      <div
        className="relative z-10 flex items-center justify-start"
        style={{ 
          minHeight: '100vh', 
          paddingLeft: 'clamp(2rem, 10vw, 16rem)', 
          paddingRight: '2rem' 
        }}
      >
        {/* --- 2. UPDATE THE MAIN CONTAINER --- */}
        <motion.div
          className="w-full lg:w-[65%] flex flex-col"
          variants={containerVariants} // This connects the staggering logic
          initial="hidden"             // Sets the start state
          animate="visible"            // Triggers the children to follow
        >
          {/* --- 3. APPLY ITEM VARIANTS (Fixed Errors) --- */}

          {/* LINE 1: Track Expenses */}
          <motion.h1
            variants={itemVariants}
            className="font-bold" // Removed extra mb
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              lineHeight: '1.1',
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
            }}
          >
            Track Expenses,
          </motion.h1>

          {/* LINE 2: Build Better Habits */}
          <motion.div 
            variants={itemVariants} 
            className="mb-12" // This ensures the spacing you wanted!
          >
             <span 
              style={{ 
                color: 'var(--accent-primary)',
                fontFamily: '"Dancing Script", "Pacifico", cursive',
                fontWeight: '400',
                display: 'inline-block',
                marginTop: '10px',
                fontStyle: 'italic',
                transform: 'skewX(-15deg) rotate(-1deg)',
                fontSize: 'clamp(2.5rem, 5.5vw, 5rem)',
                lineHeight: '1.2'
              }}
            >
              Build Better Habits
            </span>
          </motion.div>

          {/* LINE 3: Subtext */}
          <motion.p
            variants={itemVariants}
            className="mb-10"
            style={{
              fontSize: 'clamp(1.1rem, 2.5vw, 1.25rem)',
              lineHeight: '1.6',
              color: 'var(--text-secondary)',
              maxWidth: '520px',
              opacity: 0.9 
            }}
          >
            The simplest way to monitor your spending, manage budgets, and gain
            insights into your financial health. All in one beautiful app.
          </motion.p>

          {/* LINE 4: Button */}
          <motion.div variants={itemVariants} className="flex">
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