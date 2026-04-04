'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/lib/navigation';
import { useSearchParams } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Icon from '@/components/Icon';

const languages = [
    { code: 'ge', label: 'ქართული', flagCode: 'ge' },
    { code: 'en', label: 'English', flagCode: 'gb' },
    { code: 'ru', label: 'Русский', flagCode: 'ru' },
];

export default function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);

    const handleChange = (newLocale: string) => {
        if (newLocale === locale) return;
        setLoading(true);
        localStorage.setItem('NEXT_LOCALE', newLocale);
        const params = searchParams.toString();
        const targetPath = params ? `${pathname}?${params}` : pathname;
        router.push(targetPath, { locale: newLocale as "ru" | "en" | "ge" });
    };

    const currentLang = languages.find(l => l.code === locale);

    return (
        <Select value={locale} onValueChange={handleChange} disabled={loading}>
            <SelectTrigger
                className={cn(
                    "w-auto min-w-[120px] bg-white border border-black/5",
                    "hover:bg-white hover:border-primary/20 hover:shadow-md",
                    "focus:ring-2 focus:ring-primary/20",
                    "rounded-full transition-all duration-200 h-10 px-4 gap-2 text-sm font-medium"
                )}
            >
                <div className="flex items-center gap-2">
                    <div className="p-1 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        {loading ? (
                            <Icon icon={Loader2} size={14} className="text-primary animate-spin" />
                        ) : (
                            <Icon icon={Globe} size={14} className="text-primary" />
                        )}
                    </div>
                    <span className="hidden sm:inline">{currentLang?.label}</span>
                    <span className={`sm:hidden fi fi-${currentLang?.flagCode} fis`} style={{ width: 16, height: 16, borderRadius: 2, fontSize: 16 }} />
                </div>
            </SelectTrigger>
            <SelectContent
                align="end"
                className="rounded-2xl border-black/5 shadow-xl min-w-[160px] p-2 bg-white"
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
                                <span className={`fi fi-${lang.flagCode} fis`} style={{ width: 20, height: 20, borderRadius: 3, fontSize: 20 }} />
                                <span className="font-medium">{lang.label}</span>
                            </div>
                            {locale === lang.code && (
                                <Icon icon={Check} size={16} className="text-primary" />
                            )}
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
