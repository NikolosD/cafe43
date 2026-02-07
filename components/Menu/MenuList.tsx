'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Search } from 'lucide-react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import CategorySection from './CategorySection';
import EmptyState from './EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import ItemDetailSheet from './ItemDetailSheet';
import { useTranslations } from 'next-intl';
import { Item } from '@/lib/db';
import { getCategoryIcon } from '@/lib/categoryIcons';
import Link from 'next/link';
import Icon from '@/components/Icon';

export default function MenuList({ menu }: { menu: any[] }) {
    const t = useTranslations('Menu');
    const [mounted, setMounted] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const activeCategoryId = searchParams.get('category');
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [isNavigating, setIsNavigating] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const activeCategory = useMemo(() =>
        menu.find(c => c.id === activeCategoryId),
        [menu, activeCategoryId]);

    // Optimized navigation with instant scroll
    const handleCategoryClick = useCallback((categoryId: string) => {
        if (isNavigating) return;
        
        setIsNavigating(true);
        
        // Instant scroll before navigation
        window.scrollTo(0, 0);
        
        const params = new URLSearchParams(searchParams.toString());
        params.set('category', categoryId);
        
        // Use replace for faster navigation, then push to history
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
        
        // Reset navigation lock
        setTimeout(() => setIsNavigating(false), 300);
    }, [isNavigating, pathname, router, searchParams]);

    if (!mounted) {
        return (
            <div className="pt-6 max-w-3xl mx-auto px-4 pb-24 space-y-5">
                {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-36 sm:h-48 w-full rounded-3xl" />
                ))}
            </div>
        );
    }

    return (
        <div className={cn("max-w-3xl mx-auto px-4 pb-24", activeCategoryId ? "pt-4" : "pt-6")}>
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
                        {menu.map((category, index) => (
                            <Link
                                key={category.id}
                                href={`${pathname}?category=${category.id}`}
                                prefetch={true}
                                scroll={false}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleCategoryClick(category.id);
                                }}
                                className="group relative flex h-32 sm:h-44 w-full bg-white rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-sm border border-black/[0.03] transition-shadow hover:shadow-md active:scale-[0.98]"
                            >
                                {/* Content Area */}
                                <div className="flex-[1.1] flex flex-col justify-center px-6 sm:px-10 text-left z-10 transition-colors">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 text-primary shadow-sm border border-primary/10">
                                            <Icon
                                                icon={getCategoryIcon(category.title, category.icon)}
                                                size={24}
                                                strokeWidth={1.5}
                                            />
                                        </div>
                                    </div>
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
                                                priority={index < 4}
                                                sizes="(max-width: 768px) 50vw, 33vw"
                                                className="object-cover"
                                                loading={index < 4 ? "eager" : "lazy"}
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
                            </Link>
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
