'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/lib/navigation';

export default function LocaleInitializer() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        const savedLocale = localStorage.getItem('NEXT_LOCALE');

        if (!checked) {
            // Initial load check: only auto-redirect if we are on the default locale 
            // and the user has a different preferred locale saved.
            // This prevents "fighting" during history navigation.
            if (savedLocale && savedLocale !== locale && (savedLocale === 'ru' || savedLocale === 'en' || savedLocale === 'ge')) {
                if (locale === 'ge') {
                    router.replace(pathname, { locale: savedLocale as "ru" | "en" | "ge" });
                } else {
                    // If they are on a non-default locale (e.g. from a direct link or history),
                    // respect the URL and update their preference.
                    localStorage.setItem('NEXT_LOCALE', locale);
                }
            }
        } else {
            // Subsequent changes (e.g. user clicking a link or hitting back)
            // Just sync the storage with the URL.
            if (savedLocale !== locale) {
                localStorage.setItem('NEXT_LOCALE', locale);
            }
        }

        setChecked(true);
    }, [locale, pathname, router, checked]);

    return null;
}
