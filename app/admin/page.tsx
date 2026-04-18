import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Users, Trophy, Heart, CreditCard, TrendingUp, DollarSign } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const [usersRes, activeSubsRes, drawsRes, charityRes, winnersRes] = await Promise.all([
    supabase.from('profiles').select('id, subscription_status, subscription_plan, created_at', { count: 'exact' }),
    supabase.from('profiles').select('id', { count: 'exact' }).eq('subscription_status', 'active'),
    supabase.from('draws').select('pool_amount, jackpot_rolled_over').eq('status', 'completed'),
    supabase.from('charities').select('total_raised'),
    supabase.from('winners').select('prize_amount, payout_status'),
  ]);

  const totalUsers = usersRes.count ?? 0;
  const activeSubs = activeSubsRes.count ?? 0;
  const totalPrizePool = (drawsRes.data ?? []).reduce((sum: number, d) => sum + (d.pool_amount ?? 0), 0);
  const totalCharity = (charityRes.data ?? []).reduce((sum: number, c) => sum + (c.total_raised ?? 0), 0);
  const pendingPayouts = (winnersRes.data ?? []).filter((w) => w.payout_status === 'pending').length;
  const totalWinners = (winnersRes.data ?? []).length;

  const stats = [
    { label: 'Total Users', value: totalUsers, icon: Users, color: 'from-brand-500/20 to-brand-600/5 border-brand-500/25', iconColor: 'text-brand-400', sub: `${activeSubs} active` },
    { label: 'Active Subscriptions', value: activeSubs, icon: CreditCard, color: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/25', iconColor: 'text-emerald-400', sub: `${totalUsers > 0 ? Math.round((activeSubs/totalUsers)*100) : 0}% conversion` },
    { label: 'Total Prize Pool', value: `£${totalPrizePool.toFixed(0)}`, icon: Trophy, color: 'from-yellow-500/20 to-yellow-600/5 border-yellow-500/25', iconColor: 'text-yellow-400', sub: `${totalWinners} total winners` },
    { label: 'Charity Raised', value: `£${totalCharity.toFixed(0)}`, icon: Heart, color: 'from-accent-500/20 to-accent-600/5 border-accent-500/25', iconColor: 'text-accent-400', sub: 'Last 30 days' },
    { label: 'Pending Payouts', value: pendingPayouts, icon: DollarSign, color: 'from-orange-500/20 to-orange-600/5 border-orange-500/25', iconColor: 'text-orange-400', sub: 'Awaiting verification' },
    { label: 'Monthly Revenue', value: `£${(activeSubs * 9).toFixed(0)}`, icon: TrendingUp, color: 'from-surface-700/30 to-surface-800/10 border-white/10', iconColor: 'text-surface-400', sub: 'Estimated (all monthly)' },
  ];

  // Recent users
  const recentUsers = (usersRes.data ?? []).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);

  return (
    <div className="max-w-6xl space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white">Admin Overview</h1>
        <p className="text-surface-400 text-sm mt-1">Platform metrics and management hub</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className={`rounded-2xl p-5 bg-gradient-to-b ${stat.color} border backdrop-blur-sm`}>
            <div className="flex items-center justify-between mb-3">
              <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
            </div>
            <div className="text-2xl font-black text-white">{stat.value}</div>
            <div className="text-surface-400 text-xs mt-0.5">{stat.label}</div>
            <div className="text-surface-600 text-xs mt-1">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { label: 'Run Monthly Draw', href: '/admin/draw', desc: 'Execute or simulate this month\'s draw', color: 'border-yellow-500/30 bg-yellow-500/5 hover:bg-yellow-500/10' },
          { label: 'Manage Charities', href: '/admin/charities', desc: 'Add, edit, or deactivate charity listings', color: 'border-accent-500/30 bg-accent-500/5 hover:bg-accent-500/10' },
          { label: 'Process Payouts', href: '/admin/winners', desc: `${pendingPayouts} winners pending verification`, color: 'border-brand-500/30 bg-brand-500/5 hover:bg-brand-500/10' },
        ].map((action) => (
          <a key={action.label} href={action.href} className={`block p-5 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 ${action.color}`}>
            <h3 className="text-white font-semibold text-sm mb-1">{action.label}</h3>
            <p className="text-surface-500 text-xs">{action.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
