import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Trophy, Heart, CreditCard, BarChart2, ArrowRight, TrendingUp, Calendar, Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';
import { formatDate, formatCurrency } from '@/lib/utils';
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from 'react';

export const dynamic = 'force-dynamic';

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
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  // Use saved full_name first, fall back to email prefix
  const playerName = profile?.full_name?.trim()
    ? profile.full_name.trim().split(' ')[0]
    : user.email?.split('@')[0] ?? 'Player';
  const playerAvatar = profile?.avatar_url ?? null;

  const statCards = [
    {
      label: 'SUBSCRIPTION',
      value: isActive ? 'ACTIVE' : 'INACTIVE',
      subtext: profile?.subscription_plan === 'yearly' ? 'Yearly plan' : 'Monthly plan',
      icon: CreditCard,
      accentColor: isActive ? '#00ffaa' : '#f87171',
      href: '/dashboard/subscription',
    },
    {
      label: 'SCORES LOGGED',
      value: `${scores.length}/5`,
      subtext: 'Last 5 Stableford scores',
      icon: BarChart2,
      accentColor: '#00e0ff',
      href: '/dashboard/scores',
    },
    {
      label: 'CHARITY',
      value: profile?.charities ? (profile.charities as { name: string }).name.split(' ')[0] : 'NONE',
      subtext: `${profile?.charity_percentage ?? 10}% of subscription`,
      icon: Heart,
      accentColor: '#ffbe1a',
      href: '/dashboard/charity',
    },
    {
      label: 'PRIZE DRAW',
      value: recentWins.length > 0 ? 'WINNER' : 'ENTERED',
      subtext: latestDraw ? `Last: ${monthNames[latestDraw.month - 1]} ${latestDraw.year}` : 'No draws yet',
      icon: Trophy,
      accentColor: '#fbbf24',
      href: '/dashboard/draw',
    },
  ];

  const panelStyle = {
    background: 'linear-gradient(135deg, rgba(8,17,30,0.96) 0%, rgba(4,9,17,0.99) 100%)',
    border: '1px solid rgba(0, 224, 255, 0.12)',
    boxShadow: '0 4px 24px rgba(0,0,0,0.5), inset 0 0 30px rgba(0,224,255,0.02)',
    clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)',
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          {playerAvatar ? (
            <div
              className="w-14 h-14 overflow-hidden flex-shrink-0"
              style={{
                border: '2px solid rgba(0,224,255,0.3)',
                clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
                boxShadow: '0 0 16px rgba(0,224,255,0.15)',
              }}
            >
              <img src={playerAvatar} alt={playerName} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div
              className="w-14 h-14 flex items-center justify-center text-black text-xl font-black flex-shrink-0 bg-brand-500"
              style={{
                clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
                boxShadow: '0 0 16px rgba(0,224,255,0.3)',
              }}
            >
              {playerName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-surface-500 mb-1">
              BirdiePay // Player Dashboard
            </p>
            <h1 className="text-2xl md:text-3xl font-mono font-black text-white uppercase tracking-tight">
              Welcome,{' '}
              <span
                className="text-brand-400"
                style={{ textShadow: '0 0 20px rgba(0, 224, 255, 0.6)' }}
              >
                {playerName}
              </span>
            </h1>
            <p className="text-surface-500 text-xs mt-0.5 font-mono">
              Overview for {new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
        {/* Live indicator */}
        <div className="hidden md:flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-emerald-400">
          <span
            className="w-1.5 h-1.5 bg-emerald-400 animate-pulse"
            style={{ boxShadow: '0 0 5px rgba(0,255,170,0.8)' }}
          />
          System Online
        </div>
      </div>

      {/* Subscription Alert */}
      {!isActive && (
        <div
          className="flex items-center justify-between flex-wrap gap-4 px-5 py-4"
          style={{
            background: 'rgba(255,190,26,0.05)',
            border: '1px solid rgba(255,190,26,0.25)',
            clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)',
          }}
        >
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-accent-400 flex-shrink-0" style={{ filter: 'drop-shadow(0 0 4px rgba(255,190,26,0.7))' }} />
            <div>
              <p className="text-accent-400 font-mono font-bold text-sm uppercase tracking-widest">Subscription Inactive</p>
              <p className="text-surface-500 text-xs font-mono mt-0.5">Subscribe to enter prize draws and support your charity</p>
            </div>
          </div>
          <Link
            href="/dashboard/subscription"
            className="flex items-center gap-2 px-5 py-2 text-xs font-mono font-bold uppercase tracking-widest text-black bg-accent-500 hover:bg-accent-400 transition-colors"
            style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
          >
            Subscribe Now <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="group block hover:-translate-y-1 transition-transform duration-300"
          >
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(8,17,30,0.96) 0%, rgba(4,9,17,0.99) 100%)',
                border: `1px solid ${card.accentColor}22`,
                boxShadow: `0 4px 20px rgba(0,0,0,0.4), 0 0 20px ${card.accentColor}08`,
                clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)',
              }}
              className="p-5 h-full transition-all duration-300 group-hover:border-opacity-40"
            >
              {/* Top accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-[1.5px]"
                style={{ background: `linear-gradient(90deg, transparent, ${card.accentColor}60, transparent)` }}
              />
              <div
                className="w-8 h-8 flex items-center justify-center mb-4"
                style={{
                  background: `${card.accentColor}10`,
                  border: `1px solid ${card.accentColor}30`,
                  clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)',
                }}
              >
                <card.icon className="w-4 h-4" style={{ color: card.accentColor, filter: `drop-shadow(0 0 4px ${card.accentColor}80)` }} />
              </div>
              <div
                className="text-lg font-mono font-black leading-tight mb-1"
                style={{ color: card.accentColor, textShadow: `0 0 12px ${card.accentColor}50` }}
              >
                {card.value}
              </div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-surface-500">{card.label}</div>
              <div className="text-[10px] font-mono text-surface-600 mt-1">{card.subtext}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom panels */}
      <div className="grid lg:grid-cols-2 gap-5">

        {/* Recent Scores Panel */}
        <div style={panelStyle} className="p-6 relative">
          <div className="absolute top-0 left-0 right-0 h-[1.5px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,224,255,0.4), transparent)' }} />

          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-brand-400 flex items-center gap-2">
              <BarChart2 className="w-3.5 h-3.5" style={{ filter: 'drop-shadow(0 0 4px rgba(0,224,255,0.7))' }} />
              Score Register
            </h3>
            <Link
              href="/dashboard/scores"
              className="text-[10px] font-mono uppercase tracking-widest text-surface-500 hover:text-brand-400 flex items-center gap-1 transition-colors"
            >
              Manage <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {scores.length === 0 ? (
            <div className="text-center py-10">
              <BarChart2 className="w-10 h-10 mx-auto mb-3 text-surface-700" />
              <p className="text-surface-500 text-xs font-mono uppercase tracking-widest">No scores logged</p>
              <Link href="/dashboard/scores" className="text-brand-400 text-xs hover:text-brand-300 mt-2 inline-block font-mono">
                + Add first score
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {scores.map((score: { id: Key | null | undefined; date_played: string | Date; score: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }, i: number) => (
                <div
                  key={score.id}
                  className="flex items-center justify-between py-3 px-4"
                  style={{
                    background: 'rgba(0,224,255,0.03)',
                    border: '1px solid rgba(0,224,255,0.08)',
                    clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-6 h-6 flex items-center justify-center text-black text-[10px] font-mono font-black bg-brand-500 flex-shrink-0"
                      style={{ clipPath: 'polygon(3px 0, 100% 0, 100% calc(100% - 3px), calc(100% - 3px) 100%, 0 100%, 0 3px)' }}
                    >
                      {i + 1}
                    </div>
                    <div className="text-[10px] font-mono text-surface-400 flex items-center gap-1.5 uppercase tracking-wider">
                      <Calendar className="w-3 h-3 text-surface-600" />
                      {formatDate(score.date_played)}
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span
                      className="text-xl font-mono font-black text-white"
                      style={{ textShadow: '0 0 8px rgba(0,224,255,0.4)' }}
                    >
                      {score.score}
                    </span>
                    <span className="text-[10px] font-mono text-surface-600 uppercase">pts</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Prize Draw Panel */}
        <div style={panelStyle} className="p-6 relative">
          <div className="absolute top-0 left-0 right-0 h-[1.5px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,190,26,0.4), transparent)' }} />

          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-accent-400 flex items-center gap-2">
              <Trophy className="w-3.5 h-3.5" style={{ filter: 'drop-shadow(0 0 4px rgba(255,190,26,0.7))' }} />
              Prize Draw
            </h3>
            <Link
              href="/dashboard/draw"
              className="text-[10px] font-mono uppercase tracking-widest text-surface-500 hover:text-accent-400 flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {latestDraw && latestDraw.winning_numbers ? (
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-surface-500 mb-4">
                {monthNames[latestDraw.month - 1]} {latestDraw.year} — {latestDraw.total_participants} participants
              </p>

              {/* Winning Numbers (LED scoreboard style) */}
              <div className="flex items-center gap-2 mb-5">
                {latestDraw.winning_numbers.map((n: number) => (
                  <div
                    key={n}
                    className="w-11 h-14 flex items-center justify-center"
                    style={{
                      background: 'rgba(0,0,0,0.8)',
                      border: '1px solid rgba(255,190,26,0.2)',
                      clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)',
                      boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.8)',
                    }}
                  >
                    <span
                      className="font-mono font-black text-2xl"
                      style={{ color: '#ffbe1a', textShadow: '0 0 10px rgba(255,190,26,0.7)' }}
                    >
                      {n}
                    </span>
                  </div>
                ))}
              </div>

              {recentWins.length > 0 ? (
                recentWins.map((win: { id: Key | null | undefined; match_tier: number; matched_numbers: string | any[]; prize_amount: number; }) => (
                  <div
                    key={win.id}
                    className="flex items-center justify-between p-3 mb-2"
                    style={{
                      background: 'rgba(0,255,170,0.05)',
                      border: '1px solid rgba(0,255,170,0.2)',
                      clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-emerald-400" style={{ filter: 'drop-shadow(0 0 4px rgba(0,255,170,0.7))' }} />
                      <div>
                        <p className="text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
                          {win.match_tier === 5 ? 'Jackpot!' : win.match_tier === 4 ? 'Tier 2 Win' : 'Tier 3 Win'}
                        </p>
                        <p className="text-surface-500 text-[10px] font-mono">{win.matched_numbers.length} numbers matched</p>
                      </div>
                    </div>
                    <span
                      className="text-emerald-400 font-mono font-black text-sm"
                      style={{ textShadow: '0 0 8px rgba(0,255,170,0.5)' }}
                    >
                      {formatCurrency(win.prize_amount, 'USD').replace('$', '$')}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <TrendingUp className="w-7 h-7 text-surface-700 mx-auto mb-2" />
                  <p className="text-surface-500 text-xs font-mono uppercase tracking-widest">No wins yet — keep entering scores!</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-10">
              <Trophy className="w-10 h-10 text-surface-700 mx-auto mb-3" />
              <p className="text-surface-400 text-xs font-mono uppercase tracking-widest">Next draw coming soon</p>
              <p className="text-surface-600 text-[10px] font-mono mt-1">Make sure your scores are entered</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
