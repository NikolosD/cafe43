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

    const handleCategoryClick = useCallback((categoryId: string) => {
        if (isNavigating) return;
        setIsNavigating(true);

        window.scrollTo(0, 0);

        const params = new URLSearchParams(searchParams.toString());
        params.set('category', categoryId);
        router.push(`${pathname}?${params.toString()}`, { scroll: false });

        // Reset after a reasonable delay for navigation to complete
        setTimeout(() => setIsNavigating(false), 500);
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
                                className="group relative w-full overflow-hidden active:scale-[0.99] transition-transform"
                            >
                                {/* Image — full width, generous height */}
                                <div className="relative w-full aspect-[16/10] bg-[#f5f5f3] overflow-hidden rounded-lg">
                                    {category.image_url ? (
                                        <Image
                                            src={category.image_url}
                                            alt={category.title || "Category"}
                                            fill
                                            priority={index < 4}
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            className="object-cover"
                                            loading={index < 4 ? "eager" : "lazy"}
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-[#f0ede8]" />
                                    )}
                                </div>

                                {/* Title below image — clean, like Grolet */}
                                <div className="pt-3 pb-2">
                                    <h3 className="text-foreground/80 font-display text-lg sm:text-xl font-light tracking-wide uppercase text-center">
                                        {category.title}
                                    </h3>
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
