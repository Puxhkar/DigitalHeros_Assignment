'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Plus, Edit2, Trash2, X, Loader2, Check,
  Heart, Globe, Tag, ImageIcon
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { Charity } from '@/types/database';
import { cn } from '@/lib/utils';

const CATEGORIES = ['Children', 'Environment', 'Healthcare', 'Wildlife', 'Hunger', 'Housing', 'Education', 'Animals', 'Other'];

function CharityForm({
  initial,
  onSave,
  onClose,
}: {
  initial?: Partial<Charity>;
  onSave: () => void;
  onClose: () => void;
}) {
  const supabase = createClient();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    description: initial?.description ?? '',
    image_url: initial?.image_url ?? '',
    website_url: initial?.website_url ?? '',
    category: initial?.category ?? 'Other',
    is_active: initial?.is_active !== false,
  });

  const handleSave = async () => {
    if (!form.name.trim() || !form.description.trim()) {
      toast.error('Name and description are required');
      return;
    }
    setSaving(true);
    const op = initial?.id
      ? supabase.from('charities').update(form).eq('id', initial.id)
      : supabase.from('charities').insert(form);

    const { error } = await op;
    if (error) toast.error(error.message);
    else { toast.success(initial?.id ? 'Charity updated!' : 'Charity created!'); onSave(); }
    setSaving(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="glass-strong rounded-3xl p-7 border border-white/10 w-full max-w-lg"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">{initial?.id ? 'Edit Charity' : 'Add New Charity'}</h2>
          <button onClick={onClose} className="btn-ghost p-2"><X className="w-4 h-4" /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-surface-300 mb-1.5">Charity Name *</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Save the Children" className="input-base" />
          </div>
          <div>
            <label className="block text-xs font-medium text-surface-300 mb-1.5">Description *</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              placeholder="What does this charity do..."
              className="input-base resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-surface-300 mb-1.5 flex items-center gap-1"><Tag className="w-3 h-3" />Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-base">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-surface-300 mb-1.5 flex items-center gap-1"><Globe className="w-3 h-3" />Website URL</label>
              <input value={form.website_url ?? ''} onChange={(e) => setForm({ ...form, website_url: e.target.value })} placeholder="https://..." className="input-base" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-surface-300 mb-1.5 flex items-center gap-1"><ImageIcon className="w-3 h-3" />Image URL</label>
            <input value={form.image_url ?? ''} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://images.unsplash.com/..." className="input-base" />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setForm({ ...form, is_active: !form.is_active })}
              className={cn('w-10 h-5.5 rounded-full transition-colors duration-200 flex items-center px-0.5', form.is_active ? 'bg-brand-500' : 'bg-surface-600')}
            >
              <div className={cn('w-4 h-4 rounded-full bg-white shadow transition-transform duration-200', form.is_active ? 'translate-x-4.5' : 'translate-x-0')} />
            </div>
            <span className="text-sm text-surface-300">{form.is_active ? 'Active (visible to users)' : 'Inactive (hidden)'}</span>
          </label>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4" />{initial?.id ? 'Update' : 'Create'}</>}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AdminCharitiesPage() {
  const supabase = createClient();
  const [charities, setCharities] = useState<Charity[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Charity | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchCharities = async () => {
    const { data } = await supabase.from('charities').select('*').order('created_at', { ascending: false });
    setCharities(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchCharities(); }, []);

  const deleteCharity = async (id: string) => {
    if (!confirm('Delete this charity? This cannot be undone.')) return;
    setDeletingId(id);
    await supabase.from('charities').delete().eq('id', id);
    toast.success('Charity deleted');
    setCharities((prev) => prev.filter((c) => c.id !== id));
    setDeletingId(null);
  };

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Charities</h1>
          <p className="text-surface-400 text-sm mt-1">{charities.length} charities managed</p>
        </div>
        <button onClick={() => { setEditing(null); setFormOpen(true); }} className="btn-primary text-sm">
          <Plus className="w-4 h-4" /> Add Charity
        </button>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 gap-4">
          {[1,2,3,4].map((i) => <div key={i} className="skeleton h-32 rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          <AnimatePresence initial={false}>
            {charities.map((c) => (
              <motion.div
                key={c.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="card-elevated rounded-2xl p-5 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-bold text-white">{c.name}</h3>
                      <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', c.is_active ? 'bg-emerald-500/15 text-emerald-400' : 'bg-surface-700 text-surface-500')}>
                        {c.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <span className="badge text-xs">{c.category}</span>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => { setEditing(c); setFormOpen(true); }} className="btn-ghost p-2">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => deleteCharity(c.id)} disabled={deletingId === c.id} className="btn-ghost p-2 hover:text-red-400">
                      {deletingId === c.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <p className="text-surface-400 text-xs leading-relaxed line-clamp-2">{c.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-surface-500 flex items-center gap-1"><Heart className="w-3 h-3 text-accent-400" />£{c.total_raised.toFixed(0)} raised</span>
                  {c.website_url && <a href={c.website_url} target="_blank" rel="noreferrer" className="text-brand-400 hover:underline flex items-center gap-1"><Globe className="w-3 h-3" />Website</a>}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {formOpen && (
          <CharityForm
            initial={editing ?? undefined}
            onSave={() => { setFormOpen(false); fetchCharities(); }}
            onClose={() => setFormOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
