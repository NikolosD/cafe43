import Image from 'next/image';
import { Link } from '@/lib/navigation';
import LanguageSwitcher from './LanguageSwitcher';

interface MenuHeaderProps {
    restaurantName?: string;
}

export default function MenuHeader({ restaurantName = "Cafe 43" }: MenuHeaderProps) {
    return (
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-black/5 support-[backdrop-filter]:bg-white/60">
            <div className="container max-w-3xl mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2">
                    <div className="relative h-16 w-[120px] flex items-center">
                        <div className="absolute left-0">
                            <Image
                                src="/logo.svg"
                                alt={restaurantName}
                                width={120}
                                height={120}
                                className="object-contain"
                                priority
                            />
                        </div>
                    </div>
                </Link>
                <LanguageSwitcher />
            </div>
        </header>
    );
}
