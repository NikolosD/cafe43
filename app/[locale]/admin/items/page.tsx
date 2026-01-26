import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import ItemTable from '@/components/Admin/ItemTable';
import { adminGetAllItems, adminGetAllCategories } from '@/lib/db';

export default async function AdminItemsPage() {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const items = await adminGetAllItems(supabase);
    const categories = await adminGetAllCategories(supabase);

    return (
        <div className="space-y-6">
            <ItemTable initialItems={items} categories={categories} />
        </div>
    );
}
