'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Trophy, CheckCircle, XCircle, Clock, Loader2, DollarSign } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatDate, formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function AdminWinnersPage() {
  const supabase = createClient();
  const [winners, setWinners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  const fetchWinners = async () => {
    const { data } = await supabase
      .from('winners')
      .select('*, profiles(full_name, email), draws(month, year)')
      .order('created_at', { ascending: false });
    setWinners(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchWinners(); }, []);

  const updatePayout = async (id: string, status: 'approved' | 'paid' | 'rejected') => {
    setProcessing(id);
    const { error } = await supabase
      .from('winners')
      .update({ payout_status: status, paid_at: status === 'paid' ? new Date().toISOString() : null })
      .eq('id', id);

    if (error) toast.error(error.message);
    else {
      toast.success(`Payout ${status}!`);
      fetchWinners();
    }
    setProcessing(null);
  };

  const statusConfig: Record<string, { label: string; color: string }> = {
    pending: { label: 'Pending', color: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/25' },
    approved: { label: 'Approved', color: 'bg-brand-500/15 text-brand-400 border-brand-500/25' },
    paid: { label: 'Paid ✓', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25' },
    rejected: { label: 'Rejected', color: 'bg-red-500/15 text-red-400 border-red-500/25' },
  };

  const tierLabel = (t: number) => t === 5 ? '🏆 Jackpot' : t === 4 ? '🥈 Tier 2' : '🥉 Tier 3';

  const pending = winners.filter((w) => w.payout_status === 'pending').length;

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Winners & Payouts</h1>
          <p className="text-surface-400 text-sm mt-1">{winners.length} total winners recorded</p>
        </div>
        {pending > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/25">
            <Clock className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 text-sm font-semibold">{pending} pending</span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map((i) => <div key={i} className="skeleton h-20 rounded-2xl" />)}
        </div>
      ) : winners.length === 0 ? (
        <div className="text-center py-16 card rounded-2xl">
          <Trophy className="w-12 h-12 text-surface-700 mx-auto mb-3" />
          <p className="text-surface-400">No winners yet — run a draw to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {winners.map((w) => (
            <div key={w.id} className="card-elevated rounded-2xl p-5 flex flex-wrap items-center gap-4">
              {/* User info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-white font-semibold">{w.profiles?.full_name ?? 'Unknown'}</span>
                  <span className="text-surface-500 text-xs">{w.profiles?.email}</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-surface-500">{tierLabel(w.match_tier)}</span>
                  <span className="text-surface-600 text-xs">•</span>
                  <span className="text-xs text-surface-500">
                    {w.draws ? `${monthNames[w.draws.month - 1]} ${w.draws.year}` : ''}
                  </span>
                  <div className="flex gap-1">
                    {(w.matched_numbers ?? []).map((n: number) => (
                      <span key={n} className="w-5.5 h-5.5 rounded bg-brand-500/20 text-brand-300 text-xs font-bold flex items-center justify-center">{n}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Prize */}
              <div className="text-right">
                <div className="text-xl font-black text-white">£{w.prize_amount?.toFixed(2)}</div>
                <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium border', statusConfig[w.payout_status]?.color ?? '')}>
                  {statusConfig[w.payout_status]?.label}
                </span>
              </div>

              {/* Actions */}
              {w.payout_status === 'pending' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => updatePayout(w.id, 'approved')}
                    disabled={processing === w.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-500/15 border border-brand-500/25 text-brand-400 text-xs font-medium hover:bg-brand-500/25 transition-all"
                  >
                    {processing === w.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                    Approve
                  </button>
                  <button
                    onClick={() => updatePayout(w.id, 'rejected')}
                    disabled={processing === w.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-all"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Reject
                  </button>
                </div>
              )}
              {w.payout_status === 'approved' && (
                <button
                  onClick={() => updatePayout(w.id, 'paid')}
                  disabled={processing === w.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-xs font-medium hover:bg-emerald-500/25 transition-all"
                >
                  {processing === w.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <DollarSign className="w-3.5 h-3.5" />}
                  Mark as Paid
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
