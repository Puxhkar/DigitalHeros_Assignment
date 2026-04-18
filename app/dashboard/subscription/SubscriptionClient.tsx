'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { CreditCard, CheckCircle, XCircle, Loader2, ExternalLink, Zap, Shield, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SciFiPanel } from '@/components/ui/SciFiPanel';

const plans = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: '$9',
    period: '/month',
    priceNote: null,
    features: [
      'Monthly prize draw entry',
      'Last 5 score tracking',
      'Charity contributions (min 10%)',
      'Dashboard access',
      'AI Golf Score Analysis',
      'Exclusive BirdiePay Golf Towel'
    ],
  },
  {
    id: 'yearly',
    name: 'Yearly',
    price: '$79',
    period: '/year',
    priceNote: 'Save $29 vs monthly',
    features: [
      'Everything in Monthly',
      '2 months free effectively',
      'Priority notification',
      'Annual charity report',
      'BirdiePay Premium Polo Shirt',
      'Virtual meetups with PGA Pros',
      '2x Charity Multiplier'
    ],
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
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Page header */}
      <div>
        <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-surface-500 mb-1">BirdiePay // Account</p>
        <h1 className="text-2xl font-mono font-black text-white uppercase tracking-tight">
          <span style={{ color: '#00e0ff', textShadow: '0 0 16px rgba(0,224,255,0.5)' }}>Subscription</span> Plans
        </h1>
        <p className="text-surface-500 text-xs mt-1 font-mono">Manage your plan and billing</p>
      </div>

      {/* Current status banner */}
      <div
        className="flex items-center gap-4 p-4"
        style={{
          background: isActive ? 'rgba(0,255,170,0.05)' : 'rgba(255,190,26,0.05)',
          border: `1px solid ${isActive ? 'rgba(0,255,170,0.25)' : 'rgba(255,190,26,0.25)'}`,
          clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
        }}
      >
        <div
          className="w-10 h-10 flex items-center justify-center flex-shrink-0"
          style={{
            background: isActive ? 'rgba(0,255,170,0.1)' : 'rgba(255,190,26,0.1)',
            clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)',
          }}
        >
          {isActive
            ? <CheckCircle className="w-5 h-5 text-emerald-400" style={{ filter: 'drop-shadow(0 0 4px rgba(0,255,170,0.7))' }} />
            : <XCircle className="w-5 h-5 text-accent-400" style={{ filter: 'drop-shadow(0 0 4px rgba(255,190,26,0.7))' }} />
          }
        </div>
        <div className="flex-1">
          <p className="font-mono font-bold text-xs uppercase tracking-widest" style={{ color: isActive ? '#00ffaa' : '#ffbe1a' }}>
            {isActive ? `Active — ${currentPlan === 'yearly' ? 'Yearly' : 'Monthly'} Plan` : 'No Active Subscription'}
          </p>
          <p className="text-surface-500 text-xs mt-0.5 font-mono">
            {isActive && periodEnd
              ? `Renews ${new Date(periodEnd).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`
              : 'Choose a plan below to unlock prize draws and charitable giving'}
          </p>
        </div>
        {isActive && (
          <div className="flex items-center gap-1.5 text-[10px] text-surface-500 font-mono uppercase tracking-widest">
            <Shield className="w-3 h-3" />
            Secured
          </div>
        )}
      </div>

      {/* Plans Section - Always Visible */}
      <div className="space-y-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-surface-500">
          {isActive ? 'Available Plans' : 'Select a Plan'}
        </p>
        <div className="grid md:grid-cols-2 gap-5 z-10 relative">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="h-full flex flex-col"
            >
              <SciFiPanel className="h-full flex-1">
                <div className="flex flex-col h-full">
                  {plan.popular && (
                    <div className="absolute top-0 right-0">
                      <div className="bg-brand-500 text-black text-[10px] font-black tracking-widest uppercase px-4 py-1.5" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% 100%, 0 100%)' }}>
                        <span className="flex items-center gap-1">
                          <Zap className="w-3 h-3" /> Best Value
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="mb-6">
                    <p className="text-surface-400 text-xs font-bold uppercase tracking-widest mb-2">{plan.name}</p>
                    <div className="flex items-end gap-1">
                      <span className="text-4xl font-mono font-black text-white drop-shadow-[0_0_8px_rgba(0,224,255,0.5)]">{plan.price}</span>
                      <span className="text-surface-400 text-xs mb-1 font-mono uppercase tracking-widest">{plan.period}</span>
                    </div>
                    {plan.priceNote && <div className="text-emerald-400 text-[10px] uppercase font-bold tracking-widest mt-2">{plan.priceNote}</div>}
                  </div>

                  <ul className="space-y-3 mb-7 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-surface-300">
                        <div className="w-4 h-4 rounded-sm bg-brand-500/20 border border-brand-500/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle className="w-3 h-3 text-brand-400" />
                        </div>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSubscribe(plan.id as 'monthly' | 'yearly')}
                    disabled={loading !== null || (isActive && currentPlan === plan.id)}
                    className={cn(
                      'w-full flex items-center justify-center gap-2 py-4 font-semibold text-xs tracking-widest uppercase transition-all duration-200 mt-auto',
                      plan.popular
                        ? 'bg-brand-500 text-black hover:bg-brand-400'
                        : 'bg-surface-800 text-white hover:bg-surface-700 border border-white/5',
                      isActive && currentPlan === plan.id && "opacity-50 cursor-not-allowed"
                    )}
                    style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
                  >
                    {loading === plan.id ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        {isActive && currentPlan === plan.id ? 'Current Plan' : 'Subscribe'}
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </SciFiPanel>
            </motion.div>
          ))}
        </div>
      </div>

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
