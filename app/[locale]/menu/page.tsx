import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { getPublicMenu, getSettings } from '@/lib/db';
import MenuHeader from '@/components/Menu/MenuHeader';
import MenuList from '@/components/Menu/MenuList';
import MenuFooter from '@/components/Menu/MenuFooter';

export default async function MenuPage({
    params: { locale },
    searchParams
}: {
    params: { locale: string };
    searchParams: { category?: string };
}) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const menu = await getPublicMenu(supabase, locale);
    const settings = await getSettings(supabase);

    const activeCategoryId = searchParams.category;
    const activeCategory = activeCategoryId ? menu.find((c: any) => c.id === activeCategoryId) : null;

    return (
        <div className="min-h-screen bg-[#faf9f7] flex flex-col relative">
            {/* Subtle gradient background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-accent/[0.02]" />
                
                {/* Decorative circles */}
                <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
                <div className="absolute top-1/3 -left-20 w-60 h-60 rounded-full bg-accent/5 blur-3xl" />
                <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-primary/5 blur-2xl" />
            </div>

            <MenuHeader />
            
            {/* Sticky Category Header */}
            {activeCategory && (
                <div className="sticky top-14 sm:top-16 z-40 w-full bg-white/90 backdrop-blur-xl border-b border-black/10 shadow-sm">
                    <div className="max-w-3xl mx-auto px-4 py-3">
                        <div className="flex items-center gap-3">
                            <a 
                                href={`/${locale}/menu`}
                                className="p-2.5 hover:bg-black/5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="w-5 h-5"><path d="m15 18-6-6 6-6"></path></svg>
                            </a>
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 text-primary shadow-sm border border-primary/10">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" className="w-7 h-7"><circle cx="9" cy="7" r="2"></circle><path d="M7.2 7.9 3 11v9c0 .6.4 1 1 1h16c.6 0 1-.4 1-1v-9c0-2-3-6-7-8l-3.6 2.6"></path><path d="M16 13H3"></path><path d="M16 17H3"></path></svg>
                                </div>
                                <h2 className="text-xl font-bold tracking-tight text-foreground/90 font-display">
                                    {activeCategory.title}
                                </h2>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <main className="flex-grow">
                <MenuList menu={menu} />
            </main>
            <MenuFooter settings={settings} />
        </div>
    );
}
