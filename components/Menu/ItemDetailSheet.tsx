'use client';

import {
    Sheet,
    SheetContent,
} from "@/components/ui/sheet";
import { X, Flame, Leaf, Sparkles, Scale } from "lucide-react";
import { Item } from "@/lib/db";
import { cn } from "@/lib/utils";
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRef, useState, useCallback, useEffect } from 'react';

interface ItemDetailSheetProps {
    item: Item | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function ItemDetailSheet({ item, isOpen, onClose }: ItemDetailSheetProps) {
    const t = useTranslations('Menu');
    const ta = useTranslations('Admin');
    
    // Swipe handling
    const sheetRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const dragStartY = useRef(0);
    const currentTranslateY = useRef(0);
    const isDraggingRef = useRef(false);

    // Fix for orientation change - reset position
    useEffect(() => {
        const handleOrientationChange = () => {
            // Reset transform on orientation change to prevent crash
            if (sheetRef.current) {
                sheetRef.current.style.transform = '';
                sheetRef.current.style.transition = '';
            }
            currentTranslateY.current = 0;
            setIsDragging(false);
            isDraggingRef.current = false;
        };

        window.addEventListener('orientationchange', handleOrientationChange);
        window.addEventListener('resize', handleOrientationChange);

        return () => {
            window.removeEventListener('orientationchange', handleOrientationChange);
            window.removeEventListener('resize', handleOrientationChange);
        };
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (sheetRef.current) {
                sheetRef.current.style.transform = '';
            }
        };
    }, []);

    const handleTouchStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        dragStartY.current = clientY;
        setIsDragging(true);
        isDraggingRef.current = true;
    }, []);

    const handleTouchMove = useCallback((e: React.TouchEvent | React.MouseEvent) => {
        if (!isDraggingRef.current) return;
        
        // Prevent default to avoid scroll conflicts
        if ('touches' in e) {
            e.preventDefault();
        }
        
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        const deltaY = clientY - dragStartY.current;
        
        if (deltaY > 0) {
            currentTranslateY.current = deltaY;
            if (sheetRef.current) {
                sheetRef.current.style.transform = `translateY(${deltaY}px)`;
            }
        }
    }, []);

    const handleTouchEnd = useCallback(() => {
        isDraggingRef.current = false;
        setIsDragging(false);
        const threshold = 150; // min swipe distance to close
        
        if (currentTranslateY.current > threshold) {
            onClose();
        } else {
            // Reset position
            if (sheetRef.current) {
                sheetRef.current.style.transform = '';
                sheetRef.current.style.transition = 'transform 0.3s ease-out';
                setTimeout(() => {
                    if (sheetRef.current) {
                        sheetRef.current.style.transition = '';
                    }
                }, 300);
            }
        }
        currentTranslateY.current = 0;
    }, [onClose]);

    // Reset transform when sheet opens
    useEffect(() => {
        if (isOpen && sheetRef.current) {
            sheetRef.current.style.transform = '';
            currentTranslateY.current = 0;
        }
    }, [isOpen]);
    
    if (!item) return null;

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent
                side="bottom"
                showCloseButton={false}
                className="h-[88dvh] sm:h-[85vh] sm:max-w-xl sm:left-1/2 sm:-translate-x-1/2 p-0 overflow-hidden rounded-t-[32px] border-none bg-white focus-visible:ring-0 shadow-2xl"
                style={{ 
                    // Prevent layout shift on orientation change
                    maxHeight: 'calc(100dvh - 40px)'
                }}
            >
                <div 
                    ref={sheetRef}
                    className="h-full flex flex-col overflow-y-auto scrollbar-hide touch-pan-y"
                    style={{ willChange: isDragging ? 'transform' : 'auto' }}
                >
                    {/* Drag Handle - Swipe area */}
                    <div 
                        className="absolute top-0 left-0 right-0 h-12 z-50 flex items-center justify-center cursor-grab active:cursor-grabbing"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        onMouseDown={handleTouchStart}
                        onMouseMove={handleTouchMove}
                        onMouseUp={handleTouchEnd}
                        onMouseLeave={handleTouchEnd}
                    >
                        <div className={cn(
                            "w-10 h-1.5 bg-zinc-300 rounded-full transition-all",
                            isDragging && "w-12 bg-zinc-400"
                        )} />
                    </div>

                    {/* Hero Image */}
                    <div className="relative w-full h-[45vh] sm:h-[40vh] max-h-[400px] bg-gradient-to-br from-muted to-muted/50 shrink-0 pt-8">
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
                                <Sparkles className="w-16 h-16" />
                            </div>
                        )}

                        {/* Gradient overlay at bottom */}
                        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-white/30 to-transparent" />

                        {/* Custom Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-10 right-5 p-2.5 bg-white/90 backdrop-blur-md text-foreground rounded-full hover:bg-white transition-all duration-300 z-50 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Top Badges */}
                        <div className="absolute top-10 left-5 flex flex-wrap gap-2">
                            {item.is_new && (
                                <div className="px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1.5 shadow-lg">
                                    <Sparkles className="w-3.5 h-3.5" /> {ta('new')}
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
                                                <Scale className="w-4 h-4 text-primary" />
                                                {item.weight}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="text-2xl font-bold text-white whitespace-nowrap bg-gradient-to-br from-primary to-accent px-5 py-2.5 rounded-2xl shadow-lg shadow-primary/20">
                                    {item.price} ₾
                                </div>
                            </div>

                            {/* Icons row */}
                            <div className="flex gap-3">
                                {item.is_spicy && (
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 text-red-500 text-sm font-medium">
                                        <Flame className="w-4 h-4 fill-red-500" />
                                        Spicy
                                    </div>
                                )}
                                {item.is_vegan && (
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-500 text-sm font-medium">
                                        <Leaf className="w-4 h-4 fill-emerald-500" />
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
