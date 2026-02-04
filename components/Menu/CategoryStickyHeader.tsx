'use client';

import { Link } from '@/lib/navigation';
import { useLocale } from 'next-intl';
import { CakeSlice, Coffee, GlassWater, Sparkles } from 'lucide-react';
import { useCallback } from 'react';

interface CategoryStickyHeaderProps {
    categoryTitle: string;
}

function getCategoryIcon(title: string) {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('des') || lowerTitle.includes('дес') || lowerTitle.includes('დეს')) {
        return <CakeSlice className="w-7 h-7" strokeWidth={1.5} />;
    }
    if (lowerTitle.includes('hot') || lowerTitle.includes('горяч') || lowerTitle.includes('ცხელ')) {
        return <Coffee className="w-7 h-7" strokeWidth={1.5} />;
    }
    if (lowerTitle.includes('cold') || lowerTitle.includes('холод') || lowerTitle.includes('ცივი')) {
        return <GlassWater className="w-7 h-7" strokeWidth={1.5} />;
    }
    return <Sparkles className="w-7 h-7" strokeWidth={1.5} />;
}

export default function CategoryStickyHeader({ categoryTitle }: CategoryStickyHeaderProps) {
    const locale = useLocale();

    const handleBackClick = useCallback((e: React.MouseEvent) => {
        // Instant scroll to top before navigation
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="sticky top-14 sm:top-16 z-40 w-full bg-white/90 backdrop-blur-xl border-b border-black/10 shadow-sm">
            <div className="max-w-3xl mx-auto px-4 py-3">
                <div className="flex items-center gap-3">
                    <Link 
                        href="/menu"
                        prefetch={true}
                        scroll={false}
                        onClick={handleBackClick}
                        className="p-2.5 hover:bg-black/5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                            <path d="m15 18-6-6 6-6"></path>
                        </svg>
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 text-primary shadow-sm border border-primary/10">
                            {getCategoryIcon(categoryTitle)}
                        </div>
                        <h2 className="text-xl font-bold tracking-tight text-foreground/90 font-display">
                            {categoryTitle}
                        </h2>
                    </div>
                </div>
            </div>
        </div>
    );
}
