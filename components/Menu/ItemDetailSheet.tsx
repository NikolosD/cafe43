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

function ImageCarousel({ images, title }: { images: string[]; title: string }) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleScroll = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        const index = Math.round(el.scrollLeft / el.clientWidth);
        setActiveIndex(index);
    }, []);

    if (images.length === 0) {
        return (
            <div className="w-full aspect-square max-h-[400px] bg-[#f5f5f3] shrink-0 lg:w-[45%] lg:h-auto lg:min-h-[350px] lg:max-h-none flex items-center justify-center text-foreground/10">
                <Sparkles size={48} />
            </div>
        );
    }

    if (images.length === 1) {
        return (
            <div className="relative w-full aspect-square max-h-[400px] bg-[#f5f5f3] shrink-0 lg:w-[45%] lg:h-auto lg:min-h-[350px] lg:max-h-none overflow-hidden">
                <Image src={images[0]} alt={title} fill priority sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover" />
            </div>
        );
    }

    return (
        <div className="relative w-full shrink-0 lg:w-[45%] lg:min-h-[350px]">
            {/* Scrollable images */}
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
                style={{ WebkitOverflowScrolling: 'touch' }}
            >
                {images.map((url, i) => (
                    <div key={i} className="relative w-full aspect-square max-h-[400px] bg-[#f5f5f3] shrink-0 snap-center lg:max-h-none">
                        <Image
                            src={url}
                            alt={`${title} ${i + 1}`}
                            fill
                            priority={i === 0}
                            sizes="(max-width: 1024px) 100vw, 45vw"
                            className="object-cover"
                            loading={i === 0 ? "eager" : "lazy"}
                        />
                    </div>
                ))}
            </div>

            {/* Dots indicator */}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
                {images.map((_, i) => (
                    <div
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full transition-colors ${i === activeIndex ? 'bg-foreground/70' : 'bg-foreground/20'}`}
                    />
                ))}
            </div>
        </div>
    );
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

    // Build image list: item_images first, fallback to image_url
    const allImages: string[] = item.images && item.images.length > 0
        ? item.images.map(img => img.image_url)
        : item.image_url ? [item.image_url] : [];

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

                {/* Close — simple X like Grolet */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 lg:top-3 lg:right-3 p-2 z-50 active:scale-95 text-foreground/60 hover:text-foreground transition-colors"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                    <Icon icon={X} size={18} strokeWidth={1.5} />
                </button>

                <div className="h-full flex flex-col lg:flex-row overflow-y-auto lg:overflow-y-auto scrollbar-hide">

                    {/* Image carousel — CSS scroll-snap, like Grolet */}
                    <ImageCarousel images={allImages} title={item.title || ""} />

                    {/* Content — like Grolet product page */}
                    <div className="px-6 py-6 space-y-5 lg:flex-1 lg:overflow-y-auto lg:scrollbar-hide lg:py-8 lg:px-8">
                        {/* Title */}
                        <h2 className="text-xl font-display font-normal tracking-tight text-foreground leading-snug pr-8">
                            {item.title}
                        </h2>

                        {/* Description */}
                        {item.description && (
                            <p className="text-[13px] leading-relaxed text-foreground/50">
                                {item.description}
                            </p>
                        )}

                        {/* Meta: weight, badges */}
                        {(item.weight || item.is_spicy || item.is_vegan) && (
                            <p className="text-[12px] text-foreground/30">
                                {[
                                    item.weight,
                                    item.is_spicy && ta('spicy'),
                                    item.is_vegan && ta('vegan'),
                                ].filter(Boolean).join(' — ')}
                            </p>
                        )}

                        {/* Price — prominent, like Grolet's €18.00 */}
                        <div className="pt-2 border-t border-black/[0.06]">
                            <span className="text-[17px] font-medium text-foreground tabular-nums">
                                {Math.floor(item.price) === item.price ? item.price : item.price.toFixed(2)} ₾
                            </span>
                        </div>

                        {/* Sold out */}
                        {!item.is_active && (
                            <p className="text-[12px] uppercase tracking-widest text-foreground/30 pt-2">
                                {ta('sold_out')}
                            </p>
                        )}

                        <div className="h-6" />
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
