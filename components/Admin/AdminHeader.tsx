'use client';

import { Link, usePathname, useRouter } from '@/lib/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, UtensilsCrossed, LogOut, Coffee, Menu, QrCode } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose
} from "@/components/ui/sheet";
import { useState } from 'react';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '../Menu/LanguageSwitcher';

export default function AdminHeader() {
    const t = useTranslations('Admin');
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();
    const [open, setOpen] = useState(false);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/admin/login');
        router.refresh();
    };

    const navItems = [
        { href: '/admin/categories', label: t('categories'), icon: LayoutDashboard },
        { href: '/admin/items', label: t('items'), icon: UtensilsCrossed },
        { href: '/admin/qr', label: t('qr'), icon: QrCode },
    ];

    return (
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-zinc-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/admin/categories" className="flex items-center gap-2 font-bold text-lg tracking-tight text-zinc-900 group">
                        <div className="relative w-20 h-16 flex items-center">
                            <Image
                                src="/logo.svg"
                                alt="Logo"
                                width={80}
                                height={80}
                                className="object-contain absolute"
                            />
                        </div>
                        <span>Cafe 43</span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <Link key={item.href} href={item.href}>
                                    <span className={cn(
                                        "flex items-center px-4 py-2 text-sm font-medium rounded-full transition-all",
                                        isActive
                                            ? "bg-zinc-900 text-white shadow-sm"
                                            : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
                                    )}>
                                        <Icon className="w-4 h-4 mr-2" />
                                        {item.label}
                                    </span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center border-l pl-4 ml-4 h-8 border-zinc-200">
                        <LanguageSwitcher />
                    </div>

                    {/* @ts-ignore */}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded-full"
                        onClick={handleLogout}
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">{t('logout')}</span>
                    </Button>

                    {/* Mobile Menu Trigger */}
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            {/* @ts-ignore */}
                            <Button variant="ghost" size="icon" className="md:hidden text-zinc-500">
                                <Menu className="w-6 h-6" />
                            </Button>
                        </SheetTrigger>
                        {/* @ts-ignore */}
                        <SheetContent side="top" className="w-full p-0 bg-white border-b border-zinc-200">
                            <div className="p-6 space-y-4">
                                <div className="flex flex-col gap-2">
                                    {navItems.map((item) => {
                                        const Icon = item.icon;
                                        const isActive = pathname === item.href;
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={() => setOpen(false)}
                                                className={cn(
                                                    "flex items-center px-4 py-3 text-base font-medium rounded-xl transition-colors",
                                                    isActive
                                                        ? "bg-zinc-100 text-zinc-900"
                                                        : "text-zinc-500 hover:bg-zinc-50"
                                                )}
                                            >
                                                <Icon className="w-5 h-5 mr-3" />
                                                {item.label}
                                            </Link>
                                        );
                                    })}
                                </div>
                                <div className="pt-4 border-t space-y-4">
                                    <div className="px-4 py-2">
                                        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">{t('menu_language')}</p>
                                        <LanguageSwitcher />
                                    </div>
                                    {/* @ts-ignore */}
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start text-red-600 hover:bg-red-50 rounded-xl"
                                        onClick={() => {
                                            setOpen(false);
                                            handleLogout();
                                        }}
                                    >
                                        <LogOut className="w-5 h-5 mr-3" />
                                        {t('logout')}
                                    </Button>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
