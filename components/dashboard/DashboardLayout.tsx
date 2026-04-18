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
  { href: '/dashboard/profile', label: 'Profile', icon: User },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
  userEmail?: string;
  userName?: string;
  userAvatar?: string | null;
  subscriptionStatus?: string;
}

export default function DashboardLayout({
  children,
  userEmail = 'user@example.com',
  userName = 'Player',
  userAvatar = null,
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

  const currentLabel = navItems.find((n) => isActive(n.href, n.exact))?.label ?? 'Dashboard';

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div
        className="px-5 py-5"
        style={{ borderBottom: '1px solid rgba(0, 224, 255, 0.1)' }}
      >
        <Link href="/" className="flex items-center gap-3 group">
          <div
            className="w-9 h-9 flex items-center justify-center bg-brand-500 flex-shrink-0 transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(0,224,255,0.6)]"
            style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
          >
            <Zap className="w-5 h-5 text-black" strokeWidth={2.5} />
          </div>
          <span className="font-mono font-black text-base tracking-tight uppercase">
            <span className="text-white">Birdie</span>
            <span className="text-brand-400" style={{ textShadow: '0 0 10px rgba(0, 224, 255, 0.6)' }}>Pay</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 text-sm font-mono uppercase tracking-widest transition-all duration-200 group relative',
                active
                  ? 'text-brand-400'
                  : 'text-surface-500 hover:text-surface-200'
              )}
              style={{
                clipPath: active
                  ? 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)'
                  : undefined,
                background: active
                  ? 'linear-gradient(90deg, rgba(0,224,255,0.08) 0%, transparent 100%)'
                  : undefined,
                borderLeft: active ? '2px solid rgba(0, 224, 255, 0.6)' : '2px solid transparent',
                boxShadow: active ? 'inset 3px 0 8px rgba(0,224,255,0.05)' : undefined,
              }}
            >
              <item.icon
                className={cn('w-4 h-4 flex-shrink-0', active ? 'text-brand-400' : 'text-surface-600 group-hover:text-surface-400')}
                style={active ? { filter: 'drop-shadow(0 0 4px rgba(0,224,255,0.7))' } : undefined}
              />
              {item.label}
              {active && <ChevronRight className="w-3 h-3 ml-auto text-brand-500 opacity-70" />}
            </Link>
          );
        })}
      </nav>

      {/* User info + logout */}
        <div className="px-3 py-4" style={{ borderTop: '1px solid rgba(0, 224, 255, 0.1)' }}>
          <Link href="/dashboard/profile">
            <div
              className="flex items-center gap-3 px-3 py-3 mb-3 cursor-pointer hover:border-brand-500/30 transition-colors"
              style={{
                background: 'rgba(0,224,255,0.04)',
                border: '1px solid rgba(0,224,255,0.1)',
                clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
              }}
            >
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt={userName}
                  className="w-8 h-8 object-cover flex-shrink-0"
                  style={{ clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)' }}
                />
              ) : (
                <div
                  className="w-8 h-8 flex items-center justify-center text-black text-xs font-black flex-shrink-0 bg-brand-500"
                  style={{ clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)' }}
                >
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-xs font-mono font-bold text-white truncate uppercase tracking-wide">{userName}</div>
                <div className="text-[10px] text-surface-500 truncate font-mono">{userEmail}</div>
              </div>
              <div
                className={cn('w-2 h-2 flex-shrink-0', subscriptionStatus === 'active' ? 'bg-emerald-400' : 'bg-red-400')}
                style={{
                  boxShadow: subscriptionStatus === 'active' ? '0 0 5px rgba(0, 255, 170, 0.7)' : '0 0 5px rgba(248, 113, 113, 0.7)',
                }}
              />
            </div>
          </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3.5 py-2.5 text-sm font-mono uppercase tracking-widest text-surface-500 hover:text-red-400 transition-all duration-200 w-full"
          style={{ borderLeft: '2px solid transparent' }}
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: '#040911' }}
    >
      {/* Cyber background layers */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 224, 255, 0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 224, 255, 0.025) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% -20%, rgba(0, 224, 255, 0.08) 0%, transparent 70%)',
        }}
      />

      {/* Desktop Sidebar */}
      <aside
        className="hidden md:flex flex-col w-60 flex-shrink-0 relative z-10"
        style={{
          background: 'linear-gradient(180deg, rgba(4,9,17,0.98) 0%, rgba(4,9,17,0.95) 100%)',
          borderRight: '1px solid rgba(0, 224, 255, 0.1)',
          boxShadow: '4px 0 30px rgba(0,0,0,0.5)',
        }}
      >
        {/* Vertical glowing accent line */}
        <div
          className="absolute top-0 right-0 bottom-0 w-[1px] pointer-events-none"
          style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(0,224,255,0.4) 30%, rgba(255,190,26,0.4) 70%, transparent 100%)' }}
        />
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
              className="fixed inset-0 bg-black/70 z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-64 z-50 md:hidden flex flex-col"
              style={{
                background: 'rgba(4,9,17,0.99)',
                borderRight: '1px solid rgba(0, 224, 255, 0.15)',
              }}
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0 relative z-10">
        {/* Top Header */}
        <header
          className="flex items-center justify-between h-14 px-4 md:px-6 flex-shrink-0 relative"
          style={{
            background: 'rgba(4,9,17,0.9)',
            borderBottom: '1px solid rgba(0, 224, 255, 0.1)',
            backdropFilter: 'blur(8px)',
          }}
        >
          {/* Bottom accent line */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[1px] pointer-events-none"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(0,224,255,0.3) 30%, rgba(255,190,26,0.3) 70%, transparent)' }}
          />

          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 text-surface-500 hover:text-brand-400 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden md:flex items-center gap-3">
            {/* Breadcrumb style label */}
            <span className="text-surface-600 text-xs font-mono uppercase tracking-widest">BirdiePay</span>
            <span className="text-surface-700 text-xs">/</span>
            <span
              className="text-brand-400 text-xs font-mono uppercase tracking-widest font-bold"
              style={{ textShadow: '0 0 8px rgba(0,224,255,0.5)' }}
            >
              {currentLabel}
            </span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              className="relative p-2 text-surface-500 hover:text-brand-400 transition-colors"
              style={{ border: '1px solid rgba(0,224,255,0.1)' }}
            >
              <Bell className="w-4 h-4" />
              <span
                className="absolute top-1 right-1 w-1.5 h-1.5 bg-accent-400 rounded-none"
                style={{ boxShadow: '0 0 5px rgba(255,190,26,0.8)' }}
              />
            </button>
            <Link
              href="/dashboard/profile"
              className="p-2 text-surface-500 hover:text-brand-400 transition-colors"
              style={{ border: '1px solid rgba(0,224,255,0.1)' }}
            >
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
