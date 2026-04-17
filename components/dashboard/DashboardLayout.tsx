'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, BarChart2, Heart, Trophy, CreditCard,
  LogOut, Zap, Menu, X, Bell, ChevronRight, User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/scores', label: 'My Scores', icon: BarChart2 },
  { href: '/dashboard/draw', label: 'Prize Draw', icon: Trophy },
  { href: '/dashboard/charity', label: 'Charity', icon: Heart },
  { href: '/dashboard/subscription', label: 'Subscription', icon: CreditCard },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
  userEmail?: string;
  userName?: string;
  subscriptionStatus?: string;
}

export default function DashboardLayout({
  children,
  userEmail = 'user@example.com',
  userName = 'Player',
  subscriptionStatus = 'active',
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Signed out');
    router.push('/');
  };

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-glow">
            <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-base tracking-tight">
            Digital<span className="gradient-text">Heros</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
                active
                  ? 'bg-gradient-to-r from-brand-500/20 to-brand-600/10 text-white border border-brand-500/25'
                  : 'text-surface-400 hover:text-white hover:bg-white/5'
              )}
            >
              <item.icon className={cn('w-4.5 h-4.5 flex-shrink-0', active ? 'text-brand-400' : 'text-surface-500 group-hover:text-surface-300')} />
              {item.label}
              {active && <ChevronRight className="w-3.5 h-3.5 ml-auto text-brand-500" />}
            </Link>
          );
        })}
      </nav>

      {/* User info + logout */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl glass border border-white/10 mb-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-white truncate">{userName}</div>
            <div className="text-xs text-surface-500 truncate">{userEmail}</div>
          </div>
          <div className={cn(
            'w-2 h-2 rounded-full flex-shrink-0',
            subscriptionStatus === 'active' ? 'bg-emerald-400' : 'bg-red-400'
          )} />
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-surface-500 hover:text-red-400 hover:bg-red-400/8 transition-all duration-200 w-full"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-surface-950 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-60 flex-shrink-0 glass border-r border-white/10">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-64 z-50 glass border-r border-white/10 md:hidden flex flex-col"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top Header */}
        <header className="flex items-center justify-between h-16 px-4 md:px-6 border-b border-white/10 glass flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden btn-ghost p-2"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden md:block">
            <h2 className="text-sm font-semibold text-white capitalize">
              {navItems.find((n) => isActive(n.href, n.exact))?.label ?? 'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button className="btn-ghost p-2 relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-accent-400 rounded-full" />
            </button>
            <Link href="/dashboard/profile" className="btn-ghost p-2">
              <User className="w-4 h-4" />
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
