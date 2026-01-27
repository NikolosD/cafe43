'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, ChevronLeft } from 'lucide-react';
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
    const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
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
                        onClick={() => setActiveCategoryId(null)}
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
                    <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {menu.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => {
                                    setActiveCategoryId(category.id);
                                    window.scrollTo({ top: 0, behavior: 'instant' });
                                }}
                                className="group relative aspect-[4/5] rounded-3xl overflow-hidden bg-zinc-100 shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
                            >
                                {category.image_url ? (
                                    <Image
                                        src={category.image_url}
                                        alt={category.title || "Category"}
                                        fill
                                        sizes="(max-width: 768px) 50vw, 33vw"
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center bg-zinc-100 text-zinc-300">
                                        <Search className="w-10 h-10 opacity-20" />
                                    </div>
                                )}
                                {category.title && (
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5 text-left">
                                        <h3 className="text-white font-bold text-lg leading-tight uppercase tracking-wide">
                                            {category.title}
                                        </h3>
                                    </div>
                                )}
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
