'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Check, ArrowRight, Sparkles, Zap } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const features = {
  common: [
    'Enter last 5 Stableford scores',
    'Monthly prize draw entry',
    'Charity contribution (min 10%)',
    'Real-time win notifications',
    'Score history & analytics',
    'Community leaderboard',
  ],
  pro: [
    'AI score insights',
    'Priority draw entry',
    'Early results notification',
    '+5% bonus charity contribution',
    'Dedicated support',
  ],
};

const plans = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: '£9',
    period: '/month',
    description: 'Perfect for trying things out.',
    cta: 'Start Monthly',
    popular: false,
    highlight: false,
  },
  {
    id: 'yearly',
    name: 'Yearly',
    price: '£79',
    period: '/year',
    badge: 'Most Popular',
    description: 'Best value — save 3 months free.',
    cta: 'Start Yearly',
    popular: true,
    highlight: true,
  },
];

export default function Pricing() {
  const [billing] = useState<'monthly' | 'yearly'>('yearly');

  return (
    <section id="pricing" className="section relative overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-20" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-brand-600/10 rounded-full blur-3xl" />

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="badge mb-4">Simple Pricing</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            One Price. Endless{' '}
            <span className="gradient-text">Opportunity.</span>
          </h2>
          <p className="text-surface-400 max-w-lg mx-auto text-lg">
            No hidden fees. No complicated tiers. Your subscription funds the prize pool and your charity.
          </p>
        </motion.div>

        {/* Plans */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-10">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={cn(
                'relative rounded-3xl p-8 border transition-all duration-300',
                plan.highlight
                  ? 'bg-gradient-to-b from-brand-600/20 to-brand-900/10 border-brand-500/40 shadow-glow'
                  : 'glass border-white/10 hover:border-white/20'
              )}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-brand-500 to-accent-500 text-white shadow-glow">
                    <Sparkles className="w-3 h-3" />
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Plan header */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-brand-400" />
                  <span className="text-surface-400 text-sm font-medium">{plan.name}</span>
                </div>
                <div className="flex items-end gap-1">
                  <span className="text-5xl font-black text-white">{plan.price}</span>
                  <span className="text-surface-400 text-sm mb-2">{plan.period}</span>
                </div>
                {plan.id === 'yearly' && (
                  <div className="badge-emerald mt-2 inline-flex">Save £29 vs monthly</div>
                )}
                <p className="text-surface-400 text-sm mt-3">{plan.description}</p>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {features.common.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-surface-300">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/register"
                className={cn(
                  'w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200',
                  plan.highlight
                    ? 'btn-primary'
                    : 'btn-secondary'
                )}
              >
                {plan.cta}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Trust note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-surface-500 text-sm"
        >
          Cancel anytime. No lock-in. Payments secured by Stripe.
        </motion.p>
      </div>
    </section>
  );
}
