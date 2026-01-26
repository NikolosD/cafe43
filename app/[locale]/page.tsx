'use client';

import { Link } from '@/lib/navigation';
import { useTranslations } from 'next-intl';

export default function LanguageSplashPage() {
    const handleLocaleSelect = (locale: string) => {
        localStorage.setItem('NEXT_LOCALE', locale);
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-white relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-zinc-900 rounded-full blur-[120px] opacity-50" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-zinc-800 rounded-full blur-[120px] opacity-30" />

            <div className="max-w-md w-full space-y-12 relative z-10">
                <div className="text-center space-y-4">
                    <h1
                        className="text-6xl tracking-tighter uppercase text-white"
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
                        className="group relative flex items-center justify-between p-6 bg-zinc-900/50 border border-zinc-800 rounded-3xl hover:bg-zinc-800/80 hover:border-zinc-700 transition-all active:scale-[0.98]"
                    >
                        <div className="flex items-center gap-4">
                            <span className="text-3xl">🇬🇪</span>
                            <div className="text-left">
                                <p className="font-bold text-lg">ქართული</p>
                                <p className="text-xs text-zinc-500 font-medium">Georgian</p>
                            </div>
                        </div>
                        <div className="w-8 h-8 rounded-full border border-zinc-700 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
                            →
                        </div>
                    </Link>

                    <Link
                        href="/menu"
                        locale="ru"
                        onClick={() => handleLocaleSelect('ru')}
                        className="group relative flex items-center justify-between p-6 bg-zinc-900/50 border border-zinc-800 rounded-3xl hover:bg-zinc-800/80 hover:border-zinc-700 transition-all active:scale-[0.98]"
                    >
                        <div className="flex items-center gap-4">
                            <span className="text-3xl">🇷🇺</span>
                            <div className="text-left">
                                <p className="font-bold text-lg">Русский</p>
                                <p className="text-xs text-zinc-500 font-medium">Russian</p>
                            </div>
                        </div>
                        <div className="w-8 h-8 rounded-full border border-zinc-700 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
                            →
                        </div>
                    </Link>

                    <Link
                        href="/menu"
                        locale="en"
                        onClick={() => handleLocaleSelect('en')}
                        className="group relative flex items-center justify-between p-6 bg-zinc-900/50 border border-zinc-800 rounded-3xl hover:bg-zinc-800/80 hover:border-zinc-700 transition-all active:scale-[0.98]"
                    >
                        <div className="flex items-center gap-4">
                            <span className="text-3xl">🇺🇸</span>
                            <div className="text-left">
                                <p className="font-bold text-lg">English</p>
                                <p className="text-xs text-zinc-500 font-medium">English</p>
                            </div>
                        </div>
                        <div className="w-8 h-8 rounded-full border border-zinc-700 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
                            →
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
