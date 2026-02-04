'use client';

import { Item } from '@/lib/db';
import MenuItem from './MenuItem';
import { UtensilsCrossed } from 'lucide-react';
import Icon from '@/components/Icon';
import { Virtuoso } from 'react-virtuoso';
import { useEffect, useState } from 'react';

interface CategorySectionProps {
    id: string;
    title: string;
    items: Item[];
    onSelectItem?: (item: Item) => void;
}

export default function CategorySection({ id, title, items, onSelectItem }: CategorySectionProps) {
    const [key, setKey] = useState(0);
    
    // Force remount on orientation change to prevent crash
    useEffect(() => {
        let resizeTimeout: NodeJS.Timeout;
        
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                setKey(prev => prev + 1);
            }, 300);
        };
        
        window.addEventListener('orientationchange', handleResize, { passive: true });
        window.addEventListener('resize', handleResize, { passive: true });
        
        return () => {
            window.removeEventListener('orientationchange', handleResize);
            window.removeEventListener('resize', handleResize);
            clearTimeout(resizeTimeout);
        };
    }, []);
    
    if (items.length === 0) return null;

    return (
        <section id={id} className="scroll-mt-24 py-2" key={key}>
            {title && (
                <div className="flex items-center gap-3 mb-6 px-1">
                    <div className="p-2 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <Icon icon={UtensilsCrossed} size={16} />
                    </div>
                    <h2 className="text-xl font-bold text-foreground/90 tracking-tight font-display">
                        {title}
                    </h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent ml-2" />
                </div>
            )}
            {/* Virtualized List using Window Scroll */}
            <Virtuoso
                useWindowScroll
                data={items}
                increaseViewportBy={200}
                overscan={5}
                itemContent={(index, item) => (
                    <div className="pb-3">
                        <MenuItem
                            key={item.id}
                            item={item}
                            onClick={onSelectItem}
                        />
                    </div>
                )}
            />
        </section>
    );
}
