import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { createClient } from '@/lib/supabase/server';
import type { Charity } from '@/types/database';
import { Search, Globe, Heart, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from 'react';

export const metadata = {
  title: 'Browse Charities',
  description: 'Explore all the causes you can support through your DigitalHeros subscription.',
};

const CATEGORIES = ['All', 'Children', 'Environment', 'Healthcare', 'Wildlife', 'Hunger', 'Housing', 'Education'];

export const dynamic = 'force-dynamic';

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

  const { data: charities } = await query.order('total_raised', { ascending: false });

  const filtered = params.q
    ? (charities ?? []).filter(
      (c: { name: string; description: string; }) =>
        c.name.toLowerCase().includes(params.q!.toLowerCase()) ||
        c.description.toLowerCase().includes(params.q!.toLowerCase())
    )
    : (charities ?? []);

  return (
    <div className="min-h-screen bg-surface-950">
      <Navbar />
      <main className="pt-28 pb-20">
        <div className="container-custom">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="badge mb-4">Verified Charities</span>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              Choose Your <span className="gradient-text">Cause</span>
            </h1>
            <p className="text-surface-400 text-lg max-w-xl mx-auto">
              Every subscription contributes a minimum of 10% to the charity you choose. Small amounts, massive impact.
            </p>
          </div>

          {/* Filters (client-side via URL search params) */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <form className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
              <input
                name="q"
                defaultValue={params?.q}
                placeholder="Search charities..."
                className="input-base pl-10 w-full"
              />
              <input type="hidden" name="category" value={params?.category ?? 'All'} />
            </form>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <a
                  key={cat}
                  href={`/charities?category=${cat}${params?.q ? `&q=${params.q}` : ''}`}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all duration-200 ${(params?.category ?? 'All') === cat
                      ? 'bg-brand-500/20 border-brand-500/40 text-brand-300'
                      : 'border-white/10 text-surface-400 hover:border-white/20 hover:text-white'
                    }`}
                >
                  {cat}
                </a>
              ))}
            </div>
          </div>

          {/* Results count */}
          <p className="text-surface-500 text-sm mb-6">{filtered.length} charit{filtered.length !== 1 ? 'ies' : 'y'} found</p>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="w-12 h-12 text-surface-700 mx-auto mb-3" />
              <p className="text-surface-400">No charities found matching your criteria</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((charity: { id: Key | null | undefined; image_url: string | StaticImport; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; category: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; description: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; total_raised: number; website_url: string | undefined; }) => (
                <div
                  key={charity.id}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 bg-surface-900/80"
                >
                  {/* Image */}
                  {charity.image_url && (
                    <div className="relative h-44 overflow-hidden">
                      <Image
                        src={charity.image_url}
                        alt={String(charity.name ?? '')}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-surface-950 to-transparent" />
                      <span className="absolute top-3 left-3 badge text-xs">{charity.category}</span>
                    </div>
                  )}

                  <div className="p-5">
                    <h3 className="text-white font-bold text-base mb-2">{charity.name}</h3>
                    <p className="text-surface-400 text-xs leading-relaxed mb-4 line-clamp-3">{charity.description}</p>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm mb-4">
                      <div>
                        <div className="text-emerald-400 font-black text-lg">£{charity.total_raised.toFixed(0)}</div>
                        <div className="text-surface-600 text-xs">raised</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <a href="/register" className="btn-primary text-xs py-2 px-4 flex-1 justify-center">
                        <Heart className="w-3.5 h-3.5" />
                        Support This
                      </a>
                      {charity.website_url && (
                        <a
                          href={charity.website_url}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-secondary text-xs py-2 px-3"
                        >
                          <Globe className="w-3.5 h-3.5" />
                        </a>
                      )}
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
