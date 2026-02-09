import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import LocaleInitializer from '@/components/LocaleInitializer';
import ResizeObserverFix from '@/components/ResizeObserverFix';
import ChromeIOSOrientationFix from '@/components/ChromeIOSOrientationFix';
import Script from 'next/script';
import { Analytics } from "@vercel/analytics/next";

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

// Script to detect Chrome iOS early and add class to html
const chromeIOSScript = `
(function() {
    var isChromeIOS = /CriOS/.test(navigator.userAgent) && /iPhone|iPad|iPod/.test(navigator.userAgent);
    if (isChromeIOS) {
        document.documentElement.classList.add('chrome-ios');
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
                <ChromeIOSOrientationFix />
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <LocaleInitializer />
                    {children}
                </NextIntlClientProvider>
                <Analytics />
            </body>
        </html>
    );
}
