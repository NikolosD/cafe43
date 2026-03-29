'use client';

import { Link } from '@/lib/navigation';
import { useTranslations } from 'next-intl';
import { ChevronRight, Loader2 } from 'lucide-react';
import { useState } from 'react';

const LANGUAGES = [
    { code: 'ge', flag: '🇬🇪', name: 'ქართული', sub: 'Georgian' },
    { code: 'en', flag: '🇺🇸', name: 'English', sub: 'English' },
    { code: 'ru', flag: '🇷🇺', name: 'Русский', sub: 'Russian' },
] as const;

export default function LanguageSplashPage() {
    const [loadingLocale, setLoadingLocale] = useState<string | null>(null);

    const handleLocaleSelect = (locale: string) => {
        localStorage.setItem('NEXT_LOCALE', locale);
        setLoadingLocale(locale);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-red-50/50 to-red-100 flex flex-col items-center justify-center p-6 pb-24 text-black relative overflow-hidden" style={{ minHeight: '100dvh' }}>
            <div className="max-w-md w-full space-y-12 relative z-10">
                <div className="text-center space-y-4">
                    <h1
                        className="text-6xl tracking-tighter uppercase text-black"
                        style={{ fontFamily: '"Cooper Black", serif' }}
                    >
                        CAFE 43
                    </h1>
                    <p className="text-zinc-500 text-sm font-medium tracking-widest uppercase">
                        Select your language
                    </p>
                </div>

                <div className="grid gap-4">
                    {LANGUAGES.map(({ code, flag, name, sub }) => (
                        <Link
                            key={code}
                            href="/menu"
                            locale={code}
                            onClick={() => handleLocaleSelect(code)}
                            className={`group relative flex items-center justify-between p-6 bg-white/80 border border-zinc-200 shadow-md rounded-3xl hover:bg-white hover:shadow-lg transition-all active:scale-[0.98] ${loadingLocale && loadingLocale !== code ? 'opacity-40 pointer-events-none' : ''}`}
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-3xl">{flag}</span>
                                <div className="text-left">
                                    <p className="font-bold text-lg text-black">{name}</p>
                                    <p className="text-xs text-zinc-500 font-medium">{sub}</p>
                                </div>
                            </div>
                            <div className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                                {loadingLocale === code ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <ChevronRight className="w-5 h-5" />
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
