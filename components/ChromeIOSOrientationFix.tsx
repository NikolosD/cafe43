'use client';

import { useEffect } from 'react';
import { isChromeIOS, useChromeIOSOrientationFix } from '@/lib/useChromeIOS';

/**
 * Ensures the Chrome iOS specific class is applied
 * and normalizes viewport height on rotation.
 */
export default function ChromeIOSOrientationFix() {
    useChromeIOSOrientationFix();

    useEffect(() => {
        if (!isChromeIOS()) return;
        document.documentElement.classList.add('chrome-ios');

        return () => {
            document.documentElement.classList.remove('chrome-ios');
        };
    }, []);

    return null;
}
