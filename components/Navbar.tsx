'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import type { User, Session, AuthChangeEvent } from '@supabase/supabase-js';

const navLinks = [
  { href: '/#how-it-works', label: 'How It Works' },
  { href: '/#charities', label: 'Charities' },
  { href: '/#pricing', label: 'Pricing' },
  { href: '/charities', label: 'Browse Causes' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);

    supabase.auth.getUser().then(({ data: { user } }: { data: { user: User | null } }) => setUser(user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null);
    });

    return () => {
      window.removeEventListener('scroll', handler);
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  return (
    <header
      style={{
        background: scrolled
          ? 'linear-gradient(180deg, rgba(4,9,17,0.95) 0%, rgba(4,9,17,0.8) 100%)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0, 224, 255, 0.12)' : 'none',
        boxShadow: scrolled ? '0 4px 30px rgba(0, 224, 255, 0.05)' : 'none',
      }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled ? 'py-3' : 'py-5'
      )}
    >
      {/* Thin top accent line like a hardware panel */}
      {scrolled && (
        <div
          className="absolute top-0 left-0 right-0 h-[1.5px] pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, #00e0ff 30%, #ffbe1a 70%, transparent 100%)',
          }}
        />
      )}

      <nav className="container-custom flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          {/* Angled icon badge */}
          <div
            className="w-9 h-9 flex items-center justify-center bg-brand-500 relative flex-shrink-0 transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(0,224,255,0.6)]"
            style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
          >
            <Zap className="w-5 h-5 text-black" strokeWidth={2.5} />
          </div>
          {/* Brand name with mono styling */}
          <span className="font-mono font-black text-lg tracking-tight uppercase">
            <span className="text-white">Birdie</span>
            <span
              className="text-brand-400"
              style={{ textShadow: '0 0 12px rgba(0, 224, 255, 0.6)' }}
            >
              Pay
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative px-4 py-2 text-sm font-medium text-surface-400 hover:text-brand-400 transition-colors duration-200 uppercase tracking-widest font-mono group"
            >
              {link.label}
              {/* Underline accent */}
              <span
                className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand-400 transition-all duration-300 group-hover:w-full"
                style={{ boxShadow: '0 0 6px rgba(0, 224, 255, 0.8)' }}
              />
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <Link
              href="/dashboard"
              className="px-5 py-2 text-sm font-mono font-bold uppercase tracking-widest text-black bg-brand-500 hover:bg-brand-400 transition-colors duration-200"
              style={{
                clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
                boxShadow: '0 0 12px rgba(0, 224, 255, 0.4)',
              }}
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-mono uppercase tracking-widest text-surface-400 hover:text-brand-400 border border-surface-700 hover:border-brand-500/50 transition-all duration-200"
                style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-5 py-2 text-sm font-mono font-bold uppercase tracking-widest text-black bg-brand-500 hover:bg-brand-400 transition-colors duration-200"
                style={{
                  clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
                  boxShadow: '0 0 12px rgba(0, 224, 255, 0.4)',
                }}
              >
                Subscribe &amp; Play
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 text-surface-400 hover:text-brand-400 transition-colors border border-surface-700 hover:border-brand-500/50"
          style={{ clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)' }}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden border-t"
            style={{
              background: 'rgba(4, 9, 17, 0.98)',
              borderColor: 'rgba(0, 224, 255, 0.12)',
            }}
          >
            <div className="container-custom py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-surface-400 hover:text-brand-400 transition-colors duration-200 text-sm font-mono uppercase tracking-widest border-b border-white/5"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 flex flex-col gap-3">
                {user ? (
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="py-3 text-sm font-mono font-bold uppercase tracking-widest text-black bg-brand-500 text-center"
                    style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
                  >
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="py-3 text-sm font-mono uppercase tracking-widest text-surface-400 text-center border border-surface-700"
                      style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileOpen(false)}
                      className="py-3 text-sm font-mono font-bold uppercase tracking-widest text-black bg-brand-500 text-center"
                      style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
                    >
                      Subscribe &amp; Play
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
