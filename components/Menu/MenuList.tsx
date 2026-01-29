'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, ChevronLeft } from 'lucide-react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import CategorySection from './CategorySection';
import EmptyState from './EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import ItemDetailSheet from './ItemDetailSheet';
import { useTranslations } from 'next-intl';
import { Item } from '@/lib/db';

export default function MenuList({ menu }: { menu: any[] }) {
    const t = useTranslations('Menu');
    const [mounted, setMounted] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const activeCategoryId = searchParams.get('category');
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const activeCategory = useMemo(() =>
        menu.find(c => c.id === activeCategoryId),
        [menu, activeCategoryId]);

    if (!mounted) {
        return (
            <div className="space-y-8 mt-6 max-w-3xl mx-auto px-4">
                <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map(i => <Skeleton key={i} className="aspect-square rounded-2xl" />)}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-3xl mx-auto px-4 pb-24">
            {/* Back Button for Item View */}
            {activeCategoryId && (
                <div className="flex items-center gap-2 sticky top-16 z-40 py-2 bg-background/80 backdrop-blur-md -mx-4 px-4 border-b border-black/5 mb-4">
                    <button
                        onClick={() => {
                            const params = new URLSearchParams(searchParams.toString());
                            params.delete('category');
                            router.push(`${pathname}?${params.toString()}`);
                        }}
                        className="p-2 hover:bg-black/5 rounded-full transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <h2 className="text-xl font-bold tracking-tight text-foreground/90">{activeCategory?.title}</h2>
                </div>
            )}

            {/* Content View */}
            <div className="min-h-[40vh]">
                {activeCategoryId ? (
                    // Category Detailed View
                    <CategorySection
                        key={activeCategory?.id}
                        id={activeCategory?.id}
                        title={""} // Title handled by back button header
                        items={activeCategory?.items || []}
                        onSelectItem={setSelectedItem}
                    />
                ) : (
                    // Main Categories Grid
                    <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {menu.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => {
                                    const params = new URLSearchParams(searchParams.toString());
                                    params.set('category', category.id);
                                    router.push(`${pathname}?${params.toString()}`);
                                    window.scrollTo({ top: 0, behavior: 'instant' });
                                }}
                                className="group relative flex h-32 sm:h-44 w-full bg-white rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-sm border border-black/[0.03] transition-all hover:shadow-md hover:-translate-y-1 active:scale-[0.98]"
                            >
                                {/* Content Area */}
                                <div className="flex-[1.1] flex flex-col justify-center px-6 sm:px-10 text-left z-10 transition-colors">
                                    <h3 className="text-zinc-900 font-extrabold text-xl sm:text-3xl leading-[1.1] sm:leading-none uppercase tracking-tighter">
                                        {category.title}
                                    </h3>
                                </div>

                                {/* Image Area */}
                                <div className="relative flex-1 h-full overflow-hidden">
                                    {category.image_url ? (
                                        <div className="absolute inset-0 w-full h-full">
                                            <Image
                                                src={category.image_url}
                                                alt={category.title || "Category"}
                                                fill
                                                priority
                                                sizes="(max-width: 768px) 50vw, 33vw"
                                                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                            />
                                            {/* Refined Smooth Gradient Fade */}
                                            <div className="absolute inset-y-0 left-0 w-32 sm:w-48 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
                                        </div>
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center bg-zinc-50 text-zinc-200">
                                            <Search className="w-8 sm:w-12 h-8 sm:h-12 opacity-10" />
                                        </div>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <ItemDetailSheet
                item={selectedItem}
                isOpen={!!selectedItem}
                onClose={() => setSelectedItem(null)}
            />
        </div>
    );
}
