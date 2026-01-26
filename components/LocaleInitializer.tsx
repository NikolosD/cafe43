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
        if (checked) return;

        const savedLocale = localStorage.getItem('NEXT_LOCALE');

        // Only redirect if we have a saved locale, it's different from current,
        // and we are NOT on a specific table/admin page where language might be forced?
        // Actually, just redirect if it's different.
        if (savedLocale && savedLocale !== locale && (savedLocale === 'ru' || savedLocale === 'en' || savedLocale === 'ge')) {
            router.replace(pathname, { locale: savedLocale as "ru" | "en" | "ge" });
        }

        setChecked(true);
    }, [locale, pathname, router, checked]);

    return null;
}
