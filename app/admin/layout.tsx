import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';

export default async function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    redirect('/dashboard');
  }

  return (
    <AdminLayout userName={profile?.full_name ?? 'Admin'} userEmail={user.email ?? ''}>
      {children}
    </AdminLayout>
  );
}
