'use client';

import Image from 'next/image';
import { Link } from '@/lib/navigation';
import LanguageSwitcher from './LanguageSwitcher';

interface MenuHeaderProps {
    restaurantName?: string;
}

export default function MenuHeader({ restaurantName = "Cafe 43" }: MenuHeaderProps) {
    return (
        <header className="sticky top-0 z-50 w-full chrome-ios-header">
            <div className="absolute inset-0 bg-white border-b border-black/[0.06]" />

            <div className="container max-w-3xl mx-auto flex h-14 sm:h-16 items-center justify-between px-4 relative">
                <Link href="/" className="relative z-10">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-24 w-[160px] flex items-center">
                        <Image
                            src="/logo.svg"
                            alt={restaurantName}
                            width={160}
                            height={96}
                            className="h-24 w-auto object-contain -ml-2"
                            priority
                        />
                    </div>
                    <div className="h-16 w-36" />
                </Link>

                <LanguageSwitcher />
            </div>
        </header>
    );
}
