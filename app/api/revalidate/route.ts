import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { invalidateMenuCache } from '@/lib/db';

export const runtime = 'nodejs';

export async function POST() {
    const supabase = createClient(cookies());
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    invalidateMenuCache();
    return NextResponse.json({ ok: true });
}
