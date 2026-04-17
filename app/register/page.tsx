'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import {
  Eye, EyeOff, Zap, ArrowRight, Loader2,
  Check, Heart, ChevronDown
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { Charity } from '@/types/database';
import { cn } from '@/lib/utils';

const schema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  charityId: z.string().min(1, 'Please select a charity'),
  charityPercentage: z.number().min(10, 'Minimum 10%').max(100),
  agree: z.boolean().refine((v) => v, 'You must agree to the terms'),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [charities, setCharities] = useState<Charity[]>([]);
  const [selectedCharity, setSelectedCharity] = useState<Charity | null>(null);
  const [percentage, setPercentage] = useState(10);
  const [step, setStep] = useState<1 | 2>(1);

  const { register, handleSubmit, watch, setValue, trigger, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { charityPercentage: 10 },
  });

  useEffect(() => {
    supabase
      .from('charities')
      .select('*')
      .eq('is_active', true)
      .then(({ data }) => {
        if (data) setCharities(data);
      });
  }, []);

  const handleNextStep = async () => {
    const ok = await trigger(['fullName', 'email', 'password']);
    if (ok) setStep(2);
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email.trim(),
        password: data.password,
        options: {
          data: {
            full_name: data.fullName.trim(),
            charity_id: data.charityId,
            charity_percentage: data.charityPercentage,
          },
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      // Update profile with charity info
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('profiles')
          .update({
            full_name: data.fullName,
            charity_id: data.charityId,
            charity_percentage: data.charityPercentage,
          })
          .eq('id', user.id);
      }

      toast.success('Account created! Choose your subscription plan.');
      router.push('/dashboard');
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen animated-bg flex items-center justify-center p-4">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-brand-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-accent-600/15 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-lg"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-glow">
              <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-xl tracking-tight">
              Digital<span className="gradient-text">Heros</span>
            </span>
          </Link>
          <h1 className="text-3xl font-black text-white">Create your account</h1>
          <p className="text-surface-400 text-sm mt-2">Join 2,847 players making an impact</p>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mt-5">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300',
                  step >= s
                    ? 'bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-glow'
                    : 'bg-white/10 text-surface-500'
                )}>
                  {step > s ? <Check className="w-3.5 h-3.5" /> : s}
                </div>
                {s < 2 && <div className={cn('w-12 h-0.5 rounded-full transition-all duration-300', step > s ? 'bg-brand-500' : 'bg-white/10')} />}
              </div>
            ))}
          </div>
        </div>

        <div className="glass-strong rounded-3xl p-8 border border-white/10">
          <form onSubmit={handleSubmit(onSubmit)}>
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <h2 className="text-lg font-bold text-white mb-2">Your Details</h2>

                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-1.5">Full name</label>
                  <input {...register('fullName')} placeholder="James Whitfield" className="input-base" />
                  {errors.fullName && <p className="mt-1.5 text-xs text-red-400">{errors.fullName.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-1.5">Email address</label>
                  <input {...register('email')} type="email" placeholder="you@example.com" className="input-base" />
                  {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min 8 characters"
                      className="input-base pr-11"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-300">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>}
                </div>

                <button type="button" onClick={handleNextStep} className="btn-primary w-full py-3.5 text-base mt-2">
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-5"
              >
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-bold text-white">Choose Your Charity</h2>
                  <button type="button" onClick={() => setStep(1)} className="text-xs text-surface-500 hover:text-surface-300">
                    ← Back
                  </button>
                </div>

                {/* Charity selector */}
                <div className="grid grid-cols-1 gap-2.5 max-h-52 overflow-y-auto no-scrollbar pr-1">
                  {charities.length === 0 ? (
                    // Demo charities when DB not connected
                    [
                      { id: 'c1', name: 'Save the Children', category: 'Children' },
                      { id: 'c2', name: 'Ocean Conservancy', category: 'Environment' },
                      { id: 'c3', name: 'Doctors Without Borders', category: 'Healthcare' },
                      { id: 'c4', name: 'World Wildlife Fund', category: 'Wildlife' },
                    ].map((c) => (
                      <button
                        type="button"
                        key={c.id}
                        onClick={() => {
                          setSelectedCharity(c as unknown as Charity);
                          setValue('charityId', c.id);
                        }}
                        className={cn(
                          'flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-200 text-left',
                          watch('charityId') === c.id
                            ? 'border-brand-500/60 bg-brand-500/10'
                            : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                        )}
                      >
                        <div className={cn(
                          'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all',
                          watch('charityId') === c.id ? 'border-brand-400 bg-brand-500' : 'border-white/20'
                        )}>
                          {watch('charityId') === c.id && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{c.name}</div>
                          <div className="text-xs text-surface-500">{c.category}</div>
                        </div>
                      </button>
                    ))
                  ) : charities.map((c) => (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => { setSelectedCharity(c); setValue('charityId', c.id); }}
                      className={cn(
                        'flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-200 text-left',
                        watch('charityId') === c.id
                          ? 'border-brand-500/60 bg-brand-500/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      )}
                    >
                      <div className={cn('w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all', watch('charityId') === c.id ? 'border-brand-400 bg-brand-500' : 'border-white/20')}>
                        {watch('charityId') === c.id && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{c.name}</div>
                        <div className="text-xs text-surface-500">{c.category}</div>
                      </div>
                    </button>
                  ))}
                </div>
                {errors.charityId && <p className="mt-1 text-xs text-red-400">{errors.charityId.message}</p>}

                {/* Charity % slider */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-surface-300 flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-accent-400" />
                      Charity contribution
                    </label>
                    <span className="text-brand-400 font-bold text-sm">{percentage}%</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={50}
                    step={5}
                    value={percentage}
                    onChange={(e) => {
                      const v = parseInt(e.target.value);
                      setPercentage(v);
                      setValue('charityPercentage', v);
                    }}
                    className="w-full h-2 rounded-full appearance-none bg-white/10 cursor-pointer accent-brand-500"
                  />
                  <div className="flex justify-between text-xs text-surface-600 mt-1">
                    <span>10% (min)</span>
                    <span>50%</span>
                  </div>
                </div>

                {/* Terms */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    {...register('agree')}
                    type="checkbox"
                    className="mt-0.5 w-4 h-4 rounded accent-brand-500"
                  />
                  <span className="text-surface-400 text-xs leading-relaxed">
                    I agree to the{' '}
                    <Link href="/terms" className="text-brand-400 hover:underline">Terms of Service</Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-brand-400 hover:underline">Privacy Policy</Link>
                  </span>
                </label>
                {errors.agree && <p className="text-xs text-red-400">{errors.agree.message}</p>}

                <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base mt-1">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (<>Create Account <ArrowRight className="w-4 h-4" /></>)}
                </button>
              </motion.div>
            )}
          </form>

          <p className="text-center text-surface-500 text-sm mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-brand-400 hover:text-brand-300 font-medium">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
