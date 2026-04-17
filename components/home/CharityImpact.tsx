'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Heart, TrendingUp, Globe, Shield } from 'lucide-react';

const impactStats = [
  { label: 'Total Donated', value: '£42,180', delta: '+12% this month' },
  { label: 'Charities Supported', value: '6', delta: 'Growing monthly' },
  { label: 'Lives Impacted', value: '1,200+', delta: 'Across 18 countries' },
  { label: 'Avg. Contribution', value: '£14.80', delta: 'Per subscriber/month' },
];

const pillars = [
  {
    icon: Heart,
    title: 'You Choose',
    description: 'Select your charity at signup and change it anytime. Your money goes exactly where you want it.',
  },
  {
    icon: TrendingUp,
    title: 'It Compounds',
    description: 'As the subscriber base grows, so does the total donation. Every new player multiplies the impact.',
  },
  {
    icon: Globe,
    title: 'Global Reach',
    description: 'Our featured charities operate across continents, amplifying impact far beyond the course.',
  },
  {
    icon: Shield,
    title: '100% Transparent',
    description: 'Real-time tracking of outgoing donations. Every pound is accounted for, publicly visible.',
  },
];

export default function CharityImpact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="section relative overflow-hidden bg-surface-950">
      {/* Ambient glows */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: header + pillars */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="badge-accent mb-4">Charity Impact</span>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-5">
              Every Score is a{' '}
              <span className="gradient-text">Donation</span>
            </h2>
            <p className="text-surface-400 text-lg leading-relaxed mb-10">
              A minimum of 10% of every subscription fee goes directly to your chosen charity. No middlemen. No delay. Just impact.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {pillars.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex flex-col gap-2 p-4 rounded-xl glass border border-white/10 hover:border-white/20 transition-all duration-200"
                >
                  <div className="w-8 h-8 rounded-lg bg-accent-500/15 flex items-center justify-center">
                    <p.icon className="w-4 h-4 text-accent-400" />
                  </div>
                  <h4 className="text-sm font-semibold text-white">{p.title}</h4>
                  <p className="text-surface-400 text-xs leading-relaxed">{p.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: live impact card */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <div className="glass-strong rounded-3xl p-8 border border-white/10">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-bold text-white">Live Impact Dashboard</h3>
                <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Real-time
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {impactStats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                    className="bg-white/5 rounded-2xl p-5 border border-white/10"
                  >
                    <div className="text-2xl font-black text-white mb-1">{stat.value}</div>
                    <div className="text-surface-500 text-xs mb-2">{stat.label}</div>
                    <div className="text-emerald-400 text-xs font-medium">{stat.delta}</div>
                  </motion.div>
                ))}
              </div>

              {/* Progress bar */}
              <div className="mt-8">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-surface-400">Monthly charity goal</span>
                  <span className="text-white font-semibold">£5,000 / £6,000</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={inView ? { width: '83%' } : {}}
                    transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-accent-500 to-brand-500"
                  />
                </div>
                <p className="text-surface-500 text-xs mt-2">83% of monthly charity goal reached</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
