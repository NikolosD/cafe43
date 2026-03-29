import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { getSettings, adminGetAllDeliveryLinks } from '@/lib/db';
import AdminSettings from '@/components/Admin/AdminSettings';

export default async function SettingsPage() {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const [settings, deliveryLinks] = await Promise.all([
        getSettings(supabase),
        adminGetAllDeliveryLinks(supabase),
    ]);

    return <AdminSettings initialSettings={settings} initialDeliveryLinks={deliveryLinks} />;
}
