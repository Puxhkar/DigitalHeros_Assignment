'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Users, Trophy, Heart, Settings,
  BarChart2, LogOut, Zap, Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

const navItems = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/draw', label: 'Draw Manager', icon: Trophy },
  { href: '/admin/charities', label: 'Charities', icon: Heart },
  { href: '/admin/winners', label: 'Winners', icon: BarChart2 },
];

interface AdminLayoutProps {
  children: React.ReactNode;
  userName: string;
  userEmail: string;
}

export default function AdminLayout({ children, userName, userEmail }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Signed out');
    router.push('/');
  };

  return (
    <div className="flex h-screen bg-surface-950 overflow-hidden">
      {/* Admin sidebar */}
      <aside className="flex flex-col w-56 flex-shrink-0 border-r border-white/10 bg-surface-900/80 backdrop-blur-sm">
        {/* Logo + admin badge */}
        <div className="px-4 py-5 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-sm tracking-tight">
              Digital<span className="gradient-text">Heros</span>
            </span>
          </Link>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-accent-500/15 border border-accent-500/25 w-fit">
            <Shield className="w-3 h-3 text-accent-400" />
            <span className="text-accent-300 text-xs font-semibold">Admin Panel</span>
          </div>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-0.5">
          {navItems.map((item) => {
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  active
                    ? 'bg-brand-500/20 text-white border border-brand-500/25'
                    : 'text-surface-400 hover:text-white hover:bg-white/5'
                )}
              >
                <item.icon className={cn('w-4 h-4 flex-shrink-0', active ? 'text-brand-400' : 'text-surface-600')} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-2 py-3 border-t border-white/10">
          <div className="px-3 py-2.5 rounded-xl glass border border-white/10 mb-2">
            <div className="text-xs font-semibold text-white truncate">{userName}</div>
            <div className="text-xs text-surface-500 truncate">{userEmail}</div>
          </div>
          <Link href="/dashboard" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-surface-500 hover:text-white hover:bg-white/5 transition-all">
            <LayoutDashboard className="w-3.5 h-3.5" />
            User Dashboard
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-surface-500 hover:text-red-400 hover:bg-red-400/8 transition-all w-full mt-0.5">
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
