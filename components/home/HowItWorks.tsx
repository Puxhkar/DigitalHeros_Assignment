'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { UserPlus, BarChart2, Gift, ArrowRight } from 'lucide-react';

const steps = [
  {
    step: '01',
    icon: UserPlus,
    title: 'Subscribe & Choose Your Cause',
    description:
      'Pick a monthly or yearly plan, select the charity closest to your heart, and choose how much of your subscription goes toward it (minimum 10%).',
    color: 'brand',
    gradient: 'from-brand-500 to-brand-600',
  },
  {
    step: '02',
    icon: BarChart2,
    title: 'Enter Your Last 5 Scores',
    description:
      'Log your most recent Stableford scores from the dashboard. One score per day, and the system automatically keeps only your last 5 — always fresh.',
    color: 'accent',
    gradient: 'from-accent-500 to-accent-600',
  },
  {
    step: '03',
    icon: Gift,
    title: 'Win & Watch Your Impact Grow',
    description:
      'Every month, 5 numbers are drawn. Match 3, 4, or all 5 to win prize tiers. Your subscription fee fuels the jackpot pool and your chosen charity.',
    color: 'emerald',
    gradient: 'from-emerald-400 to-emerald-500',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="how-it-works" className="section relative overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-20" />

      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="badge mb-4">Simple Process</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
            From Subscriber to{' '}
            <span className="gradient-text">Winner</span>
          </h2>
          <p className="text-surface-400 text-lg max-w-xl mx-auto">
            Three steps between you and your share of the monthly prize pool.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-3 gap-6 lg:gap-8"
        >
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              variants={itemVariants}
              className="relative group"
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[calc(100%+0px)] w-full h-px bg-gradient-to-r from-white/20 to-transparent z-10" />
              )}

              <div className="card h-full flex flex-col gap-5 group-hover:-translate-y-1 group-hover:border-white/20 transition-all duration-300">
                {/* Step number */}
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-glow flex-shrink-0`}>
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-5xl font-black text-white/5 leading-none">{step.step}</span>
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 leading-snug">{step.title}</h3>
                  <p className="text-surface-400 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-14"
        >
          <a href="/register" className="btn-primary text-base px-8 py-4 shadow-glow">
            Start Your Journey
            <ArrowRight className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
