'use client';

import { Link } from '@/lib/navigation';
import { useCallback } from 'react';

interface CategoryStickyHeaderProps {
    categoryTitle: string;
    icon?: string | null;
}

export default function CategoryStickyHeader({ categoryTitle, icon }: CategoryStickyHeaderProps) {
    const handleBackClick = useCallback(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="sticky top-14 sm:top-16 z-40 w-full bg-white border-b border-black/[0.06] chrome-ios-sticky">
            <div className="max-w-3xl mx-auto px-4 py-3.5">
                <div className="flex items-center gap-3">
                    <Link
                        href="/menu"
                        prefetch={true}
                        scroll={false}
                        onClick={handleBackClick}
                        aria-label="Back"
                        className="p-1.5 hover:bg-black/[0.03] rounded-full transition-colors active:scale-95 flex items-center justify-center"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ display: 'block', flexShrink: 0 }}
                        >
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                    </Link>
                    <h2 className="text-[15px] font-medium tracking-wide text-foreground/70 uppercase">
                        {categoryTitle}
                    </h2>
                </div>
            </div>
        </div>
    );
}
