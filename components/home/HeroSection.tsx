'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Trophy, Heart, Sparkles, TrendingUp, Users, Star } from 'lucide-react';
import { MovingBorderButton } from '@/components/ui/MovingBorderButton';
import { SciFiPanel } from '@/components/ui/SciFiPanel';
import { ScoreBoardDisplay } from '@/components/ui/ScoreBoardDisplay';

const floatingCards = [
  { icon: Trophy, label: 'Jackpot Won', value: '$4,200', color: 'from-brand-500 to-brand-600', delay: 0 },
  { icon: Heart, label: 'Charity Raised', value: '$18,500', color: 'from-accent-500 to-accent-600', delay: 0.2 },
  { icon: Users, label: 'Active Players', value: '2,847', color: 'from-emerald-400 to-emerald-500', delay: 0.4 },
];

const stats = [
  { value: '$126K', label: 'Total prizes distributed', icon: Trophy },
  { value: '$42K', label: 'Raised for charities', icon: Heart },
  { value: '2,847', label: 'Active subscribers', icon: Users },
  { value: '98%', label: 'Player satisfaction', icon: Star },
];

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[100svh] w-full flex flex-col items-center justify-center overflow-hidden bg-bg-base">
      {/* Background Effects */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-screen" 
        style={{ backgroundImage: "url('/hero-bg.png')" }} 
      />
      <div className="cyber-floor opacity-60 mix-blend-screen z-0" />
      <div className="absolute inset-0 hex-pattern opacity-30 mix-blend-overlay z-0" />
      
      {/* Blue / Navy Gradient Cast */}
      <div className="absolute pointer-events-none z-0 inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--bg-base)_100%)]" />

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
          className="flex flex-col sm:flex-row items-center justify-center gap-5"
        >
          <a
            href="/register"
            className="group relative inline-flex items-center gap-2.5 px-8 h-14 text-base font-mono font-black uppercase tracking-widest text-black transition-all duration-200 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #00e0ff 0%, #00b8d9 100%)',
              clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)',
              boxShadow: '0 0 24px rgba(0,224,255,0.5), 0 4px 16px rgba(0,0,0,0.4)',
            }}
          >
            Subscribe &amp; Play Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </a>
          <a
            href="/#how-it-works"
            className="group inline-flex items-center gap-2.5 px-8 h-14 text-base font-mono uppercase tracking-widest text-surface-300 hover:text-brand-400 transition-colors duration-200"
            style={{
              border: '1px solid rgba(0,224,255,0.2)',
              clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)',
            }}
          >
            <TrendingUp className="w-5 h-5" />
            See How It Works
          </a>
        </motion.div>

        {/* Floating stat cards */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {floatingCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 + card.delay }}
              className="group"
            >
              <SciFiPanel className="h-full">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className={`w-12 h-12 flex items-center justify-center mb-4 ${card.color.includes('brand') ? 'text-brand-400' : card.color.includes('accent') ? 'text-accent-400' : 'text-emerald-400'}`}>
                    <card.icon className="w-8 h-8 drop-shadow-[0_0_8px_currentColor]" />
                  </div>
                  <ScoreBoardDisplay value={card.value} label={card.label} />
                </div>
              </SciFiPanel>
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
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-bg-base to-transparent pointer-events-none z-10" />
    </section>
  );
}
