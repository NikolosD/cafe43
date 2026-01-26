import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import LocaleInitializer from '@/components/LocaleInitializer';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Cafe 43",
    description: "Digital Menu",
    icons: {
        icon: "/logo.svg",
    },
};

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
            <body className={inter.className}>
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <LocaleInitializer />
                    {children}
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
