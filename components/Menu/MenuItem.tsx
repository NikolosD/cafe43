import Image from 'next/image';
import { cn } from "@/lib/utils";
import { Sparkles } from 'lucide-react';

interface MenuItemProps {
    item: any;
    onClick?: (item: any) => void;
}

export default function MenuItem({ item, onClick }: MenuItemProps) {
    const { title, description, price, image_url: imageUrl, is_active: isActive = true } = item;

    return (
        <button
            onClick={() => onClick?.(item)}
            className={cn(
                "group relative flex items-start p-4 rounded-2xl transition-all duration-300 text-left w-full overflow-hidden",
                "bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]",
                "border border-transparent hover:border-primary/10",
                "hover:-translate-y-0.5 active:scale-[0.99]",
                !isActive && "opacity-60 grayscale"
            )}
        >
            {/* Фоновый градиент при наведении */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-transparent to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

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
                        <Sparkles className="w-6 h-6" />
                    </div>
                )}

                {/* Блик на изображении при наведении */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 flex flex-col justify-center min-h-[80px] relative">
                <div className="flex justify-between items-start gap-3">
                    <h3 className="font-semibold text-[17px] leading-snug text-foreground/90 group-hover:text-foreground transition-colors">
                        {title}
                    </h3>
                    <span className="font-bold text-[16px] text-primary tabular-nums shrink-0 bg-primary/5 px-2.5 py-1 rounded-lg min-w-[70px] text-center">
                        {Math.floor(price) === price ? price : price.toFixed(2)} ₾
                    </span>
                </div>

                {description && (
                    <p className="text-[13px] leading-relaxed text-muted-foreground mt-1.5 line-clamp-2 group-hover:text-muted-foreground/80 transition-colors">
                        {description}
                    </p>
                )}

                {!isActive && (
                    <span className="absolute top-0 right-0 text-[10px] uppercase font-bold tracking-wider text-muted-foreground/70 bg-black/5 px-2.5 py-1 rounded-full">
                        Sold Out
                    </span>
                )}
            </div>

            {/* Декоративный акцент */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/0 via-primary/30 to-accent/0 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
        </button>
    );
}
