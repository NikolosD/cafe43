'use client';

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "lucide-react"; // Actually let's just use div for badges to stay vanilla
import { X, Flame, Leaf, Sparkles, Scale } from "lucide-react";
import { Item } from "@/lib/db";
import { cn } from "@/lib/utils";

interface ItemDetailSheetProps {
    item: Item | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function ItemDetailSheet({ item, isOpen, onClose }: ItemDetailSheetProps) {
    if (!item) return null;

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            {/* @ts-ignore */}
            <SheetContent
                side="bottom"
                className="h-[92vh] sm:h-[85vh] p-0 overflow-hidden rounded-t-[32px] border-none bg-white focus-visible:ring-0"
            >
                <div className="h-full flex flex-col overflow-y-auto pb-10">
                    {/* Hero Image */}
                    <div className="relative aspect-square sm:aspect-video w-full bg-zinc-100 shrink-0">
                        {item.image_url ? (
                            <img
                                src={item.image_url}
                                alt={item.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-300">
                                <Sparkles className="w-12 h-12 opacity-20" />
                            </div>
                        )}

                        {/* Custom Close Button for mobile feel */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-md text-white rounded-full hover:bg-black/70 transition-colors z-50"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Top Badges */}
                        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                            {item.is_new && (
                                <div className="px-3 py-1 bg-yellow-400 text-black text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1 shadow-lg">
                                    <Sparkles className="w-3 h-3" /> New
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="px-6 py-8 space-y-6">
                        <div className="flex justify-between items-start gap-4">
                            <div className="space-y-1">
                                <h2 className="text-3xl font-black tracking-tight text-zinc-900 leading-tight">
                                    {item.title}
                                </h2>
                                <div className="flex items-center gap-3">
                                    {item.weight && (
                                        <div className="flex items-center gap-1.5 text-zinc-500 text-sm font-medium">
                                            <Scale className="w-4 h-4" />
                                            {item.weight}
                                        </div>
                                    )}
                                    <div className="flex gap-2">
                                        {item.is_spicy && (
                                            <Flame className="w-5 h-5 text-red-500 fill-red-500" />
                                        )}
                                        {item.is_vegan && (
                                            <Leaf className="w-5 h-5 text-emerald-500 fill-emerald-500" />
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="text-2xl font-black text-zinc-900 whitespace-nowrap bg-zinc-50 px-4 py-2 rounded-2xl border border-zinc-100">
                                {item.price} ₾
                            </div>
                        </div>

                        {/* Description */}
                        {item.description && (
                            <div className="space-y-3">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Description</h3>
                                <p className="text-zinc-600 leading-relaxed text-lg">
                                    {item.description}
                                </p>
                            </div>
                        )}

                        {/* Status Badges */}
                        {!item.is_active && (
                            <div className="mt-8 p-4 bg-zinc-100 rounded-2xl text-center font-bold text-zinc-500 uppercase tracking-widest border-2 border-dashed border-zinc-200">
                                Currently Sold Out
                            </div>
                        )}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
