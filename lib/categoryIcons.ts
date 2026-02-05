import {
    Beer,
    CakeSlice,
    Coffee,
    Fish,
    Flame,
    GlassWater,
    IceCream,
    Leaf,
    Pizza,
    Salad,
    Sandwich,
    Sparkles,
    UtensilsCrossed,
    Wine,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type CategoryIconKey =
    | 'sparkles'
    | 'utensils'
    | 'coffee'
    | 'water'
    | 'cake'
    | 'pizza'
    | 'salad'
    | 'sandwich'
    | 'icecream'
    | 'beer'
    | 'wine'
    | 'fish'
    | 'leaf'
    | 'flame';

export const CATEGORY_ICON_OPTIONS: {
    key: CategoryIconKey;
    label: string;
    icon: LucideIcon;
}[] = [
    { key: 'sparkles', label: 'Default', icon: Sparkles },
    { key: 'utensils', label: 'Main dishes', icon: UtensilsCrossed },
    { key: 'coffee', label: 'Hot drinks', icon: Coffee },
    { key: 'water', label: 'Cold drinks', icon: GlassWater },
    { key: 'cake', label: 'Dessert', icon: CakeSlice },
    { key: 'pizza', label: 'Pizza', icon: Pizza },
    { key: 'salad', label: 'Salad', icon: Salad },
    { key: 'sandwich', label: 'Sandwich', icon: Sandwich },
    { key: 'icecream', label: 'Ice cream', icon: IceCream },
    { key: 'beer', label: 'Beer', icon: Beer },
    { key: 'wine', label: 'Wine', icon: Wine },
    { key: 'fish', label: 'Fish', icon: Fish },
    { key: 'leaf', label: 'Vegan', icon: Leaf },
    { key: 'flame', label: 'Spicy', icon: Flame },
];

const CATEGORY_ICON_MAP: Record<CategoryIconKey, LucideIcon> = {
    sparkles: Sparkles,
    utensils: UtensilsCrossed,
    coffee: Coffee,
    water: GlassWater,
    cake: CakeSlice,
    pizza: Pizza,
    salad: Salad,
    sandwich: Sandwich,
    icecream: IceCream,
    beer: Beer,
    wine: Wine,
    fish: Fish,
    leaf: Leaf,
    flame: Flame,
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
    if (lowerTitle.includes('pizza') || lowerTitle.includes('пиц') || lowerTitle.includes('პიც')) {
        return 'pizza';
    }
    if (lowerTitle.includes('salad') || lowerTitle.includes('салат') || lowerTitle.includes('სალ')) {
        return 'salad';
    }
    if (lowerTitle.includes('sandwich') || lowerTitle.includes('сэндв') || lowerTitle.includes('სენდ')) {
        return 'sandwich';
    }
    if (lowerTitle.includes('ice') || lowerTitle.includes('морож') || lowerTitle.includes('ნაყ')) {
        return 'icecream';
    }
    if (lowerTitle.includes('beer') || lowerTitle.includes('пиво') || lowerTitle.includes('ლუდ')) {
        return 'beer';
    }
    if (lowerTitle.includes('wine') || lowerTitle.includes('вино') || lowerTitle.includes('ღვინ')) {
        return 'wine';
    }
    if (lowerTitle.includes('fish') || lowerTitle.includes('рыб') || lowerTitle.includes('თევზ')) {
        return 'fish';
    }
    return 'sparkles';
};

export const getCategoryIcon = (title: string, iconKey?: string | null): LucideIcon => {
    return CATEGORY_ICON_MAP[resolveCategoryIconKey(title, iconKey)];
};
