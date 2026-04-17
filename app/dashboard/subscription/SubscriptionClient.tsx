'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { CreditCard, CheckCircle, XCircle, Loader2, ExternalLink, Zap, Shield, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const plans = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: '£9',
    period: '/month',
    priceNote: null,
    features: ['Monthly prize draw entry', 'Last 5 score tracking', 'Charity contributions (min 10%)', 'Dashboard access'],
  },
  {
    id: 'yearly',
    name: 'Yearly',
    price: '£79',
    period: '/year',
    priceNote: 'Save £29 vs monthly',
    features: ['Everything in Monthly', '2 months free effectively', 'Priority notification', 'Annual charity report'],
    popular: true,
  },
];

interface Props {
  currentStatus?: string;
  currentPlan?: string | null;
  periodEnd?: string | null;
}

export default function SubscriptionClient({ currentStatus, currentPlan, periodEnd }: Props) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (plan: 'monthly' | 'yearly') => {
    setLoading(plan);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      window.location.href = data.url;
    } catch (err: any) {
      toast.error(err.message || 'Could not start checkout');
      setLoading(null);
    }
  };

  const isActive = currentStatus === 'active';

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white">Subscription</h1>
        <p className="text-surface-400 text-sm mt-1">Manage your plan and billing</p>
      </div>

      {/* Current status banner */}
      <div className={cn(
        'glass rounded-2xl p-5 border flex items-center gap-4',
        isActive ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-yellow-500/30 bg-yellow-500/5'
      )}>
        <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0', isActive ? 'bg-emerald-500/20' : 'bg-yellow-500/20')}>
          {isActive ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : <XCircle className="w-5 h-5 text-yellow-400" />}
        </div>
        <div className="flex-1">
          <p className={`font-semibold text-sm ${isActive ? 'text-emerald-400' : 'text-yellow-400'}`}>
            {isActive ? `Active — ${currentPlan === 'yearly' ? 'Yearly' : 'Monthly'} Plan` : 'No active subscription'}
          </p>
          <p className="text-surface-400 text-xs mt-0.5">
            {isActive && periodEnd
              ? `Renews ${new Date(periodEnd).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`
              : 'Subscribe to unlock prize draws and charity contributions'}
          </p>
        </div>
        {isActive && (
          <div className="flex items-center gap-1.5 text-xs text-surface-400">
            <Shield className="w-3.5 h-3.5" />
            Stripe secured
          </div>
        )}
      </div>

      {/* Plans */}
      {!isActive && (
        <div className="grid md:grid-cols-2 gap-5">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                'relative rounded-3xl p-7 border transition-all duration-300',
                plan.popular
                  ? 'border-brand-500/40 bg-gradient-to-b from-brand-600/15 to-transparent shadow-glow'
                  : 'border-white/10 glass hover:border-white/20'
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-brand-500 to-accent-500 text-white">
                    <Zap className="w-3 h-3" /> Best Value
                  </span>
                </div>
              )}

              <div className="mb-6">
                <p className="text-surface-400 text-sm mb-1">{plan.name}</p>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-black text-white">{plan.price}</span>
                  <span className="text-surface-400 text-sm mb-1">{plan.period}</span>
                </div>
                {plan.priceNote && <div className="badge-emerald mt-2 inline-flex">{plan.priceNote}</div>}
              </div>

              <ul className="space-y-2.5 mb-7">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-surface-300">
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.id as 'monthly' | 'yearly')}
                disabled={loading !== null}
                className={cn('w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200', plan.popular ? 'btn-primary' : 'btn-secondary')}
              >
                {loading === plan.id ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    Subscribe — {plan.price}{plan.period}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Active plan management */}
      {isActive && (
        <div className="card-elevated rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white">Manage Billing</h3>
          <p className="text-surface-400 text-sm">
            Use the Stripe billing portal to update payment details, change plan, or cancel your subscription.
          </p>
          <button
            onClick={async () => {
              toast('Redirecting to billing portal...');
              // Stripe billing portal redirect would go here
            }}
            className="btn-secondary text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            Open Billing Portal
          </button>
        </div>
      )}

      {/* Stripe trust note */}
      <p className="text-center text-surface-600 text-xs">
        Payments are processed securely by Stripe. Cancel anytime with no fees.
      </p>
    </div>
  );
}
