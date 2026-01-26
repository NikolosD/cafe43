import Image from 'next/image';
import { cn } from "@/lib/utils";

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
                "group relative flex items-start p-4 rounded-2xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all duration-300 border border-transparent hover:border-black/5 text-left w-full",
                !isActive && "opacity-60 grayscale"
            )}
        >
            {/* Image */}
            <div className="relative shrink-0 w-[72px] h-[72px] rounded-xl overflow-hidden bg-black/5 mr-4">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground/50 uppercase font-medium tracking-wider">
                        No Photo
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 flex flex-col justify-center min-h-[72px]">
                <div className="flex justify-between items-start gap-2">
                    <h3 className="font-semibold text-[17px] leading-snug text-foreground/90 group-hover:text-foreground transition-colors">
                        {title}
                    </h3>
                    <span className="font-semibold text-[15px] text-foreground tabular-nums shrink-0">
                        {Math.floor(price) === price ? price : price.toFixed(2)} ₾
                    </span>
                </div>

                {description && (
                    <p className="text-[13px] leading-relaxed text-muted-foreground mt-1 line-clamp-2">
                        {description}
                    </p>
                )}

                {!isActive && (
                    <span className="absolute top-3 right-3 text-[10px] uppercase font-bold tracking-wider text-muted-foreground/70 bg-black/5 px-2 py-1 rounded-full">
                        Sold Out
                    </span>
                )}
            </div>
        </button>
    );
}
