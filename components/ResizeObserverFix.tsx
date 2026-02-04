'use client';

import { useEffect } from 'react';

// Global fix for ResizeObserver loop error
export default function ResizeObserverFix() {
    useEffect(() => {
        // Suppress ResizeObserver errors (common on mobile orientation change)
        const originalError = window.console.error;
        window.console.error = (...args: any[]) => {
            if (
                typeof args[0] === 'string' &&
                (args[0].includes('ResizeObserver loop') ||
                 args[0].includes('ResizeObserver Loop'))
            ) {
                // Ignore ResizeObserver errors
                return;
            }
            originalError.apply(window.console, args);
        };

        // Also handle error events
        const handleError = (event: ErrorEvent) => {
            if (
                event.message &&
                (event.message.includes('ResizeObserver loop') ||
                 event.message.includes('ResizeObserver Loop'))
            ) {
                event.preventDefault();
                event.stopPropagation();
                return false;
            }
        };

        window.addEventListener('error', handleError, true);

        return () => {
            window.console.error = originalError;
            window.removeEventListener('error', handleError, true);
        };
    }, []);

    return null;
}
