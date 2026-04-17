import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Trophy, Clock, Users, Zap, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Draw, Winner } from '@/types/database';

const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function DrawNumbers({ numbers }: { numbers: number[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {numbers.map((n) => (
        <div
          key={n}
          className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-black text-sm shadow-glow"
        >
          {n}
        </div>
      ))}
    </div>
  );
}

function TierBadge({ tier }: { tier: 3 | 4 | 5 }) {
  if (tier === 5) return <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 text-black">🏆 JACKPOT</span>;
  if (tier === 4) return <span className="badge text-xs">🥈 Tier 2</span>;
  return <span className="badge-accent text-xs">🥉 Tier 3</span>;
}

export default async function DrawPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const [scoresRes, drawsRes, winsRes] = await Promise.all([
    supabase.from('scores').select('score').eq('user_id', user.id).order('date_played', { ascending: false }),
    supabase.from('draws').select('*').eq('status', 'completed').order('year', { ascending: false }).order('month', { ascending: false }).limit(6),
    supabase.from('winners').select('*, draws(month, year)').eq('user_id', user.id).order('created_at', { ascending: false }),
  ]);

  const userScores = (scoresRes.data ?? []).map((s) => s.score);
  const draws: Draw[] = drawsRes.data ?? [];
  const wins: (Winner & { draws: { month: number; year: number } | null })[] = (winsRes.data as any) ?? [];

  // Find current month draw
  const now = new Date();
  const currentDraw = draws.find((d) => d.month === (now.getMonth() + 1) && d.year === now.getFullYear());
  const latestDraw = draws[0];

  // Check if user is eligible (active subscription + scores)
  const { data: profile } = await supabase.from('profiles').select('subscription_status').eq('id', user.id).single();
  const isEligible = profile?.subscription_status === 'active' && userScores.length > 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white">Prize Draw</h1>
        <p className="text-surface-400 text-sm mt-1">Monthly draws on the 1st — match numbers to win prize tiers</p>
      </div>

      {/* Eligibility status */}
      <div className={`glass rounded-2xl p-5 border flex items-center gap-4 ${isEligible ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-yellow-500/30 bg-yellow-500/5'}`}>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${isEligible ? 'bg-emerald-500/20' : 'bg-yellow-500/20'}`}>
          {isEligible ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : <AlertCircle className="w-5 h-5 text-yellow-400" />}
        </div>
        <div>
          <p className={`font-semibold text-sm ${isEligible ? 'text-emerald-400' : 'text-yellow-400'}`}>
            {isEligible ? 'You\'re entered in the next draw!' : 'Complete requirements to enter'}
          </p>
          <p className="text-surface-400 text-xs mt-0.5">
            {isEligible
              ? `${userScores.length} scores on file — draw on the 1st of next month`
              : !profile?.subscription_status || profile.subscription_status !== 'active'
                ? 'Active subscription required'
                : 'Add at least 1 score to your profile'}
          </p>
        </div>
        {isEligible && (
          <div className="ml-auto flex flex-wrap gap-2">
            {userScores.map((n, i) => (
              <div key={i} className="w-9 h-9 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-300 font-bold text-xs">
                {n}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Prize pool breakdown */}
      <div className="card-elevated rounded-2xl p-6">
        <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2">
          <Zap className="w-4 h-4 text-brand-400" />
          Prize Pool Structure
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { tier: 'Jackpot (5 matches)', pct: '40%', color: 'from-yellow-400/20 to-yellow-500/5 border-yellow-500/25', text: 'text-yellow-400', desc: 'Rolls over if no winner' },
            { tier: 'Tier 2 (4 matches)', pct: '35%', color: 'from-brand-500/20 to-brand-600/5 border-brand-500/25', text: 'text-brand-400', desc: 'Split among winners' },
            { tier: 'Tier 3 (3 matches)', pct: '25%', color: 'from-accent-500/20 to-accent-600/5 border-accent-500/25', text: 'text-accent-400', desc: 'Split among winners' },
          ].map((p) => (
            <div key={p.tier} className={`p-4 rounded-2xl bg-gradient-to-b ${p.color} border text-center`}>
              <div className={`text-3xl font-black ${p.text} mb-1`}>{p.pct}</div>
              <div className="text-white text-xs font-semibold mb-1">{p.tier}</div>
              <div className="text-surface-500 text-xs">{p.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Latest draw result */}
      {latestDraw && (
        <div className="card-elevated rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-400" />
              Latest Draw — {monthNames[(latestDraw.month ?? 1) - 1]} {latestDraw.year}
            </h3>
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs">
              <Users className="w-3.5 h-3.5" />
              {latestDraw.total_participants} participants
            </div>
          </div>

          {latestDraw.winning_numbers && (
            <>
              <p className="text-surface-500 text-xs mb-3">Winning numbers:</p>
              <DrawNumbers numbers={latestDraw.winning_numbers} />
              <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="text-center p-3 rounded-xl bg-yellow-500/8 border border-yellow-500/20">
                  <div className="text-sm font-bold text-yellow-400">{formatCurrency(latestDraw.jackpot_amount, 'GBP').replace('$', '£')}</div>
                  <div className="text-xs text-surface-500 mt-0.5">Jackpot pool</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-brand-500/8 border border-brand-500/20">
                  <div className="text-sm font-bold text-brand-400">{formatCurrency(latestDraw.tier_two_amount, 'GBP').replace('$', '£')}</div>
                  <div className="text-xs text-surface-500 mt-0.5">Tier 2 pool</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-accent-500/8 border border-accent-500/20">
                  <div className="text-sm font-bold text-accent-400">{formatCurrency(latestDraw.tier_three_amount, 'GBP').replace('$', '£')}</div>
                  <div className="text-xs text-surface-500 mt-0.5">Tier 3 pool</div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* My wins */}
      <div>
        <h3 className="text-sm font-semibold text-surface-400 uppercase tracking-wider mb-4">My Winnings</h3>
        {wins.length === 0 ? (
          <div className="text-center py-12 card rounded-2xl">
            <Trophy className="w-12 h-12 text-surface-700 mx-auto mb-3" />
            <p className="text-surface-400 font-medium">No wins yet</p>
            <p className="text-surface-600 text-sm mt-1">Keep your scores current to maximise your chances!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {wins.map((win) => (
              <div key={win.id} className="flex items-center justify-between p-5 rounded-2xl glass border border-white/10 hover:border-white/20 transition-all duration-200">
                <div className="flex items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <TierBadge tier={win.match_tier as 3 | 4 | 5} />
                      <span className="text-surface-500 text-xs">
                        {win.draws ? `${monthNames[win.draws.month - 1]} ${win.draws.year}` : ''}
                      </span>
                    </div>
                    <div className="flex gap-1.5">
                      {win.matched_numbers.map((n) => (
                        <span key={n} className="w-7 h-7 rounded-lg bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-xs font-bold text-brand-300">
                          {n}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-black text-white">{formatCurrency(win.prize_amount, 'GBP').replace('$', '£')}</div>
                  <div className={`text-xs mt-0.5 ${win.payout_status === 'paid' ? 'text-emerald-400' : win.payout_status === 'approved' ? 'text-brand-400' : win.payout_status === 'rejected' ? 'text-red-400' : 'text-yellow-400'}`}>
                    {win.payout_status === 'paid' ? '✓ Paid' : win.payout_status === 'approved' ? 'Processing' : win.payout_status === 'rejected' ? '✗ Rejected' : 'Pending verification'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Previous 6 draws history */}
      {draws.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-surface-400 uppercase tracking-wider mb-4">Recent Draws</h3>
          <div className="space-y-2">
            {draws.map((draw) => (
              <div key={draw.id} className="flex items-center justify-between p-4 rounded-xl glass border border-white/10 text-sm">
                <span className="text-surface-300 font-medium">{monthNames[(draw.month ?? 1) - 1]} {draw.year}</span>
                <div className="flex gap-1.5">
                  {(draw.winning_numbers ?? []).map((n) => (
                    <span key={n} className="w-7 h-7 rounded-lg bg-surface-700 flex items-center justify-center text-xs font-bold text-surface-300">{n}</span>
                  ))}
                </div>
                <span className="text-surface-500 text-xs">{draw.total_participants} players</span>
                <span className="text-brand-400 font-semibold text-xs">{formatCurrency(draw.pool_amount, 'GBP').replace('$', '£')}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
