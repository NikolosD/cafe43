import { getRequestConfig } from 'next-intl/server';

export const locales = ['ru', 'en', 'ge'] as const;
export const defaultLocale = 'ge' as const;

export default getRequestConfig(async ({ requestLocale }) => {
    let locale = await requestLocale;

    // Fallback if locale is undefined or not in supported list
    if (!locale || !locales.includes(locale as any)) {
        locale = defaultLocale;
    }

    return {
        locale,
        messages: (await import(`../messages/${locale}.json`)).default
    };
});
