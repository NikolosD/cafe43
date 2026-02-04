import Image from 'next/image';
import { Link } from '@/lib/navigation';
import LanguageSwitcher from './LanguageSwitcher';

interface MenuHeaderProps {
    restaurantName?: string;
}

export default function MenuHeader({ restaurantName = "Cafe 43" }: MenuHeaderProps) {
    return (
        <header className="sticky top-0 z-50 w-full chrome-ios-header">
            {/* Glassmorphism background - simplified for Chrome iOS */}
            <div className="absolute inset-0 bg-white/95 border-b border-black/5" />
            
            {/* Gradient overlay - disabled on mobile */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 hidden sm:block" />
            
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
                    <LanguageSwitcher />
                </div>
            </div>
        </header>
    );
}
