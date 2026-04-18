'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Check, ArrowRight, Sparkles, Zap, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SciFiPanel } from '@/components/ui/SciFiPanel';

const plans = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: '$9',
    period: '/month',
    description: 'Perfect for trying things out.',
    cta: 'Start Monthly',
    popular: false,
    highlight: false,
    accentColor: 'rgba(0, 224, 255, 0.6)',
    features: [
      'Enter last 5 Stableford scores',
      'Monthly prize draw entry',
      'Charity contribution (min 10%)',
      'Real-time win notifications',
      'Score history & analytics',
      'Community leaderboard',
      'AI Golf Score Analysis',
      'Exclusive BirdiePay Golf Towel'
    ]
  },
  {
    id: 'yearly',
    name: 'Yearly',
    price: '$79',
    period: '/year',
    badge: 'Most Popular',
    description: 'Best value — save 3 months free.',
    cta: 'Start Yearly',
    popular: true,
    highlight: true,
    accentColor: 'rgba(255, 190, 26, 0.8)',
    features: [
      'Everything in Monthly',
      '2 months free effectively',
      'Priority draw entry',
      '+5% bonus charity contribution',
      'Dedicated support',
      'BirdiePay Premium Polo Shirt',
      'Virtual meetups with PGA Pros',
      '2x Charity Multiplier'
    ]
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="section relative overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-10" />

      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-[10px] font-mono uppercase tracking-widest text-brand-400 border border-brand-500/25 bg-brand-500/10">
            <Zap className="w-3 h-3" /> Simple Pricing
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-3">
            One Price.{' '}
            <span style={{ color: '#00e0ff', textShadow: '0 0 20px rgba(0,224,255,0.4)' }}>
              Endless Opportunity.
            </span>
          </h2>
          <p className="text-surface-400 max-w-lg mx-auto text-base">
            No hidden fees. No complicated tiers. Your subscription funds the prize pool and your charity.
          </p>
        </motion.div>

        {/* Plans */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-8">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="h-full flex flex-col relative"
            >
              {/* Glow */}
              {plan.highlight && (
                <div
                  className="absolute inset-0 -z-10 blur-2xl opacity-20"
                  style={{ background: plan.accentColor }}
                />
              )}

              <SciFiPanel className="h-full flex-1">
                <div className="flex flex-col h-full">
                  {plan.badge && (
                    <div className="absolute top-0 right-0 z-20">
                      <div
                        className="text-black text-[10px] font-black tracking-widest uppercase px-4 py-1.5 flex items-center gap-1"
                        style={{ background: plan.accentColor, clipPath: 'polygon(10px 0, 100% 0, 100% 100%, 0 100%)' }}
                      >
                        <Sparkles className="w-3 h-3" />
                        {plan.badge}
                      </div>
                    </div>
                  )}

                  {/* Plan header */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Zap className="w-4 h-4" style={{ color: plan.accentColor }} />
                      <span className="text-surface-400 text-xs font-mono uppercase tracking-widest">{plan.name}</span>
                    </div>
                    <div className="flex items-end gap-2 mb-2">
                      <span
                        className="text-6xl font-mono font-black leading-none"
                        style={{
                          color: plan.accentColor,
                          textShadow: `0 0 20px ${plan.accentColor}`,
                        }}
                      >
                        {plan.price}
                      </span>
                      <span className="text-surface-500 text-sm font-mono uppercase tracking-widest mb-2">{plan.period}</span>
                    </div>
                    <p className="text-surface-500 text-xs font-mono">{plan.description}</p>

                    {plan.id === 'yearly' && (
                      <div
                        className="inline-flex items-center gap-1 mt-3 px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-widest"
                        style={{
                          color: plan.accentColor,
                          background: `${plan.accentColor}15`,
                          border: `1px solid ${plan.accentColor}30`,
                        }}
                      >
                        Save $29 vs monthly
                      </div>
                    )}
                  </div>

                  {/* Divider */}
                  <div
                    className="w-full h-px mb-6"
                    style={{ background: `linear-gradient(90deg, ${plan.accentColor}40, transparent)` }}
                  />

                  {/* Features */}
                  <div className="flex-1">
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-3 text-sm text-surface-300">
                          <div
                            className="w-4 h-4 mt-0.5 flex items-center justify-center flex-shrink-0"
                            style={{
                              background: `${plan.accentColor}15`,
                              border: `1px solid ${plan.accentColor}40`,
                            }}
                          >
                            <Check className="w-2.5 h-2.5" style={{ color: plan.accentColor }} />
                          </div>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href="/register"
                    className="w-full flex items-center justify-center gap-2 py-4 font-mono font-bold text-xs tracking-widest uppercase transition-all duration-200 mt-auto"
                    style={{
                      background: plan.highlight ? plan.accentColor : 'rgba(255,255,255,0.05)',
                      color: plan.highlight ? '#000' : '#fff',
                      clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
                      boxShadow: plan.highlight ? `0 0 20px ${plan.accentColor}50` : 'none',
                    }}
                  >
                    {plan.cta}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </SciFiPanel>
            </motion.div>
          ))}
        </div>

        {/* Trust note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-2 text-surface-600 text-xs font-mono"
        >
          <Shield className="w-3.5 h-3.5" />
          Cancel anytime. No lock-in. Payments secured by Stripe.
        </motion.div>
      </div>
    </section>
  );
}
