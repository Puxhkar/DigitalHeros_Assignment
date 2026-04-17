'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Trophy, Heart, Sparkles, TrendingUp, Users, Star } from 'lucide-react';

const floatingCards = [
  { icon: Trophy, label: 'Jackpot Won', value: '£4,200', color: 'from-brand-500 to-brand-600', delay: 0 },
  { icon: Heart, label: 'Charity Raised', value: '£18,500', color: 'from-accent-500 to-accent-600', delay: 0.2 },
  { icon: Users, label: 'Active Players', value: '2,847', color: 'from-emerald-400 to-emerald-500', delay: 0.4 },
];

const stats = [
  { value: '£126K', label: 'Total prizes distributed', icon: Trophy },
  { value: '£42K', label: 'Raised for charities', icon: Heart },
  { value: '2,847', label: 'Active subscribers', icon: Users },
  { value: '98%', label: 'Player satisfaction', icon: Star },
];

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden animated-bg">
      {/* Background Effects */}
      <div className="absolute inset-0 grid-pattern opacity-40" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-600/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-900/30 rounded-full blur-3xl" />

      <motion.div style={{ y, opacity }} className="relative z-10 container-custom text-center pt-28 pb-16">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 mb-8"
        >
          <span className="badge">
            <Sparkles className="w-3 h-3" />
            Monthly Draw Every 1st — Next draw in 14 days
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tight mb-6"
        >
          <span className="block text-white">Play Your Game.</span>
          <span className="block gradient-text mt-2">Win Big.</span>
          <span className="block text-white mt-2">Give Back.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="text-surface-300 text-lg sm:text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto mb-10"
        >
          Enter your last 5 Stableford scores, join the monthly prize draw, and contribute to a charity you love — all in one premium platform.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/register" className="btn-primary text-base px-8 py-4 shadow-glow-lg">
            Subscribe & Play
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/#how-it-works" className="btn-secondary text-base px-8 py-4">
            <TrendingUp className="w-5 h-5" />
            See How It Works
          </Link>
        </motion.div>

        {/* Floating stat cards */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
          {floatingCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 + card.delay }}
              className="glass-strong rounded-2xl p-5 border border-white/10 text-left group hover:border-white/20 hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-3 shadow-glow`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold text-white">{card.value}</div>
              <div className="text-surface-400 text-xs mt-0.5">{card.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="mt-16 pt-16 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-black gradient-text-brand mb-1">{stat.value}</div>
              <div className="text-surface-500 text-xs">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-surface-950 to-transparent" />
    </section>
  );
}
