'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Card3D } from '@/components/ui/Card3D';
import { SciFiPanel } from '@/components/ui/SciFiPanel';
import { MovingBorderButton } from '@/components/ui/MovingBorderButton';

const charities = [
  {
    name: 'Save the Children',
    category: 'Children',
    raised: '$9,800',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&auto=format',
    color: 'from-brand-500/20 to-brand-600/5',
    supporters: 142,
  },
  {
    name: 'Ocean Conservancy',
    category: 'Environment',
    raised: '$7,420',
    image: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=600&auto=format',
    color: 'from-emerald-500/20 to-emerald-600/5',
    supporters: 98,
  },
  {
    name: 'Doctors Without Borders',
    category: 'Healthcare',
    raised: '$11,360',
    image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=600&auto=format',
    color: 'from-accent-500/20 to-accent-600/5',
    supporters: 183,
  },
  {
    name: 'World Wildlife Fund',
    category: 'Wildlife',
    raised: '$6,100',
    image: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=600&auto=format',
    color: 'from-brand-500/20 to-accent-500/5',
    supporters: 87,
  },
];

export default function FeaturedCharities() {
  return (
    <section id="charities" className="section relative overflow-hidden bg-surface-950/50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4"
        >
          <div>
            <span className="badge mb-4">Causes We Support</span>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
              Featured <span className="gradient-text">Charities</span>
            </h2>
          </div>
          <Link href="/charities" className="btn-secondary text-sm whitespace-nowrap self-start sm:self-auto">
            View All Causes
            <ExternalLink className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {charities.map((charity, i) => (
            <motion.div
              key={charity.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Card3D className="h-full">
                <SciFiPanel className="h-full cursor-pointer hover:shadow-[0_0_20px_rgba(0,224,255,0.3)] transition-shadow">
                  <div className="flex flex-col h-full">
                    {/* Image */}
                    <div className="relative h-44 overflow-hidden mx-[-24px] mt-[-24px] mb-4">
                      <Image
                        src={charity.image}
                        alt={charity.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-60 mix-blend-screen group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-surface-900 to-transparent" />
                      <span className="absolute top-3 left-3 bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 text-xs px-2 py-1 rounded tracking-widest uppercase">{charity.category}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-between">
                      <h3 className="text-brand-400 font-bold text-xs mb-4 leading-snug uppercase tracking-widest">{charity.name}</h3>
                      <div className="flex items-center justify-between border-t border-white/10 pt-4">
                        <div>
                          <div className="text-xl font-mono font-black text-white drop-shadow-[0_0_5px_currentColor]">{charity.raised}</div>
                          <div className="text-surface-500 text-[10px] uppercase tracking-widest mt-1">RAISED</div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-mono font-bold text-sm drop-shadow-[0_0_5px_currentColor]">{charity.supporters}</div>
                          <div className="text-surface-500 text-[10px] uppercase tracking-widest mt-1">SUPPORTERS</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </SciFiPanel>
              </Card3D>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-10"
        >
          <Link href="/register">
            <MovingBorderButton containerClassName="h-14" className="px-8 flex items-center gap-2">
              Choose Your Cause & Subscribe
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </MovingBorderButton>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
