import { Item } from '@/lib/db';
import MenuItem from './MenuItem';

interface CategorySectionProps {
    id: string;
    title: string;
    items: Item[];
    onSelectItem?: (item: Item) => void;
}

export default function CategorySection({ id, title, items, onSelectItem }: CategorySectionProps) {
    if (items.length === 0) return null;

    return (
        <section id={id} className="scroll-mt-24 py-4">
            {title && (
                <h2 className="text-2xl font-bold mb-6 text-foreground/90 tracking-tight px-1 uppercase text-sm">
                    {title}
                </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map((item) => (
                    <MenuItem
                        key={item.id}
                        item={item}
                        onClick={onSelectItem}
                    />
                ))}
            </div>
        </section>
    );
}
