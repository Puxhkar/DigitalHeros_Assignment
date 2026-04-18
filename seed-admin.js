const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function seedAdmin() {
  console.log('Fetching users...');
  let user;
  const { data: listData, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error('Error fetching users:', listError);
    return;
  }
  
  const found = listData.users.find(u => u.email === 'admin@digitalheros.com');

  if (found) {
    console.log('User already exists, id:', found.id);
    user = found;
  } else {
    console.log('Creating admin@digitalheros.com...');
    const { data: newData, error: createError } = await supabase.auth.admin.createUser({
      email: 'admin@digitalheros.com',
      password: 'Admin1234!',
      email_confirm: true,
      user_metadata: { full_name: 'System Admin' }
    });
    
    if (createError) {
      console.error('Error creating user:', createError);
      return;
    }
    user = newData.user;
    console.log('User created:', user.id);
  }

  console.log('Updating profiles table role to admin...');
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      email: user.email,
      full_name: 'System Admin',
      role: 'admin',
      subscription_status: 'active',
      updated_at: new Date().toISOString()
    });

  if (profileError) {
    console.error('Profile update error:', profileError);
  } else {
    console.log('Success! Admin role is successfully granted.');
  }
}

seedAdmin().catch(console.error);
