'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import {
  Plus, Trash2, Calendar, BarChart2, Loader2,
  TrendingUp, TrendingDown, Minus, Info, CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatDate } from '@/lib/utils';
import type { Score } from '@/types/database';
import { cn } from '@/lib/utils';

const schema = z.object({
  score: z
    .number({ invalid_type_error: 'Score must be a number' })
    .int('Score must be a whole number')
    .min(1, 'Minimum score is 1')
    .max(45, 'Maximum score is 45'),
  date_played: z.string().min(1, 'Please select a date'),
});

type FormData = z.infer<typeof schema>;

function ScoreBadge({ score }: { score: number }) {
  if (score >= 36) return <span className="badge-emerald text-xs">Excellent</span>;
  if (score >= 28) return <span className="badge text-xs">Good</span>;
  if (score >= 20) return <span className="badge-accent text-xs">Average</span>;
  return <span className="px-2 py-0.5 rounded-full text-xs bg-surface-700 text-surface-400 border border-white/10">Below Avg</span>;
}

export default function ScoresPage() {
  const supabase = createClient();
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, reset, formState: { errors }, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { date_played: new Date().toISOString().split('T')[0] },
  });

  const watchedScore = watch('score');

  const fetchScores = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', user.id)
      .order('date_played', { ascending: false });
    setScores(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchScores(); }, []);

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast.error('Not authenticated'); setSubmitting(false); return; }

    // Check 1 score per day
    const { data: existingScore } = await supabase
      .from('scores')
      .select('id')
      .eq('user_id', user.id)
      .eq('date_played', data.date_played)
      .single();

    if (existingScore) {
      toast.error('You already have a score for this date');
      setSubmitting(false);
      return;
    }

    const { error } = await supabase.from('scores').insert({
      user_id: user.id,
      score: data.score,
      date_played: data.date_played,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Score added! Rolling window updated.');
      reset({ date_played: new Date().toISOString().split('T')[0] });
      setShowForm(false);
      fetchScores();
    }
    setSubmitting(false);
  };

  const deleteScore = async (id: string) => {
    setDeletingId(id);
    const { error } = await supabase.from('scores').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete score');
    } else {
      toast.success('Score removed');
      setScores(scores.filter((s) => s.id !== id));
    }
    setDeletingId(null);
  };

  const avg = scores.length > 0 ? (scores.reduce((s, sc) => s + sc.score, 0) / scores.length).toFixed(1) : '-';
  const highest = scores.length > 0 ? Math.max(...scores.map((s) => s.score)) : null;
  const trend = scores.length > 1 ? scores[0].score - scores[1].score : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">My Scores</h1>
          <p className="text-surface-400 text-sm mt-1">Your last 5 Stableford scores — older ones are auto-removed</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowForm(!showForm)}
          className={cn('btn-primary text-sm', showForm && 'bg-surface-700 hover:bg-surface-600 from-surface-700 to-surface-700 hover:from-surface-600 hover:to-surface-600')}
        >
          {showForm ? 'Cancel' : (<><Plus className="w-4 h-4" /> Add Score</>)}
        </motion.button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Average', value: avg, icon: BarChart2, color: 'text-brand-400' },
          { label: 'Best Score', value: highest ?? '-', icon: TrendingUp, color: 'text-emerald-400' },
          {
            label: 'Trend',
            value: trend === 0 ? '—' : trend > 0 ? `+${trend}` : `${trend}`,
            icon: trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus,
            color: trend > 0 ? 'text-emerald-400' : trend < 0 ? 'text-red-400' : 'text-surface-400'
          },
        ].map((stat) => (
          <div key={stat.label} className="card-elevated rounded-2xl p-4 text-center">
            <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
            <div className="text-2xl font-black text-white">{stat.value}</div>
            <div className="text-surface-500 text-xs">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Add score form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="glass-strong rounded-2xl p-6 border border-brand-500/25 space-y-5">
              <h3 className="text-white font-bold">Log a New Score</h3>

              <div className="grid grid-cols-2 gap-4">
                {/* Score input */}
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-2">Score (1–45)</label>
                  <div className="relative">
                    <input
                      {...register('score', { valueAsNumber: true })}
                      type="number"
                      min={1}
                      max={45}
                      placeholder="e.g. 32"
                      className="input-base text-2xl font-black text-white text-center pr-16 py-4"
                    />
                    {watchedScore >= 1 && watchedScore <= 45 && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <ScoreBadge score={watchedScore} />
                      </div>
                    )}
                  </div>
                  {errors.score && <p className="mt-1.5 text-xs text-red-400">{errors.score.message}</p>}
                </div>

                {/* Date input */}
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-2">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />Date Played</span>
                  </label>
                  <input
                    {...register('date_played')}
                    type="date"
                    max={new Date().toISOString().split('T')[0]}
                    className="input-base"
                  />
                  {errors.date_played && <p className="mt-1.5 text-xs text-red-400">{errors.date_played.message}</p>}
                </div>
              </div>

              {/* Info note */}
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-brand-500/8 border border-brand-500/20">
                <Info className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                <p className="text-surface-400 text-xs leading-relaxed">
                  Only your last 5 scores are stored. Adding a new one will automatically remove the oldest. Each score must be from a different day.
                </p>
              </div>

              {/* Warning if at limit */}
              {scores.length === 5 && (
                <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-yellow-500/8 border border-yellow-500/25">
                  <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <p className="text-yellow-300/80 text-xs leading-relaxed">
                    You have 5 scores. Adding this one will remove your oldest score ({formatDate(scores[scores.length - 1]?.date_played)}).
                  </p>
                </div>
              )}

              <button type="submit" disabled={submitting} className="btn-primary w-full py-3.5">
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (<><CheckCircle2 className="w-4 h-4" /> Submit Score</>)}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Score list */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-surface-400 uppercase tracking-wider">Score History</h3>
          <span className="text-xs text-surface-600">{scores.length} / 5 scores stored</span>
        </div>

        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-16 rounded-2xl" />
          ))
        ) : scores.length === 0 ? (
          <div className="text-center py-16 card rounded-2xl">
            <BarChart2 className="w-12 h-12 text-surface-700 mx-auto mb-3" />
            <p className="text-surface-400 font-medium">No scores yet</p>
            <p className="text-surface-600 text-sm mt-1">Add your first score to enter the monthly draw</p>
            <button onClick={() => setShowForm(true)} className="btn-primary mt-4 text-sm">
              <Plus className="w-4 h-4" /> Add Score
            </button>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {scores.map((score, i) => (
              <motion.div
                key={score.id}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -30, height: 0 }}
                transition={{ duration: 0.25 }}
                className="flex items-center justify-between p-4 rounded-2xl glass-strong border border-white/10 hover:border-white/20 transition-all duration-200 group"
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500/30 to-brand-600/10 flex items-center justify-center border border-brand-500/25 text-xs font-bold text-brand-400 flex-shrink-0">
                    {i + 1}
                  </div>
                  {/* Date */}
                  <div>
                    <div className="text-sm font-medium text-white flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-surface-600" />
                      {formatDate(score.date_played)}
                    </div>
                    {i === 0 && <span className="text-xs text-brand-400">Most recent</span>}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <ScoreBadge score={score.score} />
                  <div className="text-3xl font-black text-white w-12 text-right">{score.score}</div>
                  <button
                    onClick={() => deleteScore(score.id)}
                    disabled={deletingId === score.id}
                    className="opacity-0 group-hover:opacity-100 p-2 rounded-lg text-surface-600 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
                  >
                    {deletingId === score.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
