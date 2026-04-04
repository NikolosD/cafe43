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
                "group flex items-start gap-4 p-4 text-left w-full transition-transform",
                "border-b border-black/[0.04] last:border-b-0",
                "active:scale-[0.98]",
                !isActive && "opacity-40"
            )}
        >
            {/* Image */}
            <div className="relative shrink-0 w-[100px] h-[100px] rounded-lg overflow-hidden bg-[#f5f5f3]">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={title || ""}
                        fill
                        sizes="100px"
                        className="object-cover"
                        loading="lazy"
                        decoding="async"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-black/10">
                        <Icon icon={Sparkles} size={24} />
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 flex flex-col justify-center min-h-[100px] py-1">
                <h3 className="font-display text-[16px] font-medium leading-snug text-foreground tracking-tight">
                    {title}
                </h3>

                {description && (
                    <p className="text-[12px] leading-relaxed text-foreground/40 mt-1 line-clamp-2">
                        {description}
                    </p>
                )}

                <div className="flex items-center gap-2 mt-auto pt-2">
                    <span className="text-[15px] font-medium text-foreground/70 tabular-nums">
                        {Math.floor(price) === price ? price : price.toFixed(2)} ₾
                    </span>

                    {weight && (
                        <>
                            <span className="text-foreground/15">·</span>
                            <span className="text-[11px] text-foreground/30">{weight}</span>
                        </>
                    )}

                    {item.is_new && (
                        <>
                            <span className="text-foreground/15">·</span>
                            <span className="text-[10px] uppercase tracking-wider text-foreground/40 font-medium">{ta('new')}</span>
                        </>
                    )}
                </div>

                {!isActive && (
                    <span className="text-[10px] uppercase tracking-wider text-foreground/30 mt-1">
                        {ta('sold_out')}
                    </span>
                )}
            </div>
        </button>
    );
}
