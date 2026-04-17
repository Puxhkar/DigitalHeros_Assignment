'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'James Whitfield',
    handle: '@jwhitfield_golf',
    avatar: 'JW',
    content:
      'I never expected to win the jackpot in month two, but here we are. £4,200 landed in my account and I know 12% of my sub went to Save the Children. This platform is a no-brainer.',
    rating: 5,
    tier: 'Jackpot Winner',
    color: 'from-brand-500 to-brand-600',
  },
  {
    name: 'Sarah O\'Brien',
    handle: '@sarahgolf_pga',
    avatar: 'SO',
    content:
      'The dashboard is beautiful. Entering scores takes 10 seconds, and seeing the charity impact tracker grow month-on-month is genuinely motivating. Way better than I expected.',
    rating: 5,
    tier: 'Monthly Subscriber',
    color: 'from-accent-500 to-accent-600',
  },
  {
    name: 'Marcus Chen',
    handle: '@mchen_handicap',
    avatar: 'MC',
    content:
      'Matched 4 numbers in March. The tier 2 payout came through in 48 hours. And Ocean Conservancy sent me a donor receipt I didn\'t even ask for. This is the future of subscription sports.',
    rating: 5,
    tier: 'Tier 2 Winner',
    color: 'from-emerald-400 to-emerald-500',
  },
  {
    name: 'Priya Nair',
    handle: '@priya.scores',
    avatar: 'PN',
    content:
      'I signed up primarily for the charity angle. WWF gets 20% of my plan monthly. The prize draw is a bonus — but an exciting one I now look forward to on the 1st.',
    rating: 5,
    tier: 'Yearly Plan',
    color: 'from-brand-500 to-accent-500',
  },
];

export default function Testimonials() {
  return (
    <section className="section relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-600/10 rounded-full blur-3xl" />

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="badge mb-4">Social Proof</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Winners Don't Just Play —{' '}
            <span className="gradient-text">They Speak</span>
          </h2>
          <p className="text-surface-400 max-w-lg mx-auto">
            Real members. Real wins. Real impact.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card flex flex-col gap-4 group hover:border-white/20 hover:-translate-y-1 transition-all duration-300"
            >
              {/* Quote icon */}
              <Quote className="w-8 h-8 text-brand-500/40" />

              {/* Stars */}
              <div className="flex items-center gap-1">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-brand-400 text-brand-400" />
                ))}
              </div>

              {/* Content */}
              <p className="text-surface-200 text-sm leading-relaxed flex-1">
                &ldquo;{t.content}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-sm font-bold`}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{t.name}</div>
                    <div className="text-surface-500 text-xs">{t.handle}</div>
                  </div>
                </div>
                <span className="badge text-xs">{t.tier}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
