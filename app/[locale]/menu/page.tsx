import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { getPublicMenu } from '@/lib/db';
import MenuHeader from '@/components/Menu/MenuHeader';
import MenuList from '@/components/Menu/MenuList';

export default async function MenuPage({
    params: { locale }
}: {
    params: { locale: string };
}) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const menu = await getPublicMenu(supabase, locale);

    return (
        <div className="min-h-screen bg-slate-50/50">
            <MenuHeader />
            <main className="py-6">
                <MenuList menu={menu} />
            </main>
        </div>
    );
}
