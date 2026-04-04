'use client';

import Image from 'next/image';
import { Link } from '@/lib/navigation';
import LanguageSwitcher from './LanguageSwitcher';
import { Settings } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getUserRole } from '@/lib/db';

interface MenuHeaderProps {
    restaurantName?: string;
}

export default function MenuHeader({ restaurantName = "Cafe 43" }: MenuHeaderProps) {
    const [isAdmin, setIsAdmin] = useState(false);
    const supabase = useMemo(() => createClient(), []);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                try {
                    const role = await getUserRole(supabase, user.id);
                    setIsAdmin(role?.role === 'admin' || role?.role === 'superadmin');
                } catch {
                    // User doesn't have admin role
                }
            }
        };
        checkAuth();
    }, [supabase]);

    return (
        <header className="sticky top-0 z-50 w-full chrome-ios-header">
            <div className="absolute inset-0 bg-[#faf9f7]/95 border-b border-black/[0.04]" />
            
            <div className="container max-w-3xl mx-auto flex h-14 sm:h-16 items-center justify-between px-4 relative">
                <Link href="/" className="relative z-10 group">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-24 w-[160px] flex items-center">
                        <div className="relative transition-transform duration-300 group-hover:scale-105">
                            <Image
                                src="/logo.svg"
                                alt={restaurantName}
                                width={160}
                                height={96}
                                className="h-24 w-auto object-contain -ml-2 drop-shadow-sm"
                                priority
                            />
                            {/* Subtle glow on hover */}
                            <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                        </div>
                    </div>
                    {/* Spacer */}
                    <div className="h-16 w-36" />
                </Link>
                
                <div className="flex items-center gap-2">
                    {isAdmin && (
                        <Link 
                            href="/admin/categories"
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 text-white text-sm font-medium rounded-full hover:bg-zinc-800 transition-colors"
                        >
                            <Settings className="w-4 h-4" />
                            <span className="hidden sm:inline">Admin</span>
                        </Link>
                    )}
                    <LanguageSwitcher />
                </div>
            </div>
        </header>
    );
}
