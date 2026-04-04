'use client';

import { Link } from '@/lib/navigation';
import { ChevronRight, Loader2 } from 'lucide-react';
import { useState } from 'react';

const LANGUAGES = [
    { code: 'ge', flag: '🇬🇪', name: 'ქართული', sub: 'Georgian' },
    { code: 'en', flag: '🇬🇧', name: 'English', sub: 'English' },
    { code: 'ru', flag: '🇷🇺', name: 'Русский', sub: 'Russian' },
] as const;

export default function LanguageSplashPage() {
    const [loadingLocale, setLoadingLocale] = useState<string | null>(null);

    const handleLocaleSelect = (locale: string) => {
        localStorage.setItem('NEXT_LOCALE', locale);
        setLoadingLocale(locale);
        setTimeout(() => setLoadingLocale(null), 5000);
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 pb-24 relative" style={{ minHeight: '100dvh' }}>

            <div className="max-w-sm w-full space-y-16 relative z-10">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-display font-light tracking-[0.2em] uppercase text-foreground/80">
                        Cafe 43
                    </h1>
                    <div className="flex items-center justify-center gap-4">
                        <div className="h-px w-10 bg-black/10" />
                        <p className="text-foreground/30 text-[10px] tracking-[0.4em] uppercase">
                            Pâtisserie
                        </p>
                        <div className="h-px w-10 bg-black/10" />
                    </div>
                </div>

                <div className="space-y-0 border-t border-black/[0.06]">
                    {LANGUAGES.map(({ code, flag, name, sub }) => (
                        <Link
                            key={code}
                            href="/menu"
                            locale={code}
                            onClick={() => handleLocaleSelect(code)}
                            className={`group flex items-center justify-between py-4 px-1 border-b border-black/[0.06] transition-all duration-200 active:scale-[0.98] ${loadingLocale && loadingLocale !== code ? 'opacity-20 pointer-events-none' : ''}`}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-lg">{flag}</span>
                                <div>
                                    <p className="font-display text-[15px] font-light text-foreground/80 tracking-wide">{name}</p>
                                    <p className="text-[10px] text-foreground/30 tracking-wider uppercase">{sub}</p>
                                </div>
                            </div>
                            {loadingLocale === code ? (
                                <Loader2 className="w-4 h-4 text-foreground/30 animate-spin" />
                            ) : (
                                <ChevronRight className="w-4 h-4 text-foreground/20 group-hover:text-foreground/50 transition-colors" />
                            )}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
