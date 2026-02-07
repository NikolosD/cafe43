import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { getAllUsers, getUserRole } from '@/lib/db';
import { redirect } from 'next/navigation';
import AdminUsers from '@/components/Admin/AdminUsers';

export default async function UsersPage({
    params: { locale }
}: {
    params: { locale: string };
}) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    // Check if current user is superadmin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect(`/${locale}/admin/login`);
    }

    const currentUserRole = await getUserRole(supabase, user.id);
    if (currentUserRole?.role !== 'superadmin') {
        redirect(`/${locale}/admin/categories`);
    }

    const users = await getAllUsers(supabase);

    return <AdminUsers users={users} currentUserId={user.id} />;
}
