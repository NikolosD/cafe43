import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { getPublicMenu, getSettings, getDeliveryLinks } from '@/lib/db';
import MenuHeader from '@/components/Menu/MenuHeader';
import MenuList from '@/components/Menu/MenuList';
import MenuFooter from '@/components/Menu/MenuFooter';
import CategoryStickyHeader from '@/components/Menu/CategoryStickyHeader';
import ErrorBoundary from '@/components/ErrorBoundary';

export default async function MenuPage({
    params: { locale },
    searchParams
}: {
    params: { locale: string };
    searchParams: { category?: string };
}) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const activeCategoryId = searchParams.category;

    // Parallel data fetching
    const [menu, settings, deliveryLinks] = await Promise.all([
        getPublicMenu(supabase, locale, activeCategoryId),
        getSettings(supabase),
        getDeliveryLinks(supabase, locale),
    ]);

    const activeCategory = activeCategoryId ? menu.find((c: any) => c.id === activeCategoryId) : null;

    return (
        <ErrorBoundary>
            <div className="min-h-screen bg-white flex flex-col relative menu-root" style={{ minHeight: '100dvh' }}>

                <MenuHeader />

                {activeCategory && (
                    <CategoryStickyHeader categoryTitle={activeCategory.title} icon={activeCategory.icon} />
                )}

                <main className="flex-grow">
                    <MenuList menu={menu} />
                </main>
                <MenuFooter settings={settings} deliveryLinks={deliveryLinks} />
            </div>
        </ErrorBoundary>
    );
}
