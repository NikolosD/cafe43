'use client';

import { useState, useEffect } from 'react';

export const isChromeIOS = (): boolean => {
    if (typeof navigator === 'undefined') return false;
    const ua = navigator.userAgent;
    return /CriOS/.test(ua) && /iPhone|iPad|iPod/.test(ua);
};

export const useChromeIOS = () => {
    const [isChromeOnIOS, setIsChromeOnIOS] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        setIsChromeOnIOS(isChromeIOS());
    }, []);

    return { isChromeOnIOS, mounted };
};

let orientationFixInitialized = false;

// Force style recalculation on orientation change for Chrome iOS
export const useChromeIOSOrientationFix = () => {
    useEffect(() => {
        if (!isChromeIOS() || orientationFixInitialized) return;

        orientationFixInitialized = true;

        let timeoutId: ReturnType<typeof setTimeout> | null = null;

        const handleOrientationChange = () => {
            // Force redraw after orientation change
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                // Trigger style recalculation
                document.body.style.display = 'none';
                void document.body.offsetHeight; // Force reflow
                document.body.style.display = '';
            }, 100);
        };

        window.addEventListener('orientationchange', handleOrientationChange, { passive: true });

        return () => {
            window.removeEventListener('orientationchange', handleOrientationChange);
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            orientationFixInitialized = false;
        };
    }, []);
};
