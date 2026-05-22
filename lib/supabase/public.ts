import { createClient } from '@supabase/supabase-js';

// Static anon client for public, non-personalized reads.
// Safe to share across requests because it carries no user session.
// Used inside unstable_cache wrappers — must not depend on cookies().
export const publicSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
);
