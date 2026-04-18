import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ProfileClient from './ProfileClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Edit Profile',
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url')
    .eq('id', user.id)
    .single();

  return (
    <ProfileClient
      initialName={profile?.full_name ?? ''}
      initialAvatar={profile?.avatar_url ?? null}
      userEmail={user.email ?? ''}
    />
  );
}
