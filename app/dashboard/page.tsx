import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Trophy, Heart, CreditCard, BarChart2, ArrowRight, TrendingUp, Calendar, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { formatDate, formatCurrency } from '@/lib/utils';

async function getDashboardData(userId: string) {
  const supabase = await createClient();

  const [profileRes, scoresRes, drawRes, winnersRes] = await Promise.all([
    supabase.from('profiles').select('*, charities(name)').eq('id', userId).single(),
    supabase.from('scores').select('*').eq('user_id', userId).order('date_played', { ascending: false }).limit(5),
    supabase.from('draws').select('*').eq('status', 'completed').order('year', { ascending: false }).order('month', { ascending: false }).limit(1).single(),
    supabase.from('winners').select('*, draws(month, year)').eq('user_id', userId).order('created_at', { ascending: false }).limit(3),
  ]);

  return {
    profile: profileRes.data,
    scores: scoresRes.data ?? [],
    latestDraw: drawRes.data,
    recentWins: winnersRes.data ?? [],
  };
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { profile, scores, latestDraw, recentWins } = await getDashboardData(user.id);

  const isActive = profile?.subscription_status === 'active';
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  const statCards = [
    {
      label: 'Subscription',
      value: isActive ? 'Active' : 'Inactive',
      subtext: profile?.subscription_plan === 'yearly' ? 'Yearly plan' : 'Monthly plan',
      icon: CreditCard,
      color: isActive ? 'from-emerald-400/20 to-emerald-500/5 border-emerald-500/25' : 'from-red-500/20 to-red-600/5 border-red-500/25',
      iconColor: isActive ? 'text-emerald-400' : 'text-red-400',
      href: '/dashboard/subscription',
    },
    {
      label: 'Scores Logged',
      value: `${scores.length}/5`,
      subtext: 'Last 5 scores stored',
      icon: BarChart2,
      color: 'from-brand-500/20 to-brand-600/5 border-brand-500/25',
      iconColor: 'text-brand-400',
      href: '/dashboard/scores',
    },
    {
      label: 'Charity',
      value: profile?.charities ? (profile.charities as { name: string }).name.split(' ')[0] : 'None',
      subtext: `${profile?.charity_percentage ?? 10}% of subscription`,
      icon: Heart,
      color: 'from-accent-500/20 to-accent-600/5 border-accent-500/25',
      iconColor: 'text-accent-400',
      href: '/dashboard/charity',
    },
    {
      label: 'Prize Draws',
      value: recentWins.length > 0 ? '🏆 Winner!' : 'Entered',
      subtext: latestDraw ? `Last draw: ${monthNames[latestDraw.month - 1]} ${latestDraw.year}` : 'No draws yet',
      icon: Trophy,
      color: 'from-yellow-500/20 to-yellow-600/5 border-yellow-500/25',
      iconColor: 'text-yellow-400',
      href: '/dashboard/draw',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-white">
          Welcome back, <span className="gradient-text">{profile?.full_name?.split(' ')[0] ?? 'Player'}</span> 👋
        </h1>
        <p className="text-surface-400 text-sm mt-1">Here's your at-a-glance overview for {new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</p>
      </div>

      {/* Subscription alert */}
      {!isActive && (
        <div className="glass rounded-2xl p-5 border border-yellow-500/30 bg-yellow-500/5 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Your subscription is inactive</p>
              <p className="text-surface-400 text-xs">Subscribe to enter prize draws and support your charity</p>
            </div>
          </div>
          <Link href="/dashboard/subscription" className="btn-primary text-sm">
            Subscribe Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Link key={card.label} href={card.href} className={`card-elevated rounded-2xl p-5 border bg-gradient-to-b ${card.color} hover:-translate-y-1 hover:shadow-card transition-all duration-300 group block`}>
            <div className={`w-9 h-9 rounded-xl glass flex items-center justify-center mb-3`}>
              <card.icon className={`w-4.5 h-4.5 ${card.iconColor}`} />
            </div>
            <div className="text-lg font-black text-white leading-tight">{card.value}</div>
            <div className="text-surface-500 text-xs mt-0.5">{card.label}</div>
            <div className="text-surface-600 text-xs mt-1">{card.subtext}</div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent scores */}
        <div className="card-elevated rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-brand-400" />
              Recent Scores
            </h3>
            <Link href="/dashboard/scores" className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1">
              Manage <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {scores.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center mx-auto mb-3">
                <BarChart2 className="w-6 h-6 text-brand-500/60" />
              </div>
              <p className="text-surface-400 text-sm">No scores yet</p>
              <Link href="/dashboard/scores" className="text-brand-400 text-xs hover:underline mt-1 inline-block">Add your first score →</Link>
            </div>
          ) : (
            <div className="space-y-2.5">
              {scores.map((score, i) => (
                <div key={score.id} className="flex items-center justify-between py-2.5 px-3.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/5 transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-brand-500/20 flex items-center justify-center text-brand-400 font-bold text-xs">
                      {i + 1}
                    </div>
                    <div>
                      <div className="text-xs text-surface-300 font-medium flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-surface-600" />
                        {formatDate(score.date_played)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black text-white">{score.score}</span>
                    <span className="text-surface-500 text-xs">pts</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Latest draw + recent wins */}
        <div className="card-elevated rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-400" />
              Prize Draw
            </h3>
            <Link href="/dashboard/draw" className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {latestDraw && latestDraw.winning_numbers ? (
            <div>
              <p className="text-surface-500 text-xs mb-3">
                {monthNames[latestDraw.month - 1]} {latestDraw.year} draw — {latestDraw.total_participants} participants
              </p>
              <div className="flex items-center gap-2 mb-5">
                {latestDraw.winning_numbers.map((n: number) => (
                  <div key={n} className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white font-black text-sm shadow-glow">
                    {n}
                  </div>
                ))}
              </div>

              {recentWins.length > 0 ? (
                recentWins.map((win) => (
                  <div key={win.id} className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🏆</span>
                      <div>
                        <p className="text-emerald-400 text-xs font-semibold">
                          {win.match_tier === 5 ? 'Jackpot!' : win.match_tier === 4 ? 'Tier 2 Win' : 'Tier 3 Win'}
                        </p>
                        <p className="text-surface-500 text-xs">{win.matched_numbers.length} numbers matched</p>
                      </div>
                    </div>
                    <span className="text-emerald-400 font-black">{formatCurrency(win.prize_amount, 'GBP').replace('$', '£')}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <TrendingUp className="w-8 h-8 text-surface-600 mx-auto mb-2" />
                  <p className="text-surface-500 text-xs">No wins yet — keep entering scores!</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Trophy className="w-10 h-10 text-surface-700 mx-auto mb-3" />
              <p className="text-surface-400 text-sm">Next draw coming soon</p>
              <p className="text-surface-600 text-xs mt-1">Make sure your scores are entered!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
