import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import { Users, CreditCard, Mail, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: users } = await supabase
    .from('profiles')
    .select('*, charities(name)')
    .order('created_at', { ascending: false });

  const statusColors: Record<string, string> = {
    active: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
    inactive: 'bg-surface-700/50 text-surface-400 border-white/10',
    cancelled: 'bg-red-500/15 text-red-400 border-red-500/25',
    trialing: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
  };

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">User Management</h1>
        <p className="text-surface-400 text-sm mt-1">{users?.length ?? 0} total registered users</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total', value: users?.length ?? 0, color: 'text-white' },
          { label: 'Active', value: users?.filter((u) => u.subscription_status === 'active').length ?? 0, color: 'text-emerald-400' },
          { label: 'Inactive', value: users?.filter((u) => u.subscription_status === 'inactive').length ?? 0, color: 'text-surface-400' },
          { label: 'Admins', value: users?.filter((u) => u.role === 'admin').length ?? 0, color: 'text-accent-400' },
        ].map((s) => (
          <div key={s.label} className="card-elevated rounded-xl p-4 text-center">
            <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-surface-500 text-xs">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card-elevated rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-surface-500 uppercase tracking-wider">User</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-surface-500 uppercase tracking-wider">Plan</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-surface-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-surface-500 uppercase tracking-wider">Charity</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-surface-500 uppercase tracking-wider">Joined</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-surface-500 uppercase tracking-wider">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {(users ?? []).map((u) => (
                <tr key={u.id} className="hover:bg-white/3 transition-colors duration-150">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500/40 to-brand-600/20 flex items-center justify-center text-brand-300 text-xs font-bold flex-shrink-0">
                        {(u.full_name ?? u.email ?? '?').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-white text-xs font-medium">{u.full_name ?? '—'}</div>
                        <div className="text-surface-500 text-xs">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-surface-300 text-xs capitalize">{u.subscription_plan ?? '—'}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium border', statusColors[u.subscription_status] ?? statusColors.inactive)}>
                      {u.subscription_status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-surface-400 text-xs">{(u.charities as any)?.name ?? '—'}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-surface-500 text-xs">{formatDate(u.created_at)}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium border', u.role === 'admin' ? 'bg-accent-500/15 text-accent-400 border-accent-500/25' : 'bg-surface-700/50 text-surface-500 border-white/10')}>
                      {u.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
