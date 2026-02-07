'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, UtensilsCrossed, LogOut, Coffee, Menu, Settings, QrCode, Users } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { getUserRole } from '@/lib/db';

interface AdminSidebarProps {
    className?: string;
}

export default function AdminSidebar({ className }: AdminSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const t = useTranslations('Admin');
    const supabase = createClient();
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/admin/login');
        router.refresh();
    };

    useEffect(() => {
        const checkRole = async () => {
            console.log('[AdminSidebar] Checking role...');
            const { data: { user } } = await supabase.auth.getUser();
            console.log('[AdminSidebar] User:', user?.id);
            if (user) {
                const role = await getUserRole(supabase, user.id);
                console.log('[AdminSidebar] Role:', role);
                setIsSuperAdmin(role?.role === 'superadmin');
                console.log('[AdminSidebar] isSuperAdmin:', role?.role === 'superadmin');
            }
        };
        checkRole();
    }, [supabase]);

    const navItems = [
        { href: '/admin/categories', label: t('categories'), icon: LayoutDashboard },
        { href: '/admin/items', label: t('items'), icon: UtensilsCrossed },
        { href: '/admin/qr', label: t('qr'), icon: QrCode },
        { href: '/admin/settings', label: t('settings'), icon: Settings },
        ...(isSuperAdmin ? [{ href: '/admin/users', label: t('users') || 'Users', icon: Users }] : []),
    ];

    return (
        <aside className={cn("flex flex-col bg-zinc-900 text-white", className)}>
            <div className="h-16 flex items-center px-6 font-bold text-lg tracking-tight border-b border-white/10">
                <div className="bg-white text-zinc-900 p-1.5 rounded-lg mr-3">
                    <Coffee className="w-5 h-5" />
                </div>
                Cafe 43 Admin
            </div>

            <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href}>
                            <span className={cn(
                                "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                                isActive
                                    ? "bg-white text-zinc-900 shadow-sm"
                                    : "text-zinc-400 hover:text-white hover:bg-white/10"
                            )}>
                                <Icon className={cn("w-5 h-5 mr-3", isActive ? "text-zinc-900" : "text-zinc-400 group-hover:text-white")} />
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/10 bg-zinc-900/50">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                    onClick={handleLogout}
                >
                    <LogOut className="w-5 h-5 mr-3" />
                    {t('logout')}
                </Button>
            </div>
        </aside>
    );
}
