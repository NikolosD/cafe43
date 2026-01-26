import { SupabaseClient } from '@supabase/supabase-js';

// Types (simplified for this file, ideally in types/index.ts)
export type Category = {
    id: string;
    sort: number;
    image_url: string | null;
    is_active: boolean;
    translations: { title: string; lang: string }[];
};

export type Item = {
    id: string;
    category_id: string;
    price: number;
    image_url: string | null;
    sort: number;
    is_active: boolean;
    weight: string | null;
    is_new: boolean;
    is_spicy: boolean;
    is_vegan: boolean;
    translations: { title: string; description: string | null; lang: string }[];
    title?: string;
    description?: string | null;
};

// --- PUBLIC MENU ---

export async function getPublicMenu(supabase: SupabaseClient, locale: string) {
    // Fetch categories with all translations to avoid filtering out records
    const { data: categories, error: catsError } = await supabase
        .from('categories')
        .select(`
      *,
      category_translations(lang, title)
    `)
        .eq('is_active', true)
        .order('sort', { ascending: true });

    if (catsError) throw catsError;

    // Fetch items with all translations
    const { data: items, error: itemsError } = await supabase
        .from('items')
        .select(`
      *,
      item_translations(lang, title, description)
    `)
        .eq('is_active', true)
        .order('sort', { ascending: true });

    if (itemsError) throw itemsError;

    // Group items by category and handle translations with fallback
    const menu = categories.map((cat: any) => {
        // Find best translation: current locale -> any available
        const translations = cat.category_translations || [];
        const trans = translations.find((t: any) => t.lang === locale) || translations[0];

        return {
            ...cat,
            title: trans?.title || 'Untitled',
            items: items
                .filter((item: any) => item.category_id === cat.id)
                .map((item: any) => {
                    const iTranslations = item.item_translations || [];
                    const iTrans = iTranslations.find((t: any) => t.lang === locale) || iTranslations[0];

                    return {
                        ...item,
                        title: iTrans?.title || 'Untitled',
                        description: iTrans?.description || null,
                        weight: item.weight,
                        is_new: item.is_new,
                        is_spicy: item.is_spicy,
                        is_vegan: item.is_vegan,
                    };
                }),
        };
    });

    return menu;
}

// --- ADMIN CATEGORIES ---

export async function adminGetAllCategories(supabase: SupabaseClient) {
    const { data, error } = await supabase
        .from('categories')
        .select(`
      *,
      category_translations(lang, title)
    `)
        .order('sort', { ascending: true });

    if (error) throw error;
    return data;
}

export async function adminUpsertCategory(supabase: SupabaseClient, category: any, translations: any[]) {
    // 1. Upsert Category
    const { data: catData, error: catError } = await supabase
        .from('categories')
        .upsert(category)
        .select()
        .single();

    if (catError) throw catError;

    // 2. Upsert Translations
    const transWithId = translations.map(t => ({ ...t, category_id: catData.id }));
    const { error: transError } = await supabase
        .from('category_translations')
        .upsert(transWithId, { onConflict: 'category_id,lang' });

    if (transError) throw transError;

    return catData;
}

export async function adminDeleteCategory(supabase: SupabaseClient, id: string) {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
}

// --- ADMIN ITEMS ---

export async function adminGetAllItems(supabase: SupabaseClient) {
    const { data, error } = await supabase
        .from('items')
        .select(`
      *,
      item_translations(lang, title, description),
      categories(id, category_translations(title))
    `)
        .order('sort', { ascending: true });

    if (error) throw error;
    return data;
}

export async function adminUpsertItem(supabase: SupabaseClient, item: any, translations: any[]) {
    // 1. Upsert Item
    const { data: itemData, error: itemError } = await supabase
        .from('items')
        .upsert(item)
        .select()
        .single();

    if (itemError) throw itemError;

    // 2. Upsert Translations
    const transWithId = translations.map(t => ({ ...t, item_id: itemData.id }));
    const { error: transError } = await supabase
        .from('item_translations')
        .upsert(transWithId, { onConflict: 'item_id,lang' });

    if (transError) throw transError;

    return itemData;
}

export async function adminDeleteItem(supabase: SupabaseClient, id: string) {
    const { error } = await supabase.from('items').delete().eq('id', id);
    if (error) throw error;
}
