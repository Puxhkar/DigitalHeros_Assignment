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
    .select('full_name, subscription_status')
    .eq('id', user.id)
    .single();

  return (
    <DashboardLayout
      userEmail={user.email ?? ''}
      userName={profile?.full_name ?? user.email?.split('@')[0] ?? 'Player'}
      subscriptionStatus={profile?.subscription_status ?? 'inactive'}
    >
      {children}
    </DashboardLayout>
  );
}
