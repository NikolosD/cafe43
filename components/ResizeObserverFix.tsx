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
                 args[0].includes('ResizeObserver Loop') ||
                 args[0].includes('ResizeObserver'))
            ) {
                // Ignore ResizeObserver errors
                return;
            }
            originalError.apply(window.console, args);
        };

        // Also handle error events - more aggressive for Chrome iOS
        const handleError = (event: ErrorEvent) => {
            if (
                event.message &&
                (event.message.includes('ResizeObserver') ||
                 event.message.includes('resizeObserver') ||
                 event.message.includes('intersection') ||
                 event.message.includes('InterObserver'))
            ) {
                event.preventDefault();
                event.stopPropagation();
                return false;
            }
        };

        // Handle unhandled promise rejections (Chrome iOS specific)
        const handleRejection = (event: PromiseRejectionEvent) => {
            if (
                event.reason && 
                typeof event.reason.message === 'string' &&
                event.reason.message.includes('ResizeObserver')
            ) {
                event.preventDefault();
            }
        };

        window.addEventListener('error', handleError, true);
        window.addEventListener('unhandledrejection', handleRejection, true);

        return () => {
            window.console.error = originalError;
            window.removeEventListener('error', handleError, true);
            window.removeEventListener('unhandledrejection', handleRejection, true);
        };
    }, []);

    return null;
}
