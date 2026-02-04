import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import LocaleInitializer from '@/components/LocaleInitializer';
import ResizeObserverFix from '@/components/ResizeObserverFix';
import Script from 'next/script';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Cafe 43",
    description: "Digital Menu",
    icons: {
        icon: "/logo.svg",
    },
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover',
};

// Script to detect Chrome iOS and add class to html + handle orientation
const chromeIOSScript = `
(function() {
    var isChromeIOS = /CriOS/.test(navigator.userAgent) && /iPhone|iPad|iPod/.test(navigator.userAgent);
    if (isChromeIOS) {
        document.documentElement.classList.add('chrome-ios');
        // Force reflow after orientation change
        window.addEventListener('orientationchange', function() {
            setTimeout(function() {
                document.body.style.display = 'none';
                void document.body.offsetHeight;
                document.body.style.display = '';
            }, 100);
        });
    }
})();
`;

export default async function RootLayout({
    children,
    params: { locale }
}: {
    children: React.ReactNode;
    params: { locale: string };
}) {
    const messages = await getMessages();

    return (
        <html lang={locale}>
            <head>
                <Script id="chrome-ios-detect" strategy="beforeInteractive">
                    {chromeIOSScript}
                </Script>
            </head>
            <body className={inter.className}>
                <ResizeObserverFix />
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <LocaleInitializer />
                    {children}
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
