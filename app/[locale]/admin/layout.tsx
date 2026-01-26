import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import AdminHeader from '@/components/Admin/AdminHeader';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data: { user } } = await supabase.auth.getUser();

    return (
        <div className="flex flex-col min-h-screen bg-zinc-50 font-sans text-zinc-900">
            {/* Show header if not on login page, or just always show for now to fix visibility */}
            <AdminHeader />
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
                <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 min-h-[calc(100vh-12rem)] p-6 sm:p-10">
                    {children}
                </div>
            </main>
        </div>
    );
}
