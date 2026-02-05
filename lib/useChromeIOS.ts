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

// Normalize viewport height on Chrome iOS to avoid layout thrash on rotate
export const useChromeIOSOrientationFix = () => {
    useEffect(() => {
        if (!isChromeIOS() || orientationFixInitialized) return;

        orientationFixInitialized = true;

        let rafId: number | null = null;

        const applyAppHeight = () => {
            if (rafId !== null) {
                cancelAnimationFrame(rafId);
            }
            rafId = requestAnimationFrame(() => {
                const height = window.visualViewport?.height ?? window.innerHeight;
                document.documentElement.style.setProperty('--app-height', `${height}px`);
                rafId = null;
            });
        };

        applyAppHeight();

        window.addEventListener('orientationchange', applyAppHeight, { passive: true });
        window.addEventListener('resize', applyAppHeight, { passive: true });
        window.visualViewport?.addEventListener('resize', applyAppHeight, { passive: true });

        return () => {
            window.removeEventListener('orientationchange', applyAppHeight);
            window.removeEventListener('resize', applyAppHeight);
            window.visualViewport?.removeEventListener('resize', applyAppHeight);
            if (rafId !== null) {
                cancelAnimationFrame(rafId);
            }
            document.documentElement.style.removeProperty('--app-height');
            orientationFixInitialized = false;
        };
    }, []);
};
