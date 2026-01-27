import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { getSettings } from '@/lib/db';
import AdminSettings from '@/components/Admin/AdminSettings';

export default async function SettingsPage() {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const settings = await getSettings(supabase);

    return <AdminSettings initialSettings={settings} />;
}
