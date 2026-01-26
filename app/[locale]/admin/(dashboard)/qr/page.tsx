'use client';

import { useState, useRef } from 'react';
import QRCode from 'react-qr-code';
import { toPng } from 'html-to-image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Download, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function QRGeneratorPage() {
    const t = useTranslations('Admin');
    const [tableNumber, setTableNumber] = useState('');
    const [language, setLanguage] = useState('ge');
    const [copied, setCopied] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const qrRef = useRef<HTMLDivElement>(null);

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '');
    const qrUrl = `${baseUrl}/${language}/menu${tableNumber ? `?table=${tableNumber}` : ''}`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(qrUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy", err);
        }
    };

    const handleDownload = async () => {
        if (!qrRef.current) return;
        setDownloading(true);

        try {
            const dataUrl = await toPng(qrRef.current, {
                quality: 1,
                backgroundColor: 'white',
                pixelRatio: 3,
                style: {
                    padding: '20px'
                }
            });

            const link = document.createElement('a');
            link.download = `qr-table-${tableNumber || 'main'}-${language}.png`;
            link.href = dataUrl;
            link.click();

            setTimeout(() => setDownloading(false), 2000);
        } catch (err) {
            console.error("Download failed", err);
            setDownloading(false);
            window.alert("Could not generate PNG image.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mb-2">{t('qr')}</h1>
                <p className="text-zinc-500">{t('qr_desc')}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Controls */}
                <Card className="border-zinc-200 shadow-sm rounded-3xl overflow-hidden">
                    <CardHeader className="bg-zinc-50/50">
                        <CardTitle className="text-lg">{t('settings')}</CardTitle>
                        <CardDescription>{t('settings_desc')}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="table">{t('table_number')}</Label>
                            <Input
                                id="table"
                                placeholder={t('table_placeholder')}
                                value={tableNumber}
                                onChange={(e) => setTableNumber(e.target.value)}
                                className="rounded-xl border-zinc-200 focus-visible:ring-zinc-900"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>{t('menu_language')}</Label>
                            <Select value={language} onValueChange={setLanguage}>
                                <SelectTrigger className="rounded-xl border-zinc-200 focus:ring-zinc-900">
                                    <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-zinc-200">
                                    <SelectItem value="ge">Georgian (ქართული)</SelectItem>
                                    <SelectItem value="ru">Russian (Русский)</SelectItem>
                                    <SelectItem value="en">English (English)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="pt-4 space-y-3">
                            <Button
                                onClick={handleCopy}
                                className="w-full justify-between h-12 px-6 rounded-xl border-zinc-200"
                                // @ts-ignore
                                variant="outline"
                            >
                                <span className="flex items-center gap-2">
                                    {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                                    {copied ? t('copied') : t('copy_link')}
                                </span>
                                <span className="text-xs text-zinc-400 truncate ml-4 max-w-[150px]">
                                    {qrUrl}
                                </span>
                            </Button>

                            <Button
                                onClick={handleDownload}
                                className="w-full h-12 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white shadow-xl shadow-zinc-200 transition-all active:scale-95"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                {t('download_png')}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Preview */}
                <Card className="border-zinc-200 shadow-sm rounded-3xl overflow-hidden flex flex-col items-center justify-center p-8 bg-zinc-50/30">
                    <div className="text-center mb-6">
                        <h3 className="font-bold text-zinc-900">{t('preview')}</h3>
                        <p className="text-xs text-zinc-500">{t('scan_test')}</p>
                    </div>

                    <div
                        ref={qrRef}
                        className="bg-white p-8 rounded-3xl shadow-2xl shadow-zinc-200/50 border border-zinc-100 flex items-center justify-center"
                    >
                        <QRCode
                            value={qrUrl}
                            size={200}
                            level="H"
                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                        />
                    </div>

                    <div className="mt-8 text-center max-w-[200px]">
                        <p className="text-[10px] text-zinc-400 font-mono break-all uppercase tracking-tighter">
                            {qrUrl}
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
}
