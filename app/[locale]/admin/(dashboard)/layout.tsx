import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import AdminHeader from '@/components/Admin/AdminHeader';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({
    children,
    params: { locale }
}: {
    children: React.ReactNode;
    params: { locale: string };
}) {
    return (
        <>
            <AdminHeader />
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
                <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 min-h-[calc(100vh-12rem)] p-6 sm:p-10">
                    {children}
                </div>
            </main>
        </>
    );
}
