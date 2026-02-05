import { CakeSlice, Coffee, GlassWater, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type CategoryIconKey = 'sparkles' | 'coffee' | 'water' | 'cake';

export const CATEGORY_ICON_OPTIONS: {
    key: CategoryIconKey;
    label: string;
    icon: LucideIcon;
}[] = [
    { key: 'sparkles', label: 'Default', icon: Sparkles },
    { key: 'coffee', label: 'Hot drinks', icon: Coffee },
    { key: 'water', label: 'Cold drinks', icon: GlassWater },
    { key: 'cake', label: 'Dessert', icon: CakeSlice },
];

const CATEGORY_ICON_MAP: Record<CategoryIconKey, LucideIcon> = {
    sparkles: Sparkles,
    coffee: Coffee,
    water: GlassWater,
    cake: CakeSlice,
};

const isCategoryIconKey = (value?: string | null): value is CategoryIconKey => {
    if (!value) return false;
    return Object.prototype.hasOwnProperty.call(CATEGORY_ICON_MAP, value);
};

export const resolveCategoryIconKey = (title: string, iconKey?: string | null): CategoryIconKey => {
    if (isCategoryIconKey(iconKey)) return iconKey;

    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('des') || lowerTitle.includes('дес') || lowerTitle.includes('დეს')) {
        return 'cake';
    }
    if (lowerTitle.includes('hot') || lowerTitle.includes('горяч') || lowerTitle.includes('ცხელ')) {
        return 'coffee';
    }
    if (lowerTitle.includes('cold') || lowerTitle.includes('холод') || lowerTitle.includes('ცივი')) {
        return 'water';
    }
    return 'sparkles';
};

export const getCategoryIcon = (title: string, iconKey?: string | null): LucideIcon => {
    return CATEGORY_ICON_MAP[resolveCategoryIconKey(title, iconKey)];
};
