import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { getPublicMenu, getSettings } from '@/lib/db';
import MenuHeader from '@/components/Menu/MenuHeader';
import MenuList from '@/components/Menu/MenuList';
import MenuFooter from '@/components/Menu/MenuFooter';

export default async function MenuPage({
    params: { locale }
}: {
    params: { locale: string };
}) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const menu = await getPublicMenu(supabase, locale);
    const settings = await getSettings(supabase);

    return (
        <div className="min-h-screen bg-slate-50/50 flex flex-col">
            <MenuHeader />
            <main className="py-6 flex-grow">
                <MenuList menu={menu} />
            </main>
            <MenuFooter settings={settings} />
        </div>
    );
}
