'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/lib/navigation';
import { useSearchParams } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const languages = [
    { code: 'ge', label: 'ქართული', flag: '🇬🇪' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
];

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

    const currentLang = languages.find(l => l.code === locale);

    return (
        <Select value={locale} onValueChange={handleChange}>
            <SelectTrigger 
                className={cn(
                    "w-auto min-w-[120px] bg-white/50 backdrop-blur-sm border border-black/5",
                    "hover:bg-white/80 hover:border-primary/20 hover:shadow-md",
                    "focus:ring-2 focus:ring-primary/20",
                    "rounded-full transition-all duration-300 h-10 px-4 gap-2 text-sm font-medium"
                )}
            >
                <div className="flex items-center gap-2">
                    <div className="p-1 rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
                        <Globe className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="hidden sm:inline">{currentLang?.label}</span>
                    <span className="sm:hidden">{currentLang?.flag}</span>
                </div>
            </SelectTrigger>
            <SelectContent 
                align="end" 
                className="rounded-2xl border-black/5 shadow-xl min-w-[160px] p-2 bg-white/95 backdrop-blur-xl"
            >
                {languages.map((lang) => (
                    <SelectItem 
                        key={lang.code} 
                        value={lang.code}
                        className={cn(
                            "rounded-xl cursor-pointer transition-all duration-200 my-1",
                            "focus:bg-primary/5 focus:text-primary",
                            "data-[state=checked]:bg-primary/10"
                        )}
                    >
                        <div className="flex items-center justify-between w-full gap-4 py-1">
                            <div className="flex items-center gap-3">
                                <span className="text-lg">{lang.flag}</span>
                                <span className="font-medium">{lang.label}</span>
                            </div>
                            {locale === lang.code && (
                                <Check className="w-4 h-4 text-primary" />
                            )}
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
