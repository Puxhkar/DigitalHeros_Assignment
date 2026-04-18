'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { InfiniteMovingCards } from '@/components/ui/InfiniteMovingCards';

const testimonials = [
  {
    name: 'James Whitfield',
    handle: '@jwhitfield_golf',
    avatar: 'JW',
    content:
      'I never expected to win the jackpot in month two, but here we are. $4,200 landed in my account and I know 12% of my sub went to Save the Children. This platform is a no-brainer.',
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

        <div className="flex flex-col items-center justify-center w-full relative z-20">
          <InfiniteMovingCards
            items={testimonials.map(t => ({
              quote: t.content,
              name: t.name,
              title: t.tier,
              rating: t.rating
            }))}
            direction="left"
            speed="slow"
          />
        </div>
      </div>
    </section>
  );
}
