'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Play, RotateCcw, CheckCircle2, Trophy, Users, Zap,
  Loader2, Shuffle, TrendingUp, TrendingDown, AlertCircle,
  Eye
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';

type DrawLogic = 'random' | 'most_frequent' | 'least_frequent';

interface DrawResult {
  winningNumbers: number[];
  winners: { userId: string; tier: number; matchedNumbers: number[]; prize: number }[];
  totalPool: number;
  jackpotRollover: number;
  draw: { jackpot_amount: number; tier_two_amount: number; tier_three_amount: number };
}

export default function AdminDrawPage() {
  const [logic, setLogic] = useState<DrawLogic>('random');
  const [simulating, setSimulating] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [result, setResult] = useState<DrawResult | null>(null);

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  const runDraw = async (publish: boolean) => {
    if (publish) setPublishing(true);
    else setSimulating(true);

    try {
      const res = await fetch('/api/admin/draw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logic, month, year, publish }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setResult(data);
      toast.success(publish ? 'Draw published! Winners notified.' : 'Simulation complete. Review before publishing.');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSimulating(false);
      setPublishing(false);
    }
  };

  const logicOptions = [
    { id: 'random', label: 'Random Draw', desc: '5 truly random numbers (1-45)', icon: Shuffle },
    { id: 'most_frequent', label: 'Most Frequent', desc: 'Based on the most commonly scored numbers', icon: TrendingUp },
    { id: 'least_frequent', label: 'Least Frequent', desc: 'Based on the rarest scored numbers', icon: TrendingDown },
  ] as const;

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white">Draw Manager</h1>
        <p className="text-surface-400 text-sm mt-1">
          Run and publish the monthly draw for{' '}
          <span className="text-white font-semibold">{monthNames[month - 1]} {year}</span>
        </p>
      </div>

      {/* Logic selector */}
      <div className="card-elevated rounded-2xl p-6">
        <h3 className="text-base font-bold text-white mb-4">Select Draw Logic</h3>
        <div className="grid grid-cols-3 gap-3">
          {logicOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setLogic(opt.id)}
              className={cn(
                'p-4 rounded-xl border text-left transition-all duration-200 hover:-translate-y-0.5',
                logic === opt.id
                  ? 'border-brand-500/60 bg-brand-500/15'
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              )}
            >
              <opt.icon className={cn('w-5 h-5 mb-2', logic === opt.id ? 'text-brand-400' : 'text-surface-500')} />
              <div className="text-sm font-semibold text-white">{opt.label}</div>
              <div className="text-xs text-surface-500 mt-0.5">{opt.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => runDraw(false)}
          disabled={simulating || publishing}
          className="btn-secondary py-4 text-sm gap-3"
        >
          {simulating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Eye className="w-5 h-5" />}
          Simulate Draw
        </button>
        <button
          onClick={() => runDraw(true)}
          disabled={simulating || publishing}
          className="btn-primary py-4 text-sm gap-3"
        >
          {publishing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
          Publish Official Draw
        </button>
      </div>

      {/* Warning */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-500/8 border border-yellow-500/25">
        <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
        <p className="text-yellow-300/80 text-xs leading-relaxed">
          <strong>Simulation</strong> is for preview only — no data is changed, no winners are notified.
          <strong> Publish</strong> finalises the draw, creates winner records, and sends notifications.
          Publishing a draw for a month that already has results will overwrite them.
        </p>
      </div>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-5"
          >
            <div className="card-elevated rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  Draw Results — {monthNames[month - 1]} {year}
                </h3>
                {result && (
                  <span className="badge-emerald text-xs">
                    {result.winners.length} winner{result.winners.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              <p className="text-surface-500 text-xs mb-3">Winning numbers:</p>
              <div className="flex gap-3 mb-6">
                {result.winningNumbers.map((n) => (
                  <motion.div
                    key={n}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-black text-lg shadow-glow"
                  >
                    {n}
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 rounded-xl bg-yellow-500/8 border border-yellow-500/20">
                  <div className="text-lg font-bold text-yellow-400">£{result.draw.jackpot_amount.toFixed(0)}</div>
                  <div className="text-xs text-surface-500">Jackpot pool</div>
                  {result.jackpotRollover > 0 && <div className="text-xs text-yellow-600 mt-0.5">→ Rolls over</div>}
                </div>
                <div className="text-center p-3 rounded-xl bg-brand-500/8 border border-brand-500/20">
                  <div className="text-lg font-bold text-brand-400">£{result.draw.tier_two_amount.toFixed(0)}</div>
                  <div className="text-xs text-surface-500">Tier 2 pool</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-accent-500/8 border border-accent-500/20">
                  <div className="text-lg font-bold text-accent-400">£{result.draw.tier_three_amount.toFixed(0)}</div>
                  <div className="text-xs text-surface-500">Tier 3 pool</div>
                </div>
              </div>
            </div>

            {/* Winners list */}
            {result.winners.length > 0 && (
              <div className="card-elevated rounded-2xl p-6">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4 text-brand-400" />
                  Winners ({result.winners.length})
                </h3>
                <div className="space-y-2.5">
                  {result.winners.map((winner, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/10"
                    >
                      <div>
                        <div className="text-xs text-surface-300 font-medium mb-1">User: {winner.userId.slice(0, 8)}...</div>
                        <div className="flex gap-1.5">
                          {winner.matchedNumbers.map((n) => (
                            <span key={n} className="w-6 h-6 rounded-lg bg-brand-500/30 border border-brand-500/40 flex items-center justify-center text-xs font-bold text-brand-300">{n}</span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-base font-black text-white">£{winner.prize.toFixed(2)}</div>
                        <div className="text-xs text-surface-500">Tier {winner.tier}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
