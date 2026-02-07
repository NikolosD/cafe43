import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { getPublicMenu, getSettings, getDeliveryLinks } from '@/lib/db';
import MenuHeader from '@/components/Menu/MenuHeader';
import MenuList from '@/components/Menu/MenuList';
import MenuFooter from '@/components/Menu/MenuFooter';
import CategoryStickyHeader from '@/components/Menu/CategoryStickyHeader';
import ErrorBoundary from '@/components/ErrorBoundary';

// ISR - кэширование страницы
export const revalidate = 60;

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
    // Optimize: Pass activeCategoryId to only fetch relevant items
    const menu = await getPublicMenu(supabase, locale, activeCategoryId);

    const settings = await getSettings(supabase);
    const deliveryLinks = await getDeliveryLinks(supabase, locale);

    const activeCategory = activeCategoryId ? menu.find((c: any) => c.id === activeCategoryId) : null;

    return (
        <ErrorBoundary>
            <div className="min-h-screen bg-[#faf9f7] flex flex-col relative menu-root" style={{ minHeight: '100dvh' }}>
                <div className="fixed inset-0 pointer-events-none menu-bg">
                    {/* Optimized Mobile Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-accent/[0.02]" />

                    {/* Heavy Blurs - Desktop Only */}
                    <div className="hidden sm:block absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
                    <div className="hidden sm:block absolute top-1/3 -left-20 w-60 h-60 rounded-full bg-accent/5 blur-3xl" />
                    <div className="hidden sm:block absolute bottom-20 right-10 w-40 h-40 rounded-full bg-primary/5 blur-2xl" />
                </div>

                <MenuHeader locale={locale} />

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
