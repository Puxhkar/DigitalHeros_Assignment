import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default async function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, subscription_status, avatar_url')
    .eq('id', user.id)
    .single();

  // Use saved full_name, fall back to the part before @ in email, then 'Player'
  const displayName = profile?.full_name?.trim()
    ? profile.full_name.trim()
    : user.email?.split('@')[0] ?? 'Player';

  return (
    <DashboardLayout
      userEmail={user.email ?? ''}
      userName={displayName}
      userAvatar={profile?.avatar_url ?? null}
      subscriptionStatus={profile?.subscription_status ?? 'inactive'}
    >
      {children}
    </DashboardLayout>
  );
}
