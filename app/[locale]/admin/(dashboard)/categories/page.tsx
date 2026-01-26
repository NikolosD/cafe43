import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import CategoryTable from '@/components/Admin/CategoryTable';
import { adminGetAllCategories } from '@/lib/db';

export default async function AdminCategoriesPage() {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const categories = await adminGetAllCategories(supabase);

    return (
        <div className="space-y-6">
            <CategoryTable initialCategories={categories} />
        </div>
    );
}
