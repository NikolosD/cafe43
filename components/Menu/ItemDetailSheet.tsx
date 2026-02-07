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

    // Fix for orientation change - close sheet to prevent crashes
    useEffect(() => {
        const handleOrientationChange = () => {
            if (isOpen) {
                onClose();
            }
        };

        window.addEventListener('orientationchange', handleOrientationChange, { passive: true });

        return () => {
            window.removeEventListener('orientationchange', handleOrientationChange);
        };
    }, [isOpen, onClose]);

    // Reset transform and overlay when sheet opens
    useEffect(() => {
        if (isOpen && contentRef.current) {
            contentRef.current.style.transform = '';
            contentRef.current.style.transition = '';
            // Reset overlay opacity
            const overlay = document.querySelector('.fixed.inset-0.z-50.bg-black\\/80') as HTMLElement;
            if (overlay) {
                overlay.style.opacity = '';
            }
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
            contentRef.current.style.transform = `translateY(${diff}px)`;
            contentRef.current.style.transition = 'none';
            // Fade out overlay as user swipes down
            const overlay = document.querySelector('[data-state="open"].fixed.inset-0.z-50.bg-black\\/80') as HTMLElement;
            if (overlay) {
                const opacity = Math.max(0, 0.8 - (diff / 400));
                overlay.style.opacity = String(opacity);
            }
        }
    }, [isDragging]);

    const handleTouchEnd = useCallback(() => {
        if (!isDragging) return;
        setIsDragging(false);
        
        const diff = currentYRef.current - startYRef.current;
        const threshold = 100; // px to trigger close
        
        // Reset overlay opacity
        const overlay = document.querySelector('.fixed.inset-0.z-50.bg-black\\/80') as HTMLElement;
        if (overlay) {
            overlay.style.opacity = '';
        }
        
        if (contentRef.current) {
            if (diff > threshold) {
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
                className="h-[88dvh] landscape:h-auto landscape:max-h-[90dvh] sm:h-[85vh] sm:max-w-xl sm:left-1/2 sm:-translate-x-1/2 p-0 overflow-hidden rounded-t-[32px] border-none bg-white focus-visible:ring-0 shadow-2xl"
                style={{ 
                    maxHeight: 'calc(100dvh - 40px)'
                }}
            >
                <div 
                    className="h-full flex flex-col overflow-y-auto scrollbar-hide"
                >
                    {/* Drag Handle with swipe down - mobile only */}
                    <div 
                        ref={dragRef}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        className="absolute top-0 left-0 right-0 h-12 z-50 flex items-center justify-center touch-pan-y sm:hidden"
                        style={{ touchAction: 'pan-y' }}
                    >
                        <div className="w-10 h-1.5 bg-zinc-300 rounded-full" />
                    </div>
                    
                    {/* Drag Handle without swipe - desktop/tablet */}
                    <div 
                        className="absolute top-0 left-0 right-0 h-12 z-50 hidden sm:flex items-center justify-center"
                    >
                        <div className="w-10 h-1.5 bg-zinc-300 rounded-full" />
                    </div>

                    {/* Hero Image */}
                    <div className="relative w-full h-[45vh] sm:h-[40vh] landscape:h-[30vh] max-h-[400px] landscape:max-h-[200px] bg-gradient-to-br from-muted to-muted/50 shrink-0 pt-8">
                        {item.image_url ? (
                            <Image
                                src={item.image_url}
                                alt={item.title || "Dish"}
                                fill
                                priority
                                sizes="(max-width: 640px) 100vw, 640px"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                                <Icon icon={Sparkles} size={64} />
                            </div>
                        )}

                        {/* Gradient overlay at bottom */}
                        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-white/30 to-transparent" />

                        {/* Custom Close Button - simplified for Chrome iOS */}
                        <button
                            onClick={onClose}
                            className="absolute top-10 right-5 p-2.5 bg-white text-foreground rounded-full z-50 shadow-lg active:scale-95"
                            style={{ 
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                WebkitTapHighlightColor: 'transparent'
                            }}
                        >
                            <Icon icon={X} size={20} />
                        </button>

                        {/* Top Badges */}
                        <div className="absolute top-10 left-5 flex flex-wrap gap-2">
                            {item.is_new && (
                                <div className="px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1.5 shadow-lg">
                                    <Icon icon={Sparkles} size={14} /> {ta('new')}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="px-6 py-2 space-y-6 -mt-6 relative">
                        {/* Title & Price */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-start gap-4">
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
                                    className="text-2xl font-bold text-white whitespace-nowrap px-5 py-2.5 rounded-2xl"
                                    style={{ backgroundColor: 'hsl(15 75% 55%)' }}
                                >
                                    {item.price} ₾
                                </div>
                            </div>

                            {/* Icons row */}
                            <div className="flex gap-3">
                                {item.is_spicy && (
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 text-red-500 text-sm font-medium">
                                        <Icon icon={Flame} size={16} className="fill-red-500" />
                                        Spicy
                                    </div>
                                )}
                                {item.is_vegan && (
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-500 text-sm font-medium">
                                        <Icon icon={Leaf} size={16} className="fill-emerald-500" />
                                        Vegan
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
