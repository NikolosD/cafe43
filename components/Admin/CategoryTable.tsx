'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { adminUpsertCategory, adminDeleteCategory } from '@/lib/db';
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
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Trash2, Pencil, Plus, Layers, Search, Filter, ArrowUpDown, Upload, Image as ImageIcon, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface CategoryTableProps {
    initialCategories: any[];
}

export default function CategoryTable({ initialCategories }: CategoryTableProps) {
    const t = useTranslations('Admin');
    const supabase = createClient();
    const router = useRouter();
    const [categories, setCategories] = useState(initialCategories);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Filter & Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    // Form State
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [sort, setSort] = useState(10);
    const [isActive, setIsActive] = useState(true);
    const [titles, setTitles] = useState({ ru: '', en: '', ge: '' });
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);

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

    // Filter Logic
    const filteredCategories = categories.filter(cat => {
        const matchesSearch =
            cat.category_translations.some((t: any) => t.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
            String(cat.sort).includes(searchQuery);

        const matchesStatus =
            statusFilter === 'all' ? true :
                statusFilter === 'active' ? cat.is_active :
                    !cat.is_active;

        return matchesSearch && matchesStatus;
    }).sort((a, b) => {
        return sortOrder === 'asc' ? a.sort - b.sort : b.sort - a.sort;
    });

    const handleOpen = (category?: any) => {
        if (category) {
            setCurrentId(category.id);
            setSort(category.sort);
            setIsActive(category.is_active);
            const ru = category.category_translations.find((t: any) => t.lang === 'ru')?.title || '';
            const en = category.category_translations.find((t: any) => t.lang === 'en')?.title || '';
            const ge = category.category_translations.find((t: any) => t.lang === 'ge')?.title || '';
            setTitles({ ru, en, ge });
            setImageUrl(category.image_url || null);
            setOriginalImageUrl(category.image_url || null);
        } else {
            setCurrentId(null);
            setSort(categories.length * 10 + 10);
            setIsActive(true);
            setTitles({ ru: '', en: '', ge: '' });
            setImageUrl(null);
            setOriginalImageUrl(null);
        }
        setIsOpen(true);
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            if (!event.target.files || event.target.files.length === 0) {
                return;
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
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
        }
    };

    const handleSave = async () => {
        if (!titles.ge.trim()) {
            alert(t('georgian_required'));
            return;
        }
        setLoading(true);
        try {
            // Auto-translate if empty
            const newTitles = { ...titles };
            if (!newTitles.ru.trim()) {
                const res = await fetch('/api/translate', {
                    method: 'POST',
                    body: JSON.stringify({ text: titles.ge, target: 'ru', format: 'title' }),
                }).then(r => r.json());
                if (res.text) newTitles.ru = res.text;
            }
            if (!newTitles.en.trim()) {
                const res = await fetch('/api/translate', {
                    method: 'POST',
                    body: JSON.stringify({ text: titles.ge, target: 'en', format: 'title' }),
                }).then(r => r.json());
                if (res.text) newTitles.en = res.text;
            }
            setTitles(newTitles);

            const categoryData = {
                id: currentId || undefined,
                sort,
                is_active: isActive,
                image_url: imageUrl
            };

            const translations = [
                { lang: 'ru', title: newTitles.ru },
                { lang: 'en', title: newTitles.en },
                { lang: 'ge', title: newTitles.ge },
            ];

            await adminUpsertCategory(supabase, categoryData, translations);

            // Cleanup: If the image changed, delete the previous one from the record
            if (originalImageUrl && imageUrl !== originalImageUrl) {
                await deleteOldImage(originalImageUrl);
            }

            setIsOpen(false);
            router.refresh();
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert('Error saving category');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (category: any) => {
        if (!confirm('Are you sure?')) return;
        try {
            await adminDeleteCategory(supabase, category.id);

            // Cleanup: delete image from storage
            if (category.image_url) {
                await deleteOldImage(category.image_url);
            }

            setCategories(categories.filter(c => c.id !== category.id));
            router.refresh();
            window.location.reload();
        } catch (e) {
            alert('Error deleting');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900">{t('categories')}</h1>
                    <p className="text-zinc-500 text-sm">{t('categories_desc')}</p>
                </div>
                <Button onClick={() => handleOpen()} className="bg-zinc-900 hover:bg-zinc-800 shadow-sm shrink-0">
                    <Plus className="mr-2 h-4 w-4" /> {t('add_category')}
                </Button>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={t('search_categories')}
                        className="pl-9 bg-white"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
                        <SelectTrigger className="w-[140px] bg-white">
                            <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                            <SelectValue placeholder={t('status')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{t('all_status')}</SelectItem>
                            <SelectItem value="active">{t('active')}</SelectItem>
                            <SelectItem value="inactive">{t('draft')}</SelectItem>
                        </SelectContent>
                    </Select>
                    {/* @ts-ignore */}
                    <Button
                        variant="outline"
                        onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                        className="bg-white px-3"
                    >
                        <ArrowUpDown className="w-4 h-4 mr-2" />
                        <span className="sr-only sm:not-sr-only">{t('sort')}</span>
                    </Button>
                </div>
            </div>

            {/* Table Content */}
            <Card className="rounded-xl shadow-sm border-zinc-200 overflow-hidden bg-white">
                {filteredCategories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="bg-zinc-50 p-4 rounded-full mb-4">
                            <Layers className="w-8 h-8 text-zinc-300" />
                        </div>
                        <h3 className="font-medium text-zinc-900">{t('no_categories')}</h3>
                        <p className="text-zinc-500 text-sm mt-1">{t('no_categories_desc')}</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-zinc-50/50">
                                <TableRow>
                                    <TableHead className="w-[80px] font-semibold text-zinc-600">{t('sort')}</TableHead>
                                    <TableHead className="w-[100px] font-semibold text-zinc-900">{t('dish_image')}</TableHead>
                                    <TableHead className="font-semibold text-zinc-900">Title (GE)</TableHead>
                                    <TableHead className="font-semibold text-zinc-600">Other Languages</TableHead>
                                    <TableHead className="w-[100px] font-semibold text-zinc-600">{t('status')}</TableHead>
                                    <TableHead className="text-right w-[100px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredCategories.map((category) => {
                                    const ru = category.category_translations.find((t: any) => t.lang === 'ru')?.title;
                                    const en = category.category_translations.find((t: any) => t.lang === 'en')?.title;
                                    const ge = category.category_translations.find((t: any) => t.lang === 'ge')?.title;

                                    return (
                                        <TableRow key={category.id} className="hover:bg-zinc-50/60 transition-colors group">
                                            <TableCell className="font-medium text-zinc-500">{category.sort}</TableCell>
                                            <TableCell>
                                                <div className="w-12 h-12 rounded-lg bg-zinc-100 overflow-hidden border border-zinc-200">
                                                    {category.image_url ? (
                                                        <img src={category.image_url} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-[8px] text-zinc-400">NO IMG</div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-bold text-zinc-900 text-base">{ge || <span className="text-red-400 text-sm font-normal">No translation</span>}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1 text-sm">
                                                    {ru && <span className="inline-flex items-center text-zinc-600"><span className="w-5 text-[10px] font-bold text-zinc-400 uppercase mr-1">RU</span> {ru}</span>}
                                                    {en && <span className="inline-flex items-center text-zinc-600"><span className="w-5 text-[10px] font-bold text-zinc-400 uppercase mr-1">EN</span> {en}</span>}
                                                    {!ru && !en && <span className="text-zinc-300 italic">No translations</span>}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {category.is_active ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                        {t('active')}
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-500 border border-zinc-200">
                                                        {t('inactive')}
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-zinc-100 hover:text-blue-600" onClick={() => handleOpen(category)}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-50 hover:text-red-600" onClick={() => handleDelete(category)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </Card>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[500px] rounded-xl">
                    <DialogHeader>
                        <DialogTitle>{currentId ? t('edit_category') : t('new_category')}</DialogTitle>
                        <DialogDescription>
                            {t('georgian_required')}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left: Image Upload */}
                        <div className="space-y-3">
                            <Label>{t('category_image')}</Label>
                            <label
                                htmlFor="category-image-upload"
                                className="border-2 border-dashed border-zinc-200 rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-zinc-50 transition-colors cursor-pointer relative min-h-[160px] block"
                            >
                                {imageUrl ? (
                                    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-white shadow-sm ring-1 ring-zinc-200">
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
                                    <div className="flex flex-col items-center py-4 text-center">
                                        <div className="bg-zinc-100 p-3 rounded-full mb-3">
                                            <ImageIcon className="w-6 h-6 text-zinc-400" />
                                        </div>
                                        <span className="text-xs font-semibold text-zinc-900 block">{uploading ? 'Uploading...' : t('upload_image')}</span>
                                        <span className="text-[10px] text-zinc-500 mt-1">{t('image_requirements')}</span>
                                    </div>
                                )}
                                <input
                                    id="category-image-upload"
                                    type="file"
                                    className="sr-only"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                    accept="image/*"
                                />
                            </label>
                        </div>

                        {/* Right: Settings */}
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <div className="grid gap-2">
                                    <Label className="text-sm font-semibold">{t('sort_order')}</Label>
                                    <Input
                                        type="number"
                                        value={sort}
                                        onChange={(e) => setSort(Number(e.target.value))}
                                        className="max-w-[120px] bg-white h-11 text-lg font-medium"
                                    />
                                    <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">{t('lower_first')}</p>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                                    <div className="space-y-0.5">
                                        <Label className="text-sm font-semibold">{t('active')}</Label>
                                        <p className="text-[10px] text-zinc-400 leading-tight">{t('visible_in_menu')}</p>
                                    </div>
                                    <Switch checked={isActive} onCheckedChange={setIsActive} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 pt-2">
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                {t('georgian_main')} <span className="text-red-500 text-xs">*</span>
                            </Label>
                            <Input
                                placeholder={t('category_title_ge')}
                                value={titles.ge}
                                onChange={(e) => setTitles({ ...titles, ge: e.target.value })}
                                className="font-medium"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs uppercase text-muted-foreground font-semibold">{t('russian')}</Label>
                                <Input
                                    placeholder={t('title_ru')}
                                    value={titles.ru}
                                    onChange={(e) => setTitles({ ...titles, ru: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs uppercase text-muted-foreground font-semibold">{t('english')}</Label>
                                <Input
                                    placeholder={t('title_en')}
                                    value={titles.en}
                                    onChange={(e) => setTitles({ ...titles, en: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsOpen(false)}>{t('cancel')}</Button>
                        <Button onClick={handleSave} disabled={loading} className="bg-zinc-900 text-white hover:bg-zinc-800">
                            {loading ? t('saving') : currentId ? t('save_changes') : t('create_category')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
