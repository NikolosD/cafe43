'use client';

import { useEffect } from 'react';

// Global fix for ResizeObserver loop error
export default function ResizeObserverFix() {
    useEffect(() => {
        // Suppress ResizeObserver errors in console only
        const originalError = window.console.error;
        window.console.error = (...args: any[]) => {
            if (
                typeof args[0] === 'string' &&
                args[0].includes('ResizeObserver loop')
            ) {
                // Ignore only the specific loop error
                return;
            }
            originalError.apply(window.console, args);
        };

        return () => {
            window.console.error = originalError;
        };
    }, []);

    return null;
}
