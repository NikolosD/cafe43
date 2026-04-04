'use client';

import Image from 'next/image';
import { cn } from "@/lib/utils";
import { Sparkles, Scale, Flame, Leaf } from 'lucide-react';
import Icon from '@/components/Icon';
import { Item } from '@/lib/db';
import { useTranslations } from 'next-intl';

interface MenuItemProps {
    item: Item;
    onClick?: (item: Item) => void;
}

export default function MenuItem({ item, onClick }: MenuItemProps) {
    const ta = useTranslations('Admin');
    const { title, description, price, weight, image_url: imageUrl, is_active: isActive = true } = item;

    return (
        <button
            onClick={() => onClick?.(item)}
            className={cn(
                "group relative flex items-start p-4 rounded-2xl transition-all duration-300 text-left w-full overflow-hidden",
                "bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]",
                "border border-transparent",
                "active:scale-[0.99]",
                !isActive && "opacity-60 grayscale"
            )}
        >


            {/* Image */}
            <div className="relative shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-muted to-muted/50 mr-4 shadow-inner">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={title || "Dish"}
                        fill
                        sizes="80px"
                        className="object-cover transition-all duration-500 group-hover:scale-110"
                        loading="lazy"
                        decoding="async"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                        <Icon icon={Sparkles} size={24} />
                    </div>
                )}


            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 flex flex-col justify-center min-h-[80px] relative">
                <div className="flex justify-between items-start gap-3">
                    <h3 className="font-semibold text-[17px] leading-snug text-foreground/90 group-hover:text-foreground transition-colors">
                        {title}
                    </h3>
                    <span className="font-bold text-[15px] text-white tabular-nums shrink-0 bg-primary px-2.5 py-1 rounded-xl min-w-[65px] text-center shadow-sm">
                        {Math.floor(price) === price ? price : price.toFixed(2)} ₾
                    </span>
                </div>

                {description && (
                    <p className="text-[13px] leading-relaxed text-muted-foreground mt-1.5 line-clamp-2 group-hover:text-muted-foreground/80 transition-colors">
                        {description}
                    </p>
                )}

                {(weight || item.is_new || item.is_spicy || item.is_vegan) && (
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                        {item.is_new && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-wide">
                                <Sparkles className="w-2.5 h-2.5" /> {ta('new')}
                            </span>
                        )}
                        {item.is_spicy && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 text-red-500 text-[10px] font-bold uppercase tracking-wide">
                                <Flame className="w-2.5 h-2.5" />
                            </span>
                        )}
                        {item.is_vegan && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-500 text-[10px] font-bold uppercase tracking-wide">
                                <Leaf className="w-2.5 h-2.5" />
                            </span>
                        )}
                        {weight && (
                            <span className="inline-flex items-center gap-1 text-muted-foreground/60 text-[11px] font-medium">
                                <Scale className="w-2.5 h-2.5" /> {weight}
                            </span>
                        )}
                    </div>
                )}

                {!isActive && (
                    <span className="absolute top-0 right-0 text-[10px] uppercase font-bold tracking-wider text-muted-foreground/70 bg-black/5 px-2.5 py-1 rounded-full">
                        {ta('sold_out')}
                    </span>
                )}
            </div>


        </button>
    );
}
