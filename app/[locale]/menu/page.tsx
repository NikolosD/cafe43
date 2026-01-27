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
        <div className="min-h-screen bg-[#f8f8f8] flex flex-col relative">
            {/* Marble texture overlay effect */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/marble-white.png")' }} />

            <MenuHeader />
            <main className="py-6 flex-grow relative z-10">
                <MenuList menu={menu} />
            </main>
            <MenuFooter settings={settings} />
        </div>
    );
}
