import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { createClient } from '@/lib/supabase/server';
import { Search, Globe, Heart, ExternalLink } from 'lucide-react';
import Image from 'next/image';

export const metadata = {
  title: 'Browse Charities',
  description: 'Explore all the causes you can support through your BirdiePay subscription.',
};

const CATEGORIES = ['All', 'Children', 'Environment', 'Healthcare', 'Wildlife', 'Hunger', 'Housing', 'Education'];

export const dynamic = 'force-dynamic';

// Fallback charities shown when DB is empty
const MOCK_CHARITIES = [
  {
    id: 'mock-1',
    name: 'Save the Children',
    category: 'Children',
    description: 'Save the Children gives children a healthy start in life, the opportunity to learn and protection from harm. When a major crisis strikes, we are always among the first to respond.',
    total_raised: 9800,
    image_url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&auto=format',
    website_url: 'https://www.savethechildren.org',
    is_active: true,
  },
  {
    id: 'mock-2',
    name: 'Ocean Conservancy',
    category: 'Environment',
    description: 'Ocean Conservancy is a nonprofit environmental advocacy organisation based in Washington, D.C. dedicated to protecting the oceans from today\'s greatest global challenges.',
    total_raised: 7420,
    image_url: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=600&auto=format',
    website_url: 'https://oceanconservancy.org',
    is_active: true,
  },
  {
    id: 'mock-3',
    name: 'Doctors Without Borders',
    category: 'Healthcare',
    description: 'Médecins Sans Frontières provides emergency medical care to people affected by conflict, epidemics, disasters, or exclusion from healthcare in over 70 countries.',
    total_raised: 11360,
    image_url: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=600&auto=format',
    website_url: 'https://www.msf.org/',
    is_active: true,
  },
  {
    id: 'mock-4',
    name: 'World Wildlife Fund',
    category: 'Wildlife',
    description: 'WWF works to sustain the natural world for the benefit of people and wildlife, leading conservation efforts to protect threatened species and their habitats.',
    total_raised: 6100,
    image_url: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=600&auto=format',
    website_url: 'https://www.wwf.org',
    is_active: true,
  },
  {
    id: 'mock-5',
    name: 'Action Against Hunger',
    category: 'Hunger',
    description: 'Action Against Hunger leads the global movement to end hunger. We innovate solutions, advocate for change, and reach 25 million people every year with life-saving programs.',
    total_raised: 5200,
    image_url: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=600&auto=format',
    website_url: 'https://www.actionagainsthunger.org',
    is_active: true,
  },
  {
    id: 'mock-6',
    name: 'Habitat for Humanity',
    category: 'Housing',
    description: 'Habitat for Humanity is a global nonprofit housing organization working in local communities across all 50 states and in approximately 70 countries.',
    total_raised: 4750,
    image_url: 'https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=600&auto=format',
    website_url: 'https://www.habitat.org',
    is_active: true,
  },
];

export default async function CharitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  let query = supabase.from('charities').select('*').eq('is_active', true);

  if (params.category && params.category !== 'All') {
    query = query.eq('category', params.category);
  }

  const { data: dbCharities } = await query.order('total_raised', { ascending: false });

  // Use DB charities if available, else use mock data
  const sourceCharities = (dbCharities && dbCharities.length > 0) ? dbCharities : MOCK_CHARITIES;

  const filtered = params.q
    ? sourceCharities.filter(
        (c: { name: string; description: string }) =>
          c.name.toLowerCase().includes(params.q!.toLowerCase()) ||
          c.description.toLowerCase().includes(params.q!.toLowerCase())
      )
    : params.category && params.category !== 'All'
    ? sourceCharities.filter((c: { category: string }) => c.category === params.category)
    : sourceCharities;

  const accentColor = 'rgba(0, 224, 255, 0.6)';
  const panelStyle = {
    background: 'linear-gradient(135deg, rgba(8,17,30,0.96) 0%, rgba(4,9,17,0.99) 100%)',
    border: '1px solid rgba(0, 224, 255, 0.12)',
    boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
    clipPath: 'polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)',
  };

  return (
    <div className="min-h-screen" style={{ background: '#040911' }}>
      {/* Cyber grid background */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(0,224,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,224,255,0.025) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />
      <Navbar />
      <main className="pt-28 pb-20 relative z-10">
        <div className="container-custom">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-[10px] font-mono uppercase tracking-widest text-brand-400 border border-brand-500/25 bg-brand-500/10">
              <Heart className="w-3 h-3" /> Verified Charities
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              Choose Your{' '}
              <span style={{ color: '#00e0ff', textShadow: '0 0 20px rgba(0,224,255,0.4)' }}>Cause</span>
            </h1>
            <p className="text-surface-400 text-base max-w-xl mx-auto">
              Every subscription contributes a minimum of 10% to the charity you choose. Small amounts, massive impact.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <form className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
              <input
                name="q"
                defaultValue={params?.q}
                placeholder="Search charities..."
                className="w-full pl-10 pr-4 py-2.5 text-sm font-mono text-surface-300 bg-surface-900/50 border border-brand-500/15 focus:outline-none focus:border-brand-500/40 placeholder:text-surface-600 transition-colors"
                style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
              />
              <input type="hidden" name="category" value={params?.category ?? 'All'} />
            </form>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <a
                  key={cat}
                  href={`/charities?category=${cat}${params?.q ? `&q=${params.q}` : ''}`}
                  className="px-3.5 py-2 text-xs font-mono uppercase tracking-widest border transition-all duration-200"
                  style={{
                    clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)',
                    background: (params?.category ?? 'All') === cat ? 'rgba(0,224,255,0.12)' : 'transparent',
                    borderColor: (params?.category ?? 'All') === cat ? 'rgba(0,224,255,0.4)' : 'rgba(255,255,255,0.08)',
                    color: (params?.category ?? 'All') === cat ? '#00e0ff' : '#5380b8',
                  }}
                >
                  {cat}
                </a>
              ))}
            </div>
          </div>

          {/* Count */}
          <p className="text-surface-600 text-xs font-mono uppercase tracking-widest mb-6">
            {filtered.length} cause{filtered.length !== 1 ? 's' : ''} found
          </p>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="w-12 h-12 text-surface-700 mx-auto mb-3" />
              <p className="text-surface-500 font-mono text-sm">No charities matching your search</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((charity: {
                id: string | number;
                name: string;
                category: string;
                description: string;
                total_raised: number;
                image_url: string | null;
                website_url?: string | null;
              }) => (
                <div key={charity.id} className="group hover:-translate-y-1 transition-transform duration-300">
                  <div style={panelStyle} className="h-full flex flex-col overflow-hidden relative">
                    {/* Accent line */}
                    <div className="absolute top-0 left-0 right-0 h-[1.5px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,224,255,0.4), transparent)' }} />

                    {/* Image */}
                    <div className="relative h-44 overflow-hidden flex-shrink-0">
                      <Image
                        src={charity.image_url ?? 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&auto=format'}
                        alt={String(charity.name)}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-60 group-hover:opacity-80"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#040911] via-[#040911]/40 to-transparent" />
                      <div
                        className="absolute top-3 left-3 text-[10px] font-mono uppercase tracking-widest px-2.5 py-1"
                        style={{
                          background: 'rgba(0,224,255,0.1)',
                          border: '1px solid rgba(0,224,255,0.3)',
                          color: '#00e0ff',
                          clipPath: 'polygon(3px 0, 100% 0, 100% calc(100% - 3px), calc(100% - 3px) 100%, 0 100%, 0 3px)',
                        }}
                      >
                        {charity.category}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-white font-mono font-bold text-sm mb-2 uppercase tracking-wider">{charity.name}</h3>
                      <p className="text-surface-500 text-xs leading-relaxed mb-4 flex-1 line-clamp-3">
                        {charity.description}
                      </p>

                      {/* Raised stat */}
                      <div
                        className="flex items-center justify-between py-3 px-3 mb-4"
                        style={{ background: 'rgba(0,255,170,0.04)', border: '1px solid rgba(0,255,170,0.12)' }}
                      >
                        <span className="text-[10px] font-mono uppercase tracking-widest text-surface-600">Total Raised</span>
                        <span
                          className="text-lg font-mono font-black"
                          style={{ color: '#00ffaa', textShadow: '0 0 8px rgba(0,255,170,0.5)' }}
                        >
                          ${charity.total_raised.toFixed(0)}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <a
                          href="/register"
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-mono font-bold uppercase tracking-widest text-black transition-all duration-200"
                          style={{
                            background: 'rgba(0,224,255,0.85)',
                            clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
                            boxShadow: '0 0 10px rgba(0,224,255,0.3)',
                          }}
                        >
                          <Heart className="w-3 h-3" />
                          Support
                        </a>
                        {charity.website_url && (
                          <a
                            href={charity.website_url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-center gap-1 px-3 text-xs font-mono uppercase tracking-widest text-surface-400 hover:text-brand-400 transition-colors"
                            style={{
                              border: '1px solid rgba(255,255,255,0.08)',
                              clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
                            }}
                          >
                            <Globe className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
