'use client';

import {
    Sheet,
    SheetContent,
} from "@/components/ui/sheet";
import { X, Flame, Leaf, Sparkles, Scale } from "lucide-react";
import Icon from '@/components/Icon';
import { Item } from "@/lib/db";
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect, useRef, useState, useCallback } from 'react';

interface ItemDetailSheetProps {
    item: Item | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function ItemDetailSheet({ item, isOpen, onClose }: ItemDetailSheetProps) {
    const t = useTranslations('Menu');
    const ta = useTranslations('Admin');
    const dragRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const startYRef = useRef(0);
    const currentYRef = useRef(0);
    const contentRef = useRef<HTMLDivElement>(null);

    // Reset transform and overlay when sheet opens
    useEffect(() => {
        if (isOpen && contentRef.current) {
            contentRef.current.style.transform = '';
            contentRef.current.style.transition = '';
        }
    }, [isOpen]);

    // Swipe down to close
    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        setIsDragging(true);
        startYRef.current = e.touches[0].clientY;
        currentYRef.current = e.touches[0].clientY;
    }, []);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        if (!isDragging) return;
        currentYRef.current = e.touches[0].clientY;
        const diff = currentYRef.current - startYRef.current;

        if (diff > 0 && contentRef.current) {
            const isSm = window.innerWidth >= 640;
            contentRef.current.style.transform = isSm
                ? `translateX(-50%) translateY(${diff}px)`
                : `translateY(${diff}px)`;
            contentRef.current.style.transition = 'none';
        }
    }, [isDragging]);

    const handleTouchEnd = useCallback(() => {
        if (!isDragging) return;
        setIsDragging(false);

        const diff = currentYRef.current - startYRef.current;

        if (contentRef.current) {
            if (diff > 100) {
                onClose();
            } else {
                contentRef.current.style.transition = 'transform 0.3s ease-out';
                contentRef.current.style.transform = '';
            }
        }
    }, [isDragging, onClose]);

    if (!item) return null;

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent
                ref={contentRef}
                side="bottom"
                showCloseButton={false}
                className="h-[88dvh] max-h-[calc(100dvh-40px)] sm:h-[75vh] sm:w-full sm:max-w-xl sm:right-auto sm:left-1/2 sm:-translate-x-1/2 sm:rounded-[32px] lg:max-w-[900px] lg:h-auto lg:max-h-[80vh] lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 lg:rounded-3xl p-0 overflow-hidden rounded-t-[32px] border-none bg-white focus-visible:ring-0 shadow-2xl"
            >
                {/* Drag Handle - mobile/tablet only */}
                <div
                    ref={dragRef}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    className="absolute top-0 left-0 right-0 h-12 z-50 flex items-center justify-center touch-pan-y lg:hidden"
                    style={{ touchAction: 'pan-y' }}
                >
                    <div className="w-10 h-1.5 bg-zinc-300 rounded-full" />
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 lg:top-3 lg:right-3 p-2.5 bg-white/90 backdrop-blur-sm text-foreground rounded-full z-50 shadow-lg active:scale-95"
                    style={{
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        WebkitTapHighlightColor: 'transparent'
                    }}
                >
                    <Icon icon={X} size={20} />
                </button>

                {/* Layout: vertical on mobile, horizontal on lg+ */}
                <div className="h-full flex flex-col lg:flex-row overflow-y-auto lg:overflow-y-auto scrollbar-hide">

                    {/* Image */}
                    <div className="relative w-full aspect-video max-h-[360px] bg-muted/10 shrink-0 pt-8 lg:w-[45%] lg:h-auto lg:min-h-[350px] lg:max-h-none lg:pt-0 overflow-hidden">
                        {item.image_url ? (
                            <Image
                                src={item.image_url}
                                alt={item.title || "Dish"}
                                fill
                                priority
                                sizes="(max-width: 1024px) 100vw, 45vw"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                                <Icon icon={Sparkles} size={64} />
                            </div>
                        )}

                        {/* Gradient fade into content */}
                        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white/60 to-transparent lg:hidden z-20" />
                        <div className="hidden lg:block absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white/60 to-transparent z-20" />

                        {/* Top Badges */}
                        <div className="absolute top-10 left-5 lg:top-4 lg:left-4 flex flex-wrap gap-2">
                            {item.is_new && (
                                <div className="px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1.5 shadow-lg">
                                    <Icon icon={Sparkles} size={14} /> {ta('new')}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-2 space-y-6 -mt-6 relative z-30 lg:flex-1 lg:overflow-y-auto lg:scrollbar-hide lg:mt-0 lg:py-8 lg:px-8">
                        {/* Title & Price */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center gap-4">
                                <div className="space-y-2 flex-1">
                                    <h2 className="text-3xl font-bold tracking-tight text-foreground leading-tight font-display">
                                        {item.title}
                                    </h2>
                                    <div className="flex items-center gap-3 flex-wrap">
                                        {item.weight && (
                                            <div className="flex items-center gap-1.5 text-muted-foreground text-sm font-medium bg-muted/50 px-2.5 py-1 rounded-lg">
                                                <Icon icon={Scale} size={16} className="text-primary" />
                                                {item.weight}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div
                                    className="text-2xl font-bold text-white whitespace-nowrap px-5 py-2.5 rounded-2xl lg:mr-10 bg-primary"
                                >
                                    {Math.floor(item.price) === item.price ? item.price : item.price.toFixed(2)} ₾
                                </div>
                            </div>

                            {/* Icons row */}
                            <div className="flex gap-3">
                                {item.is_spicy && (
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 text-red-500 text-sm font-medium">
                                        <Icon icon={Flame} size={16} className="fill-red-500" />
                                        {ta('spicy')}
                                    </div>
                                )}
                                {item.is_vegan && (
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-500 text-sm font-medium">
                                        <Icon icon={Leaf} size={16} className="fill-emerald-500" />
                                        {ta('vegan')}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

                        {/* Description */}
                        {item.description && (
                            <div className="space-y-3">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70 flex items-center gap-2">
                                    <span className="w-4 h-px bg-primary/50" />
                                    {t('description')}
                                    <span className="w-4 h-px bg-primary/50" />
                                </h3>
                                <p className="text-foreground/80 leading-relaxed text-lg">
                                    {item.description}
                                </p>
                            </div>
                        )}

                        {/* Status Badges */}
                        {!item.is_active && (
                            <div className="mt-8 p-4 bg-muted rounded-2xl text-center font-bold text-muted-foreground uppercase tracking-widest border-2 border-dashed border-muted-foreground/20">
                                {ta('sold_out')}
                            </div>
                        )}

                        {/* Bottom spacing */}
                        <div className="h-8" />
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
