'use client';

import {
    Sheet,
    SheetContent,
} from "@/components/ui/sheet";
import { X, Flame, Leaf, Sparkles, Scale } from "lucide-react";
import Icon from '@/components/Icon';
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

// Detect Chrome on iOS
const isChromeIOS = () => {
    if (typeof navigator === 'undefined') return false;
    return /CriOS/.test(navigator.userAgent);
};

export default function ItemDetailSheet({ item, isOpen, onClose }: ItemDetailSheetProps) {
    const t = useTranslations('Menu');
    const ta = useTranslations('Admin');
    const [isChromeOnIOS] = useState(() => isChromeIOS());
    
    // Swipe handling
    const sheetRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const dragStartY = useRef(0);
    const currentTranslateY = useRef(0);
    const isDraggingRef = useRef(false);
    const touchIdRef = useRef<number | null>(null);

    // Fix for orientation change - reset position
    useEffect(() => {
        let resizeTimeout: NodeJS.Timeout;
        
        const handleOrientationChange = () => {
            // Close sheet on orientation change for Chrome iOS to prevent crash
            if (isChromeOnIOS && isOpen) {
                onClose();
                return;
            }
            
            // For other browsers, reset with delay
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (sheetRef.current) {
                    sheetRef.current.style.transform = '';
                    sheetRef.current.style.transition = '';
                    sheetRef.current.style.willChange = 'auto';
                }
                currentTranslateY.current = 0;
                setIsDragging(false);
                isDraggingRef.current = false;
            }, isChromeOnIOS ? 500 : 100);
        };

        window.addEventListener('orientationchange', handleOrientationChange, { passive: true });
        
        // Chrome iOS fires resize multiple times
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (isChromeOnIOS && isOpen) {
                    onClose();
                }
            }, 300);
        };
        
        window.addEventListener('resize', handleResize, { passive: true });

        return () => {
            window.removeEventListener('orientationchange', handleOrientationChange);
            window.removeEventListener('resize', handleResize);
            clearTimeout(resizeTimeout);
        };
    }, [isChromeOnIOS, isOpen, onClose]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (sheetRef.current) {
                sheetRef.current.style.transform = '';
                sheetRef.current.style.willChange = 'auto';
            }
        };
    }, []);

    const handleTouchStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
        // Prevent multiple touches
        if ('touches' in e && e.touches.length > 1) return;
        
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        const touchId = 'touches' in e ? e.touches[0].identifier : null;
        
        dragStartY.current = clientY;
        touchIdRef.current = touchId;
        setIsDragging(true);
        isDraggingRef.current = true;
        
        // Enable will-change only during drag
        if (sheetRef.current) {
            sheetRef.current.style.willChange = 'transform';
        }
    }, []);

    const handleTouchMove = useCallback((e: React.TouchEvent | React.MouseEvent) => {
        if (!isDraggingRef.current) return;
        
        // Check if it's the same touch
        if ('touches' in e) {
            const touch = Array.from(e.touches).find(t => t.identifier === touchIdRef.current);
            if (!touch) return;
            
            const clientY = touch.clientY;
            const deltaY = clientY - dragStartY.current;
            
            if (deltaY > 0) {
                currentTranslateY.current = deltaY;
                if (sheetRef.current) {
                    sheetRef.current.style.transform = `translateY(${deltaY}px)`;
                }
            }
            
            // Use passive false for preventDefault
            if (e.cancelable && deltaY > 0) {
                e.preventDefault();
            }
        } else {
            const clientY = e.clientY;
            const deltaY = clientY - dragStartY.current;
            
            if (deltaY > 0) {
                currentTranslateY.current = deltaY;
                if (sheetRef.current) {
                    sheetRef.current.style.transform = `translateY(${deltaY}px)`;
                }
            }
        }
    }, []);

    const handleTouchEnd = useCallback(() => {
        isDraggingRef.current = false;
        touchIdRef.current = null;
        setIsDragging(false);
        
        // Disable will-change after drag
        if (sheetRef.current) {
            sheetRef.current.style.willChange = 'auto';
        }
        
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
                    style={{ 
                        willChange: 'auto',
                        // Disable complex animations on Chrome iOS
                        transform: isChromeOnIOS ? undefined : undefined
                    }}
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
                                <Icon icon={Sparkles} size={64} />
                            </div>
                        )}

                        {/* Gradient overlay at bottom */}
                        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-white/30 to-transparent" />

                        {/* Custom Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-10 right-5 p-2.5 bg-white/90 backdrop-blur-md text-foreground rounded-full hover:bg-white transition-all duration-300 z-50 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
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
                                <div className="text-2xl font-bold text-white whitespace-nowrap bg-gradient-to-br from-primary to-accent px-5 py-2.5 rounded-2xl shadow-lg shadow-primary/20">
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
