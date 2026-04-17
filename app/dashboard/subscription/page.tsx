import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import SubscriptionClient from './SubscriptionClient';

export default async function SubscriptionPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_status, subscription_plan, subscription_current_period_end')
    .eq('id', user.id)
    .single();

  return (
    <SubscriptionClient
      currentStatus={profile?.subscription_status}
      currentPlan={profile?.subscription_plan}
      periodEnd={profile?.subscription_current_period_end}
    />
  );
}
