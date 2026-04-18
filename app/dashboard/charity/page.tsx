'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Heart, Globe, ExternalLink, Loader2, Check, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { Charity } from '@/types/database';
import { cn } from '@/lib/utils';

export default function DashboardCharityPage() {
  const supabase = createClient();
  const [charities, setCharities] = useState<Charity[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [percentage, setPercentage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const init = async () => {
      const [charRes, profileRes] = await Promise.all([
        supabase.from('charities').select('*').eq('is_active', true).order('name'),
        supabase.auth.getUser().then(({ data: { user } }: { data: { user: any } }) =>
          user ? supabase.from('profiles').select('charity_id, charity_percentage').eq('id', user.id).single() : null
        ),
      ]);
      setCharities(charRes.data ?? []);
      if (profileRes?.data) {
        setSelectedId(profileRes.data.charity_id);
        setPercentage(profileRes.data.charity_percentage ?? 10);
      }
      setLoading(false);
    };
    init();
  }, []);

  const save = async () => {
    if (!selectedId) { toast.error('Please select a charity'); return; }
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('profiles').update({
      charity_id: selectedId,
      charity_percentage: percentage,
    }).eq('id', user.id);

    if (error) toast.error(error.message);
    else toast.success('Charity preferences saved!');
    setSaving(false);
  };

  const selected = charities.find((c) => c.id === selectedId);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white">Charity Preferences</h1>
        <p className="text-surface-400 text-sm mt-1">Choose your cause and set your monthly contribution</p>
      </div>

      {/* Current contribution preview */}
      {selected && (
        <div className="glass-strong rounded-2xl p-6 border border-accent-500/25 bg-accent-500/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-accent-500/20 flex items-center justify-center">
              <Heart className="w-5 h-5 text-accent-400" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">{selected.name}</p>
              <p className="text-surface-400 text-xs">{selected.category}</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-surface-400">Your monthly contribution</span>
            <span className="text-accent-400 font-black text-xl">
              £{((9 * percentage) / 100).toFixed(2)}
            </span>
          </div>
          <p className="text-surface-600 text-xs mt-1">{percentage}% of £9 monthly plan</p>
        </div>
      )}

      {/* Charity grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 gap-3">
          {[1,2,3,4,5,6].map((i) => <div key={i} className="skeleton h-20 rounded-2xl" />)}
        </div>
      ) : (
        <div>
          <h3 className="text-sm font-semibold text-surface-400 uppercase tracking-wider mb-3">Select a Charity</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {charities.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className={cn(
                  'flex items-start gap-3.5 p-4 rounded-2xl border text-left transition-all duration-200 hover:-translate-y-0.5',
                  selectedId === c.id
                    ? 'border-accent-500/50 bg-accent-500/10'
                    : 'border-white/10 glass hover:border-white/20'
                )}
              >
                <div className={cn(
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all',
                  selectedId === c.id ? 'border-accent-400 bg-accent-500' : 'border-surface-600'
                )}>
                  {selectedId === c.id && <Check className="w-3 h-3 text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-white">{c.name}</span>
                    <span className="badge text-xs flex-shrink-0">{c.category}</span>
                  </div>
                  <p className="text-surface-500 text-xs mt-1 leading-relaxed line-clamp-2">{c.description}</p>
                  <p className="text-emerald-400 text-xs mt-1.5">£{c.total_raised.toFixed(0)} raised total</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Percentage slider */}
      <div className="card-elevated rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Heart className="w-4 h-4 text-accent-400" />
            Contribution Percentage
          </h3>
          <span className="text-accent-400 text-2xl font-black">{percentage}%</span>
        </div>

        <input
          type="range"
          min={10}
          max={50}
          step={5}
          value={percentage}
          onChange={(e) => setPercentage(parseInt(e.target.value))}
          className="w-full h-2 rounded-full appearance-none bg-white/10 cursor-pointer accent-accent-500 mb-3"
        />
        <div className="flex justify-between text-xs text-surface-600 mb-5">
          <span>10% min</span>
          <span>50% max</span>
        </div>

        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-white/5 border border-white/10">
          <AlertCircle className="w-4 h-4 text-surface-500 flex-shrink-0 mt-0.5" />
          <p className="text-surface-500 text-xs leading-relaxed">
            A minimum of 10% of your subscription goes to charity. Increasing this reduces the portion going into the prize pool.
            Contributions are sent monthly to your chosen charity.
          </p>
        </div>
      </div>

      <button onClick={save} disabled={saving || !selectedId} className="btn-primary w-full py-4 text-base">
        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : (<><Check className="w-5 h-5" />Save Charity Preferences</>)}
      </button>
    </div>
  );
}
