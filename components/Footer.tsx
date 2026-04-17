import Link from 'next/link';
import { Zap, Twitter, Linkedin, Github, Heart } from 'lucide-react';

const footerLinks = {
  Product: [
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'Charities', href: '/charities' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-surface-950/80 backdrop-blur-sm">
      <div className="container-custom py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-glow">
                <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-lg tracking-tight">
                Digital<span className="gradient-text">Heros</span>
              </span>
            </Link>
            <p className="text-surface-400 text-sm leading-relaxed max-w-xs">
              Where your passion for the game transforms into real prize wins and meaningful charitable impact.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {[Twitter, Linkedin, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg glass flex items-center justify-center text-surface-400 hover:text-white hover:border-white/20 transition-all duration-200 border border-white/10"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-surface-500 mb-4">
                {heading}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-surface-400 hover:text-white text-sm transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-surface-500 text-xs">
            &copy; {new Date().getFullYear()} DigitalHeros. All rights reserved.
          </p>
          <p className="text-surface-600 text-xs flex items-center gap-1.5">
            Made with <Heart className="w-3 h-3 text-accent-500 fill-accent-500" /> for players who give back
          </p>
        </div>
      </div>
    </footer>
  );
}
