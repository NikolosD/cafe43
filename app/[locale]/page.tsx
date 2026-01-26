import { getPublicMenu } from '@/lib/db';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import MenuHeader from '@/components/Menu/MenuHeader';
import MenuList from '@/components/Menu/MenuList';

export default async function MenuPage({ params: { locale } }: { params: { locale: string } }) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const menu = await getPublicMenu(supabase, locale).catch(() => []);

    return (
        <main className="min-h-screen bg-background pb-20">
            <MenuHeader />
            <div className="container max-w-3xl mx-auto px-4 py-6">
                <MenuList menu={menu} />
            </div>
        </main>
    );
}
