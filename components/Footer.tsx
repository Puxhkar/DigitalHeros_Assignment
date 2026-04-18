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
    <footer
      style={{
        background: 'rgba(4,9,17,0.98)',
        borderTop: '1px solid rgba(0, 224, 255, 0.1)',
      }}
    >
      {/* Accent line at top */}
      <div
        className="w-full h-[1.5px]"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,224,255,0.3) 30%, rgba(255,190,26,0.3) 70%, transparent)' }}
      />

      <div className="container-custom py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-5 group">
              <div
                className="w-9 h-9 flex items-center justify-center bg-brand-500 flex-shrink-0 transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(0,224,255,0.6)]"
                style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
              >
                <Zap className="w-5 h-5 text-black" strokeWidth={2.5} />
              </div>
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
            <p className="text-surface-500 text-sm leading-relaxed max-w-xs font-mono">
              Where your passion for the game transforms into real prize wins and meaningful charitable impact.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {[Twitter, Linkedin, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 flex items-center justify-center text-surface-500 hover:text-brand-400 transition-all duration-200"
                  style={{
                    border: '1px solid rgba(255,255,255,0.08)',
                    clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)',
                  }}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-surface-600 mb-4">
                {heading}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-surface-500 hover:text-brand-400 text-xs font-mono transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(0, 224, 255, 0.08)' }}
        >
          <p className="text-surface-600 text-[10px] font-mono uppercase tracking-widest">
            &copy; {new Date().getFullYear()} BirdiePay. All rights reserved.
          </p>
          <p className="text-surface-700 text-[10px] font-mono flex items-center gap-1.5">
            Made with <Heart className="w-3 h-3 text-accent-500 fill-accent-500" /> for players who give back
          </p>
        </div>
      </div>
    </footer>
  );
}
