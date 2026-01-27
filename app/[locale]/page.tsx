'use client';

import { Link } from '@/lib/navigation';
import { useTranslations } from 'next-intl';
import { ChevronRight } from 'lucide-react';

export default function LanguageSplashPage() {
    const handleLocaleSelect = (locale: string) => {
        localStorage.setItem('NEXT_LOCALE', locale);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-red-50/50 to-red-100 flex flex-col items-center justify-center p-6 text-black relative overflow-hidden">
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
                    <Link
                        href="/menu"
                        locale="ge"
                        onClick={() => handleLocaleSelect('ge')}
                        className="group relative flex items-center justify-between p-6 bg-white/80 border border-zinc-200 shadow-md rounded-3xl hover:bg-white hover:shadow-lg transition-all active:scale-[0.98]"
                    >
                        <div className="flex items-center gap-4">
                            <span className="text-3xl">🇬🇪</span>
                            <div className="text-left">
                                <p className="font-bold text-lg text-black">ქართული</p>
                                <p className="text-xs text-zinc-500 font-medium">Georgian</p>
                            </div>
                        </div>
                        <div className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                            <ChevronRight className="w-5 h-5" />
                        </div>
                    </Link>

                    <Link
                        href="/menu"
                        locale="ru"
                        onClick={() => handleLocaleSelect('ru')}
                        className="group relative flex items-center justify-between p-6 bg-white/80 border border-zinc-200 shadow-md rounded-3xl hover:bg-white hover:shadow-lg transition-all active:scale-[0.98]"
                    >
                        <div className="flex items-center gap-4">
                            <span className="text-3xl">🇷🇺</span>
                            <div className="text-left">
                                <p className="font-bold text-lg text-black">Русский</p>
                                <p className="text-xs text-zinc-500 font-medium">Russian</p>
                            </div>
                        </div>
                        <div className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                            <ChevronRight className="w-5 h-5" />
                        </div>
                    </Link>

                    <Link
                        href="/menu"
                        locale="en"
                        onClick={() => handleLocaleSelect('en')}
                        className="group relative flex items-center justify-between p-6 bg-white/80 border border-zinc-200 shadow-md rounded-3xl hover:bg-white hover:shadow-lg transition-all active:scale-[0.98]"
                    >
                        <div className="flex items-center gap-4">
                            <span className="text-3xl">🇺🇸</span>
                            <div className="text-left">
                                <p className="font-bold text-lg text-black">English</p>
                                <p className="text-xs text-zinc-500 font-medium">English</p>
                            </div>
                        </div>
                        <div className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                            <ChevronRight className="w-5 h-5" />
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
