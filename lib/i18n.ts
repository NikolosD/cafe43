import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
    return {
        messages: (await import(`../messages/${locale}.json`)).default
    };
});

export const locales = ['ru', 'en', 'ge'] as const;
export const defaultLocale = 'ge' as const;
