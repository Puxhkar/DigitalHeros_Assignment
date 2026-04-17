import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';
import { mockClient } from './mock';

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isMock = !url || url.includes('your-project');
  
  if (isMock) {
    return mockClient as any;
  }

  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
