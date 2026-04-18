'use client';

import { useState, useTransition } from 'react';
import { motion } from 'framer-motion';
import { User, Save, Check, Camera } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

// Predefined cartoon avatar seeds using DiceBear Avataaars
const AVATARS = [
  { id: 'birdie1',  url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=birdie1&backgroundColor=b6e3f4',    label: 'Ace' },
  { id: 'archer2', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=archer2&backgroundColor=ffd5dc',   label: 'Eagle' },
  { id: 'golfer3', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=golfer3&backgroundColor=d1f4cc',   label: 'Birdie' },
  { id: 'champ4',  url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=champ4&backgroundColor=c0aede',    label: 'Champ' },
  { id: 'hero5',   url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hero5&backgroundColor=ffd5dc',     label: 'Hero' },
  { id: 'pro6',    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pro6&backgroundColor=b6e3f4',      label: 'Pro' },
  { id: 'legend7', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=legend7&backgroundColor=d1f4cc',   label: 'Legend' },
  { id: 'pixel8',  url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=pixel8&backgroundColor=ffd5dc',    label: 'Pixel' },
  { id: 'bot9',    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=bot9&backgroundColor=b6e3f4',         label: 'Bot' },
  { id: 'fun10',   url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=fun10&backgroundColor=d1f4cc',     label: 'Fun' },
  { id: 'notio11', url: 'https://api.dicebear.com/7.x/notionists/svg?seed=notio11&backgroundColor=c0aede',  label: 'Artist' },
  { id: 'lorel12', url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=lorel12&backgroundColor=ffd5dc',     label: 'Star' },
];

interface ProfileClientProps {
  initialName: string;
  initialAvatar: string | null;
  userEmail: string;
}

export default function ProfileClient({ initialName, initialAvatar, userEmail }: ProfileClientProps) {
  const [name, setName] = useState(initialName);
  const [selectedAvatar, setSelectedAvatar] = useState<string>(initialAvatar ?? AVATARS[0].url);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSave = () => {
    startTransition(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { toast.error('Not logged in'); return; }

      const { error } = await supabase
        .from('profiles')
        .update({ full_name: name.trim(), avatar_url: selectedAvatar })
        .eq('id', user.id);

      if (error) {
        toast.error('Failed to save profile');
        return;
      }

      setSaved(true);
      toast.success('Profile updated!');
      setTimeout(() => { setSaved(false); router.refresh(); }, 1500);
    });
  };

  const accentStyle = { color: '#00e0ff', textShadow: '0 0 8px rgba(0,224,255,0.5)' };
  const panelStyle = {
    background: 'linear-gradient(135deg, rgba(8,17,30,0.98), rgba(4,9,17,0.99))',
    border: '1px solid rgba(0,224,255,0.12)',
    boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
    clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)',
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-surface-500 mb-1">Account Settings</p>
        <h1 className="text-2xl font-mono font-black text-white uppercase tracking-tight">
          Edit <span style={accentStyle}>Profile</span>
        </h1>
      </div>

      {/* Current avatar preview */}
      <motion.div
        style={panelStyle}
        className="p-6 relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="absolute top-0 left-0 right-0 h-[1.5px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,224,255,0.4), transparent)' }} />
        
        <div className="flex items-center gap-5">
          {/* Live preview */}
          <div className="relative flex-shrink-0">
            <div
              className="w-20 h-20 overflow-hidden"
              style={{
                background: 'rgba(0,224,255,0.08)',
                border: '2px solid rgba(0,224,255,0.3)',
                clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
                boxShadow: '0 0 20px rgba(0,224,255,0.2)',
              }}
            >
              <img src={selectedAvatar} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div
              className="absolute -bottom-1 -right-1 w-6 h-6 flex items-center justify-center"
              style={{ background: '#00e0ff', clipPath: 'polygon(3px 0, 100% 0, 100% calc(100% - 3px), calc(100% - 3px) 100%, 0 100%, 0 3px)' }}
            >
              <Camera className="w-3 h-3 text-black" />
            </div>
          </div>

          <div className="flex-1">
            <p className="text-[10px] font-mono uppercase tracking-widest text-surface-500 mb-1">Display Name</p>
            <p className="text-xs font-mono text-surface-400 mb-3">{userEmail}</p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name..."
              className="w-full px-4 py-2.5 text-sm font-mono text-white placeholder:text-surface-600 bg-transparent focus:outline-none transition-colors"
              style={{
                border: '1px solid rgba(0,224,255,0.2)',
                clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
                background: 'rgba(0,224,255,0.04)',
              }}
              onFocus={(e) => { e.target.style.borderColor = 'rgba(0,224,255,0.5)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'rgba(0,224,255,0.2)'; }}
            />
          </div>
        </div>
      </motion.div>

      {/* Avatar picker */}
      <motion.div
        style={panelStyle}
        className="p-6 relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="absolute top-0 left-0 right-0 h-[1.5px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,190,26,0.4), transparent)' }} />

        <p className="text-[10px] font-mono uppercase tracking-widest text-surface-500 mb-1">Choose Avatar</p>
        <p className="text-xs font-mono text-surface-600 mb-5">Select a cartoon character for your profile</p>

        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
          {AVATARS.map((avatar) => {
            const isSelected = selectedAvatar === avatar.url;
            return (
              <button
                key={avatar.id}
                onClick={() => setSelectedAvatar(avatar.url)}
                className="group flex flex-col items-center gap-1.5 transition-transform duration-200 hover:-translate-y-0.5"
              >
                <div
                  className="w-14 h-14 overflow-hidden transition-all duration-200"
                  style={{
                    background: isSelected ? 'rgba(0,224,255,0.12)' : 'rgba(255,255,255,0.04)',
                    border: isSelected ? '2px solid rgba(0,224,255,0.6)' : '1px solid rgba(255,255,255,0.06)',
                    clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
                    boxShadow: isSelected ? '0 0 12px rgba(0,224,255,0.3)' : 'none',
                  }}
                >
                  <img src={avatar.url} alt={avatar.label} className="w-full h-full object-cover" />
                </div>
                <span
                  className="text-[9px] font-mono uppercase tracking-wider"
                  style={{ color: isSelected ? '#00e0ff' : '#264f86' }}
                >
                  {avatar.label}
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.button
        onClick={handleSave}
        disabled={isPending || !name.trim()}
        className="w-full py-4 flex items-center justify-center gap-2 font-mono font-black text-sm uppercase tracking-widest text-black transition-all duration-200 disabled:opacity-40"
        style={{
          background: saved ? '#00ffaa' : '#00e0ff',
          clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
          boxShadow: `0 0 20px ${saved ? 'rgba(0,255,170,0.4)' : 'rgba(0,224,255,0.4)'}`,
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {saved ? (
          <><Check className="w-4 h-4" /> Profile Saved!</>
        ) : isPending ? (
          <><div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Saving...</>
        ) : (
          <><Save className="w-4 h-4" /> Save Profile</>
        )}
      </motion.button>
    </div>
  );
}
