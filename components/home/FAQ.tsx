'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const faqs = [
  {
    question: "How does the prize draw work?",
    answer: "Every month on the 1st, 5 winning numbers (1-45) are drawn. If your last 5 golf scores match 3, 4, or all 5 numbers, you win a prize from the respective tier pool. Even matching 3 numbers nets you a win!"
  },
  {
    question: "What is Stableford scoring?",
    answer: "Stableford is a scoring system used in golf which, rather than counting the total number of strokes taken, involves scoring points based on the number of strokes taken at each hole. Our platform requires you to log your last 5 Stableford points."
  },
  {
    question: "How much goes to charity?",
    answer: "A minimum of 10% of every subscription goes directly to your chosen charity. You can increase this up to 50% in your dashboard settings. We believe in transparency and show you exactly where your money goes."
  },
  {
    question: "Is my payment secure?",
    answer: "Absolutely. We use Stripe for all payment processing. We never store your card details on our servers. Stripe is PCI-DSS Level 1 compliant, the highest security standard in the payments industry."
  },
  {
    question: "Can I change my chosen charity?",
    answer: "Yes, you can change your charity at any time through your dashboard. Your next monthly contribution will automatically be directed to the newly selected charity."
  },
  {
    question: "What if I haven't played 5 rounds yet?",
    answer: "You can start by logging any number of scores up to 5. However, each score you log acts as an entry in the draw, so having 5 scores gives you the maximum 5 chances to match the drawn numbers."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-surface-950/50 relative overflow-hidden">
      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold mb-4"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Common Questions
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-black text-white mb-6"
          >
            Curious about <span className="gradient-text">BirdiePay?</span>
          </motion.h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                "rounded-2xl border transition-all duration-300",
                openIndex === i 
                  ? "bg-white/5 border-white/10 shadow-glow-sm" 
                  : "bg-surface-900/50 border-white/5 hover:border-white/10"
              )}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-6 py-5 flex items-center justify-between text-left"
              >
                <span className="font-bold text-white text-lg">{faq.question}</span>
                <ChevronDown 
                  className={cn(
                    "w-5 h-5 text-surface-500 transition-transform duration-300",
                    openIndex === i && "rotate-180 text-brand-400"
                  )} 
                />
              </button>
              
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-surface-400 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
