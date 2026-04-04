'use client';

import { Link } from '@/lib/navigation';
import { useTranslations } from 'next-intl';
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
    };

    return (
        <div className="min-h-screen bg-[#faf9f7] flex flex-col items-center justify-center p-6 pb-24 text-black relative overflow-hidden" style={{ minHeight: '100dvh' }}>
            {/* Subtle warm gradient orbs */}
            <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-orange-100/60 to-rose-50/40 blur-3xl" />
            <div className="absolute bottom-[-15%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tr from-amber-50/50 to-orange-100/30 blur-3xl" />

            <div className="max-w-md w-full space-y-14 relative z-10">
                <div className="text-center space-y-3">
                    <h1
                        className="text-6xl tracking-tighter uppercase text-black"
                        style={{ fontFamily: '"Cooper Black", serif' }}
                    >
                        CAFE 43
                    </h1>
                    <div className="flex items-center justify-center gap-3">
                        <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary/40" />
                        <p className="text-zinc-400 text-xs font-medium tracking-[0.3em] uppercase">
                            Select your language
                        </p>
                        <div className="h-px w-8 bg-gradient-to-l from-transparent to-primary/40" />
                    </div>
                </div>

                <div className="grid gap-3.5">
                    {LANGUAGES.map(({ code, flag, name, sub }) => (
                        <Link
                            key={code}
                            href="/menu"
                            locale={code}
                            onClick={() => handleLocaleSelect(code)}
                            className={`group relative flex items-center justify-between p-5 bg-white/90 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.04)] rounded-2xl hover:bg-white hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 active:scale-[0.98] ${loadingLocale && loadingLocale !== code ? 'opacity-30 pointer-events-none' : ''}`}
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-2xl">{flag}</span>
                                <div className="text-left">
                                    <p className="font-bold text-[17px] text-black font-display">{name}</p>
                                    <p className="text-[11px] text-zinc-400 font-medium tracking-wide">{sub}</p>
                                </div>
                            </div>
                            <div className="w-8 h-8 rounded-full border border-black/[0.06] flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white group-hover:border-zinc-900 transition-all duration-300">
                                {loadingLocale === code ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <ChevronRight className="w-4 h-4" />
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
