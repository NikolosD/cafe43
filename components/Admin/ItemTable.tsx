'use client';

import { useState, useMemo, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { adminUpsertItem, adminDeleteItem } from '@/lib/db';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from '@/components/ui/label';
import { Trash2, Pencil, Plus, Upload, X, Search, Filter, ArrowUpDown, Image as ImageIcon, Flame, Leaf, Sparkles, Scale, GripVertical, UtensilsCrossed } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ImageCropper from './ImageCropper';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import imageCompression from 'browser-image-compression';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableRow } from './SortableRow';

interface ItemTableProps {
    initialItems: any[];
    categories: any[];
}

export default function ItemTable({ initialItems, categories }: ItemTableProps) {
    const t = useTranslations('Admin');
    const locale = useLocale();
    const supabase = createClient();
    const router = useRouter();
    const [items, setItems] = useState(initialItems);

    useEffect(() => {
        setItems(initialItems);
    }, [initialItems]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('none');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

    // Form State
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [categoryId, setCategoryId] = useState('');
    const [price, setPrice] = useState(0);
    const [sort, setSort] = useState(0);
    const [isActive, setIsActive] = useState(true);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
    const [weight, setWeight] = useState('');
    const [isNew, setIsNew] = useState(false);
    const [isSpicy, setIsSpicy] = useState(false);
    const [isVegan, setIsVegan] = useState(false);
    const [titles, setTitles] = useState({ ru: '', en: '', ge: '' });
    const [originalTitles, setOriginalTitles] = useState({ ru: '', en: '', ge: '' });
    const [descriptions, setDescriptions] = useState({ ru: '', en: '', ge: '' });
    const [originalDescriptions, setOriginalDescriptions] = useState({ ru: '', en: '', ge: '' });
    const [dirtyFields, setDirtyFields] = useState<Set<string>>(new Set());

    // Cropper state
    const [isCropperOpen, setIsCropperOpen] = useState(false);
    const [pendingImage, setPendingImage] = useState<string | null>(null);

    // Helper to get filename from URL
    const getStoragePath = (url: string | null) => {
        if (!url) return null;
        const parts = url.split('/');
        return parts[parts.length - 1];
    };

    const deleteOldImage = async (url: string | null) => {
        const path = getStoragePath(url);
        if (path) {
            await supabase.storage.from('menu-images').remove([path]);
        }
    };

    const filteredItems = useMemo(() => {
        if (categoryFilter === 'none') return [];

        const filtered = items.filter(item => {
            const matchesSearch = item.item_translations.some((t: any) =>
                t.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
            const matchesCategory = categoryFilter === 'all' || item.category_id === categoryFilter;
            const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' ? item.is_active : !item.is_active);

            return matchesSearch && matchesCategory && matchesStatus;
        });

        if (sortConfig) {
            return [...filtered].sort((a, b) => {
                let vA, vB;
                if (sortConfig.key === 'title') {
                    vA = a.item_translations.find((t: any) => t.lang === locale)?.title || '';
                    vB = b.item_translations.find((t: any) => t.lang === locale)?.title || '';
                } else if (sortConfig.key === 'category') {
                    const catA = a.categories?.category_translations?.find((t: any) => t.lang === locale)?.title || '';
                    const catB = b.categories?.category_translations?.find((t: any) => t.lang === locale)?.title || '';
                    vA = catA;
                    vB = catB;
                } else {
                    vA = (a as any)[sortConfig.key];
                    vB = (b as any)[sortConfig.key];
                }

                if (vA < vB) return sortConfig.direction === 'asc' ? -1 : 1;
                if (vA > vB) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return filtered.sort((a, b) => a.sort - b.sort);
    }, [items, searchQuery, categoryFilter, statusFilter, sortConfig, locale]);

    const isDndEnabled = categoryFilter !== 'all' && categoryFilter !== 'none' && !sortConfig;
    const selectedCategoryName = categories.find(c => c.id === categoryFilter)?.category_translations.find((t: any) => t.lang === locale)?.title || '';

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setItems((prevItems) => {
                const oldIndex = prevItems.findIndex((i) => i.id === active.id);
                const newIndex = prevItems.findIndex((i) => i.id === over.id);
                const updated = arrayMove(prevItems, oldIndex, newIndex);

                // Persist to DB
                const persistOrder = async () => {
                    try {
                        const updates = updated.map((item, index) => ({
                            id: item.id,
                            sort: (index + 1) * 10,
                        }));

                        const { error } = await supabase
                            .from('items')
                            .upsert(updates, { onConflict: 'id' });

                        if (error) throw error;
                        console.log('Order updated');
                    } catch (err) {
                        console.error('Failed to save order:', err);
                        alert('Failed to save order. Rolling back...');
                        setItems(prevItems); // Rollback
                    }
                };

                persistOrder();
                return updated.map((item, index) => ({ ...item, sort: (index + 1) * 10 }));
            });
        }
    };

    const handleOpen = (item?: any) => {
        if (item) {
            setCurrentId(item.id);
            setCategoryId(item.category_id);
            setPrice(item.price);
            setSort(item.sort);
            setIsActive(item.is_active);
            setImageUrl(item.image_url);
            setOriginalImageUrl(item.image_url);
            setWeight(item.weight || '');
            setIsNew(!!item.is_new);
            setIsSpicy(!!item.is_spicy);
            setIsVegan(!!item.is_vegan);

            const getTrans = (lang: string) => item.item_translations.find((t: any) => t.lang === lang) || {};
            const t_ge = getTrans('ge');

            setTitles({
                ru: getTrans('ru').title || '',
                en: getTrans('en').title || '',
                ge: t_ge.title || ''
            });
            setOriginalTitles({
                ru: getTrans('ru').title || '',
                en: getTrans('en').title || '',
                ge: t_ge.title || ''
            });
            setDescriptions({
                ru: getTrans('ru').description || '',
                en: getTrans('en').description || '',
                ge: t_ge.description || ''
            });
            setOriginalDescriptions({
                ru: getTrans('ru').description || '',
                en: getTrans('en').description || '',
                ge: t_ge.description || ''
            });
            setDirtyFields(new Set());
        } else {
            setCurrentId(null);
            setCategoryId(categories[0]?.id || '');
            setPrice(0);
            setSort(0);
            setIsActive(true);
            setImageUrl(null);
            setOriginalImageUrl(null);
            setWeight('');
            setIsNew(false);
            setIsSpicy(false);
            setIsVegan(false);
            setTitles({ ru: '', en: '', ge: '' });
            setOriginalTitles({ ru: '', en: '', ge: '' });
            setDescriptions({ ru: '', en: '', ge: '' });
            setOriginalDescriptions({ ru: '', en: '', ge: '' });
            setDirtyFields(new Set());

            // Pre-fill category if in category view
            if (categoryFilter !== 'all' && categoryFilter !== 'none') {
                setCategoryId(categoryFilter);
            }
        }
        setIsOpen(true);
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = event.target.files?.[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = () => {
                setPendingImage(reader.result as string);
                setIsCropperOpen(true);
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error("Error reading file:", error);
        }
    };

    const handleCropComplete = async (croppedBlob: Blob) => {
        setIsCropperOpen(false);
        setUploading(true);

        try {
            let file = new File([croppedBlob], 'item.jpg', { type: 'image/jpeg' });

            // Image compression options
            const options = {
                maxSizeMB: 0.8,
                maxWidthOrHeight: 1200,
                useWebWorker: true
            };

            try {
                const compressedFile = await imageCompression(file, options);
                file = compressedFile;
                console.log(`Compressed size: ${file.size / 1024 / 1024}MB`);
            } catch (error) {
                console.error("Compression error:", error);
            }

            const fileExt = 'jpg';
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('menu-images')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('menu-images')
                .getPublicUrl(filePath);

            // If we already uploaded something else in this session, delete it
            if (imageUrl && imageUrl !== originalImageUrl) {
                await deleteOldImage(imageUrl);
            }

            setImageUrl(publicUrl);
        } catch (error) {
            alert('Error uploading image!');
            console.error(error);
        } finally {
            setUploading(false);
            setPendingImage(null);
        }
    };




    const handleSave = async () => {
        if (!titles.ge.trim()) {
            alert(t('georgian_required'));
            return;
        }
        setLoading(true);
        try {
            // Auto-translate if Georgian fields changed AND targets aren't dirty
            const newTitles = { ...titles };
            const newDescriptions = { ...descriptions };

            const geTitleChanged = titles.ge !== originalTitles.ge;
            const geDescChanged = descriptions.ge !== originalDescriptions.ge;

            // Handle Titles
            if (geTitleChanged) {
                if (!dirtyFields.has('title_ru') && (!titles.ru || titles.ru === originalTitles.ru)) {
                    const res = await fetch('/api/translate', {
                        method: 'POST',
                        body: JSON.stringify({ text: titles.ge, target: 'ru', format: 'title' }),
                    }).then(r => r.json());
                    if (res.text) newTitles.ru = res.text;
                }
                if (!dirtyFields.has('title_en') && (!titles.en || titles.en === originalTitles.en)) {
                    const res = await fetch('/api/translate', {
                        method: 'POST',
                        body: JSON.stringify({ text: titles.ge, target: 'en', format: 'title' }),
                    }).then(r => r.json());
                    if (res.text) newTitles.en = res.text;
                }
            } else {
                // Initial creation fallback
                if (!newTitles.ru.trim()) {
                    const res = await fetch('/api/translate', { method: 'POST', body: JSON.stringify({ text: titles.ge, target: 'ru', format: 'title' }) }).then(r => r.json());
                    if (res.text) newTitles.ru = res.text;
                }
                if (!newTitles.en.trim()) {
                    const res = await fetch('/api/translate', { method: 'POST', body: JSON.stringify({ text: titles.ge, target: 'en', format: 'title' }) }).then(r => r.json());
                    if (res.text) newTitles.en = res.text;
                }
            }

            // Handle Descriptions
            if (geDescChanged && descriptions.ge.trim()) {
                if (!dirtyFields.has('description_ru') && (!descriptions.ru || descriptions.ru === originalDescriptions.ru)) {
                    const res = await fetch('/api/translate', { method: 'POST', body: JSON.stringify({ text: descriptions.ge, target: 'ru' }) }).then(r => r.json());
                    if (res.text) newDescriptions.ru = res.text;
                }
                if (!dirtyFields.has('description_en') && (!descriptions.en || descriptions.en === originalDescriptions.en)) {
                    const res = await fetch('/api/translate', { method: 'POST', body: JSON.stringify({ text: descriptions.ge, target: 'en' }) }).then(r => r.json());
                    if (res.text) newDescriptions.en = res.text;
                }
            } else if (descriptions.ge.trim()) {
                // Initial creation fallback
                if (!newDescriptions.ru.trim()) {
                    const res = await fetch('/api/translate', { method: 'POST', body: JSON.stringify({ text: descriptions.ge, target: 'ru' }) }).then(r => r.json());
                    if (res.text) newDescriptions.ru = res.text;
                }
                if (!newDescriptions.en.trim()) {
                    const res = await fetch('/api/translate', { method: 'POST', body: JSON.stringify({ text: descriptions.ge, target: 'en' }) }).then(r => r.json());
                    if (res.text) newDescriptions.en = res.text;
                }
            }

            setTitles(newTitles);
            setDescriptions(newDescriptions);

            const resolvedSort = currentId
                ? sort
                : items
                    .filter(i => i.category_id === categoryId)
                    .reduce((max, i) => Math.max(max, i.sort ?? 0), 0) + 10;

            const itemData = {
                id: currentId || undefined,
                category_id: categoryId,
                price,
                image_url: imageUrl,
                sort: resolvedSort,
                is_active: isActive,
                weight: weight || null,
                is_new: isNew,
                is_spicy: isSpicy,
                is_vegan: isVegan
            };

            if (currentId) (itemData as any).id = currentId;

            const translations = [
                { lang: 'ru', title: newTitles.ru, description: newDescriptions.ru },
                { lang: 'en', title: newTitles.en, description: newDescriptions.en },
                { lang: 'ge', title: newTitles.ge, description: newDescriptions.ge },
            ];

            await adminUpsertItem(supabase, itemData, translations);

            // Cleanup: If the image changed, delete the previous one from the record
            if (originalImageUrl && imageUrl !== originalImageUrl) {
                await deleteOldImage(originalImageUrl);
            }

            setIsOpen(false);
            router.refresh();
        } catch (error) {
            console.error(error);
            alert('Error saving item');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (item: any) => {
        if (!confirm('Are you sure?')) return;
        try {
            await adminDeleteItem(supabase, item.id);

            // Cleanup: delete image from storage
            if (item.image_url) {
                await deleteOldImage(item.image_url);
            }

            setItems(items.filter(i => i.id !== item.id));
            router.refresh();
        } catch (e) {
            alert('Error deleting');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900">{t('items_title')}</h1>
                    <p className="text-zinc-500 text-sm">{t('items_desc')}</p>
                </div>
                <Button
                    onClick={() => handleOpen()}
                    disabled={categories.length === 0 || categoryFilter === 'none'}
                    className="bg-zinc-900 hover:bg-zinc-800 shadow-sm shrink-0"
                    title={categoryFilter === 'none' ? t('select_category_to_manage') : ""}
                >
                    <Plus className="mr-2 h-4 w-4" /> {t('add_dish')}
                </Button>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-full sm:w-[240px]">
                        <Select value={categoryFilter} onValueChange={(v) => {
                            setCategoryFilter(v);
                            setSortConfig(null); // Reset manual sort on category change to enable D&D
                        }}>
                            <SelectTrigger className="w-full bg-white border-zinc-200 font-medium">
                                <Filter className="w-4 h-4 mr-2 text-zinc-400" />
                                <SelectValue placeholder={t('select_category_placeholder')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none" className="text-zinc-400">{t('select_category_placeholder')}</SelectItem>
                                <SelectItem value="all">{t('view_all_categories')}</SelectItem>
                                {categories.map(c => {
                                    const title = c.category_translations.find((t: any) => t.lang === locale)?.title ||
                                        c.category_translations.find((t: any) => t.lang === 'ge')?.title ||
                                        c.category_translations[0]?.title;
                                    return <SelectItem key={c.id} value={c.id}>{title}</SelectItem>
                                })}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={t('search_dishes')}
                            className="pl-9 bg-white"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[130px] bg-white">
                                <SelectValue placeholder={t('status')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{t('all_status')}</SelectItem>
                                <SelectItem value="active">{t('active')}</SelectItem>
                                <SelectItem value="inactive">{t('sold_out')}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {categoryFilter !== 'none' && (
                    <div className="flex items-center gap-2 px-1 text-xs text-zinc-500 italic">
                        {isDndEnabled ? (
                            <>
                                <GripVertical className="w-3 h-3" />
                                <span>{t('drag_to_reorder_within', { category: selectedCategoryName })}</span>
                            </>
                        ) : (
                            <span>{categoryFilter === 'all' ? t('reorder_disabled_all') : t('reorder_disabled_sort')}</span>
                        )}
                    </div>
                )}
            </div>

            <Card className="rounded-xl shadow-sm border-zinc-200 overflow-hidden bg-white">
                {filteredItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="bg-zinc-50 p-4 rounded-full mb-4">
                            {categoryFilter === 'none' ? (
                                <Filter className="w-8 h-8 text-zinc-300" />
                            ) : (
                                <UtensilsCrossed className="w-8 h-8 text-zinc-300" />
                            )}
                        </div>
                        <h3 className="font-medium text-zinc-900">
                            {categoryFilter === 'none' ? t('select_category_to_manage') : t('no_dishes')}
                        </h3>
                        <p className="text-zinc-500 text-sm mt-2 max-w-[280px] mx-auto">
                            {categoryFilter === 'none'
                                ? t('select_category_hint')
                                : t('no_dishes_desc')}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-zinc-50/50">
                                <TableRow>
                                    <TableHead className="w-[40px] px-2"></TableHead>
                                    <TableHead className="w-[80px]">{t('dish_image')}</TableHead>
                                    <TableHead
                                        className="text-zinc-900 font-semibold cursor-pointer hover:text-zinc-900 transition-colors"
                                        onClick={() => setSortConfig(prev => ({ key: 'title', direction: prev?.key === 'title' && prev.direction === 'asc' ? 'desc' : 'asc' }))}
                                    >
                                        <div className="flex items-center gap-1">{t('dish_title')} <ArrowUpDown className="w-3 h-3" /></div>
                                    </TableHead>
                                    <TableHead
                                        className="text-zinc-600 cursor-pointer hover:text-zinc-900 transition-colors"
                                        onClick={() => setSortConfig(prev => ({ key: 'category', direction: prev?.key === 'category' && prev.direction === 'asc' ? 'desc' : 'asc' }))}
                                    >
                                        <div className="flex items-center gap-1">{t('category')} <ArrowUpDown className="w-3 h-3" /></div>
                                    </TableHead>
                                    <TableHead
                                        className="text-zinc-900 font-medium cursor-pointer hover:text-zinc-900 transition-colors"
                                        onClick={() => setSortConfig(prev => ({ key: 'price', direction: prev?.key === 'price' && prev.direction === 'asc' ? 'desc' : 'asc' }))}
                                    >
                                        <div className="flex items-center gap-1">{t('price')} <ArrowUpDown className="w-3 h-3" /></div>
                                    </TableHead>
                                    <TableHead className="w-[100px] text-zinc-600">{t('status')}</TableHead>
                                    <TableHead className="text-right w-[100px]">{t('actions')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleDragEnd}
                                    modifiers={[restrictToVerticalAxis]}
                                >
                                    <SortableContext
                                        items={filteredItems.map(i => i.id)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        {filteredItems.map((item) => {
                                            const itemTitle = item.item_translations.find((t: any) => t.lang === locale)?.title ||
                                                item.item_translations.find((t: any) => t.lang === 'ge')?.title ||
                                                item.item_translations[0]?.title;
                                            const catTranslations = item.categories?.category_translations || [];
                                            const catTitle = catTranslations.find((t: any) => t.lang === locale)?.title ||
                                                catTranslations.find((t: any) => t.lang === 'ge')?.title ||
                                                catTranslations[0]?.title || 'Unknown';

                                            return (
                                                <SortableRow key={item.id} id={item.id} disabled={!isDndEnabled}>
                                                    <TableCell>
                                                        {item.image_url ? (
                                                            <div className="relative h-10 w-10 overflow-hidden rounded-lg border border-zinc-100">
                                                                <img src={item.image_url} alt="Item" className="w-full h-full object-cover" />
                                                            </div>
                                                        ) : (
                                                            <div className="h-10 w-10 bg-zinc-100 rounded-lg flex items-center justify-center">
                                                                <ImageIcon className="w-4 h-4 text-zinc-300" />
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="font-medium text-zinc-900">{itemTitle || <span className="text-red-400 font-normal text-xs">No translation</span>}</TableCell>
                                                    <TableCell className="text-zinc-600 text-sm">{catTitle}</TableCell>
                                                    <TableCell className="font-semibold text-zinc-900">{item.price} ₾</TableCell>
                                                    <TableCell>
                                                        {item.is_active ? (
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                                                                {t('active')}
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-500">
                                                                {t('sold_out')}
                                                            </span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-zinc-100 hover:text-blue-600" onClick={() => handleOpen(item)}>
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-50 hover:text-red-600" onClick={() => handleDelete(item)}>
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </SortableRow>
                                            );
                                        })}
                                    </SortableContext>
                                </DndContext>
                            </TableBody>
                        </Table>
                    </div>
                )}
            </Card>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl">
                    <DialogHeader>
                        <DialogTitle>{currentId ? t('edit_dish') : t('new_dish')}</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-4">
                        {/* Left Column: Main Info & Image */}
                        <div className="md:col-span-1 space-y-6">
                            <div>
                                <Label className="block mb-3">{t('dish_image')}</Label>
                                <label
                                    htmlFor="item-image-upload"
                                    className="border-2 border-dashed border-zinc-200 rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-zinc-50 transition-colors cursor-pointer relative block"
                                >
                                    {imageUrl ? (
                                        <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-white mb-2 shadow-sm ring-1 ring-zinc-200">
                                            <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setImageUrl(null); }}
                                                className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors z-20"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="w-full aspect-square rounded-lg bg-zinc-100 mb-2 flex items-center justify-center">
                                            <ImageIcon className="w-8 h-8 text-zinc-300" />
                                        </div>
                                    )}
                                    <input
                                        id="item-image-upload"
                                        type="file"
                                        className="sr-only"
                                        onChange={handleImageUpload}
                                        disabled={uploading}
                                        accept="image/*"
                                    />
                                    <div className="text-center">
                                        <span className="text-xs font-medium text-zinc-900 block">{uploading ? 'Uploading...' : t('click_to_upload')}</span>
                                        <span className="text-[10px] text-zinc-500">{t('image_requirements')}</span>
                                    </div>
                                </label>
                            </div>

                            <div className="space-y-4 bg-zinc-50 p-4 rounded-lg border border-zinc-100">
                                <div className="space-y-2">
                                    <Label>{t('category')}</Label>
                                    <Select value={categoryId} onValueChange={setCategoryId}>
                                        <SelectTrigger className="bg-white">
                                            <SelectValue placeholder="Select..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map(c => {
                                                const title = c.category_translations.find((t: any) => t.lang === 'ge')?.title || c.id;
                                                return <SelectItem key={c.id} value={c.id}>{title}</SelectItem>;
                                            })}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>{t('weight_label')}</Label>
                                    <Input className="bg-white" value={weight} onChange={e => setWeight(e.target.value)} placeholder={t('weight_placeholder')} />
                                </div>
                                <div className="space-y-2">
                                    <Label>{t('pricing_sort')}</Label>
                                    <Input
                                        type="number"
                                        className="bg-white"
                                        value={price}
                                        onChange={e => setPrice(Number(e.target.value))}
                                        placeholder="Price"
                                    />
                                </div>
                                <div className="space-y-3 pt-2">
                                    <Label className="text-xs uppercase text-zinc-400 font-bold">{t('badges')}</Label>
                                    <div className="flex items-center justify-between p-2 hover:bg-white rounded-lg transition-colors">
                                        <div className="flex items-center gap-2">
                                            <Sparkles className="w-4 h-4 text-yellow-500" />
                                            <Label className="text-sm">{t('new')}</Label>
                                        </div>
                                        <Switch checked={isNew} onCheckedChange={setIsNew} />
                                    </div>
                                    <div className="flex items-center justify-between p-2 hover:bg-white rounded-lg transition-colors">
                                        <div className="flex items-center gap-2">
                                            <Flame className="w-4 h-4 text-red-500" />
                                            <Label className="text-sm">{t('spicy')}</Label>
                                        </div>
                                        <Switch checked={isSpicy} onCheckedChange={setIsSpicy} />
                                    </div>
                                    <div className="flex items-center justify-between p-2 hover:bg-white rounded-lg transition-colors">
                                        <div className="flex items-center gap-2">
                                            <Leaf className="w-4 h-4 text-emerald-500" />
                                            <Label className="text-sm">{t('vegan')}</Label>
                                        </div>
                                        <Switch checked={isVegan} onCheckedChange={setIsVegan} />
                                    </div>
                                    <div className="flex items-center justify-between p-2 hover:bg-white rounded-lg transition-colors border-t border-zinc-100 mt-2 pt-2">
                                        <Label className="text-sm font-bold">{t('available')}</Label>
                                        <Switch checked={isActive} onCheckedChange={setIsActive} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Translations */}
                        <div className="md:col-span-2 space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
                                    🇬🇪 {t('georgian_main')} <span className="text-zinc-400 text-[10px] font-normal normal-case">({t('primary')})</span>
                                </h3>
                                <div className="space-y-2">
                                    <Label>Title <span className="text-red-500">*</span></Label>
                                    <Input
                                        value={titles.ge}
                                        onChange={e => {
                                            setTitles({ ...titles, ge: e.target.value });
                                            setDirtyFields(prev => new Set(prev).add('title_ge'));
                                        }}
                                        className="font-medium text-lg"
                                        placeholder={t('dish_name_placeholder')}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Textarea
                                        value={descriptions.ge}
                                        onChange={e => {
                                            setDescriptions({ ...descriptions, ge: e.target.value });
                                            setDirtyFields(prev => new Set(prev).add('description_ge'));
                                        }}
                                        className="min-h-[80px]"
                                        placeholder={t('ingredients_placeholder')}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                <div className="space-y-4">
                                    <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">🇺🇸 {t('english')}</h3>
                                    <div className="space-y-2">
                                        <Label>Title</Label>
                                        <Input value={titles.en} onChange={e => setTitles({ ...titles, en: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Description</Label>
                                        <Textarea value={descriptions.en} onChange={e => setDescriptions({ ...descriptions, en: e.target.value })} className="min-h-[80px]" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">🇷🇺 {t('russian')}</h3>
                                    <div className="space-y-2">
                                        <Label>Title</Label>
                                        <Input value={titles.ru} onChange={e => setTitles({ ...titles, ru: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Description</Label>
                                        <Textarea value={descriptions.ru} onChange={e => setDescriptions({ ...descriptions, ru: e.target.value })} className="min-h-[80px]" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="mt-6 border-t pt-4">
                        <Button variant="outline" onClick={() => setIsOpen(false)}>{t('cancel')}</Button>
                        <Button onClick={handleSave} disabled={loading || uploading} className="bg-zinc-900 text-white min-w-[120px]">
                            {loading ? t('saving') : t('save_dish')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <ImageCropper
                image={pendingImage}
                isOpen={isCropperOpen}
                onCropComplete={handleCropComplete}
                onCancel={() => {
                    setIsCropperOpen(false);
                    setPendingImage(null);
                }}
                aspect={1}
            />
        </div>
    );
}


