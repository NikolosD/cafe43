'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/lib/navigation';
import { useSearchParams } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleChange = (newLocale: string) => {
        localStorage.setItem('NEXT_LOCALE', newLocale);
        const params = searchParams.toString();
        const targetPath = params ? `${pathname}?${params}` : pathname;
        router.replace(targetPath, { locale: newLocale as "ru" | "en" | "ge" });
        window.scrollTo({ top: 0, behavior: 'instant' });
    };

    return (
        <Select value={locale} onValueChange={handleChange}>
            <SelectTrigger className="w-auto min-w-[100px] bg-transparent border-none focus:ring-0 shadow-none hover:bg-black/5 rounded-full transition-colors h-9 px-4 gap-2 text-sm font-medium">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <SelectValue placeholder="Lang" />
            </SelectTrigger>
            <SelectContent align="end" className="rounded-xl border-black/5 shadow-lg min-w-[120px]">
                <SelectItem value="ge">ქართული</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ru">Русский</SelectItem>
            </SelectContent>
        </Select>
    );
}
