'use client';

import { useState, useRef, useDeferredValue, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Download, Check, Settings2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import QRStyled from '@/components/Admin/QRStyled';
import { DotType, CornerSquareType, CornerDotType, GradientType, ErrorCorrectionLevel } from 'qr-code-styling';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function QRGeneratorPage() {
    const t = useTranslations('Admin');
    const [tableNumber, setTableNumber] = useState('');
    const [language, setLanguage] = useState('ge');
    const [copied, setCopied] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [qrColor, setQrColor] = useState('#000000');
    const [qrColor2, setQrColor2] = useState('');
    const [gradientType, setGradientType] = useState<GradientType>('linear');
    const [bgColor, setBgColor] = useState('#ffffff');
    const [useRootUrl, setUseRootUrl] = useState(false);
    const [dotsType, setDotsType] = useState<DotType>('square');
    const [cornersSquareType, setCornersSquareType] = useState<CornerSquareType>('square');
    const [cornersDotType, setCornersDotType] = useState<CornerDotType>('square');
    const [logo, setLogo] = useState<string>('');
    const [logoSize, setLogoSize] = useState(0.4);
    const [logoMargin, setLogoMargin] = useState(5);
    const [errorLevel, setErrorLevel] = useState<ErrorCorrectionLevel>('H');
    const [mounted, setMounted] = useState(false);
    const qrRef = useRef<any>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Defer high-frequency updates to keep UI responsive
    const deferredQrColor = useDeferredValue(qrColor);
    const deferredQrColor2 = useDeferredValue(qrColor2);
    const deferredBgColor = useDeferredValue(bgColor);
    const deferredLogoSize = useDeferredValue(logoSize);
    const deferredLogoMargin = useDeferredValue(logoMargin);

    const baseUrl = mounted
        ? (process.env.NEXT_PUBLIC_SITE_URL || window.location.origin)
        : "";

    const qrUrl = useRootUrl
        ? (baseUrl || "/")
        : `${baseUrl}/${language}/menu${tableNumber ? `?table=${tableNumber}` : ''}`;

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
        qrRef.current.download({
            name: `qr-table-${tableNumber || 'main'}-${language}`,
            extension: 'png'
        });
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
                        <div className="space-y-4 pt-2">
                            <Label className="text-sm font-semibold">{t('qr_destination')}</Label>
                            <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-100 rounded-xl">
                                <Button
                                    variant={!useRootUrl ? "secondary" : "ghost"}
                                    onClick={() => setUseRootUrl(false)}
                                    className={cn("rounded-lg h-9 text-xs", !useRootUrl && "bg-white shadow-sm")}
                                >
                                    {t('specific_menu')}
                                </Button>
                                <Button
                                    variant={useRootUrl ? "secondary" : "ghost"}
                                    onClick={() => setUseRootUrl(true)}
                                    className={cn("rounded-lg h-9 text-xs", useRootUrl && "bg-white shadow-sm")}
                                >
                                    {t('main_menu_simple')}
                                </Button>
                            </div>
                        </div>

                        {!useRootUrl && (
                            <div className="space-y-4 animate-in fade-in duration-300">
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
                            </div>
                        )}

                        <div className="space-y-4 border-t pt-4">
                            <Label className="text-sm font-semibold">{t('customization')}</Label>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase text-zinc-500 font-bold">{t('qr_color')}</Label>
                                    <div className="flex gap-2 items-center">
                                        <input
                                            type="color"
                                            value={qrColor}
                                            onChange={(e) => setQrColor(e.target.value)}
                                            className="w-10 h-10 rounded-lg cursor-pointer border-none p-0 bg-transparent"
                                        />
                                        <span className="text-xs font-mono uppercase">{qrColor}</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase text-zinc-500 font-bold">{t('bg_color')}</Label>
                                    <div className="flex gap-2 items-center">
                                        <input
                                            type="color"
                                            value={bgColor}
                                            onChange={(e) => setBgColor(e.target.value)}
                                            className="w-10 h-10 rounded-lg cursor-pointer border-none p-0 bg-transparent"
                                        />
                                        <span className="text-xs font-mono uppercase">{bgColor}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 pt-2">
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase text-zinc-500 font-bold">{t('dots_style')}</Label>
                                    <Select value={dotsType} onValueChange={(v) => setDotsType(v as DotType)}>
                                        <SelectTrigger className="h-9 text-xs rounded-xl">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="square">Square</SelectItem>
                                            <SelectItem value="dots">Dots</SelectItem>
                                            <SelectItem value="rounded">Rounded</SelectItem>
                                            <SelectItem value="classy">Classy</SelectItem>
                                            <SelectItem value="classy-rounded">Classy Rounded</SelectItem>
                                            <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] uppercase text-zinc-500 font-bold">{t('corners_style')}</Label>
                                        <Select value={cornersSquareType} onValueChange={(v) => setCornersSquareType(v as CornerSquareType)}>
                                            <SelectTrigger className="h-9 text-xs rounded-xl">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="square">Square</SelectItem>
                                                <SelectItem value="dot">Dot</SelectItem>
                                                <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] uppercase text-zinc-500 font-bold">{t('corner_dots_style')}</Label>
                                        <Select value={cornersDotType} onValueChange={(v) => setCornersDotType(v as CornerDotType)}>
                                            <SelectTrigger className="h-9 text-xs rounded-xl">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="square">Square</SelectItem>
                                                <SelectItem value="dot">Dot</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
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
                <Card className="border-zinc-200 shadow-sm rounded-3xl overflow-hidden flex flex-col items-center p-8 bg-zinc-50/30">
                    <div className="text-center mb-6">
                        <h3 className="font-bold text-zinc-900">{t('preview')}</h3>
                        <p className="text-xs text-zinc-500">{t('scan_test')}</p>
                    </div>

                    <div
                        className="p-8 rounded-[3.5rem] flex items-center justify-center transition-all bg-white shadow-inner"
                        style={{ backgroundColor: bgColor }}
                    >
                        <QRStyled
                            data={qrUrl}
                            qrColor={deferredQrColor}
                            qrColor2={deferredQrColor2}
                            gradientType={gradientType}
                            bgColor={deferredBgColor}
                            dotsType={dotsType}
                            cornersSquareType={cornersSquareType}
                            cornersDotType={cornersDotType}
                            logo={logo}
                            logoSize={deferredLogoSize}
                            logoMargin={deferredLogoMargin}
                            errorCorrectionLevel={errorLevel}
                            onReady={(instance: any) => {
                                qrRef.current = instance;
                            }}
                        />
                    </div>

                    <Tabs defaultValue="content" className="w-full mt-8">
                        <TabsList className="grid w-full grid-cols-2 rounded-xl h-12">
                            <TabsTrigger value="content" className="rounded-lg">{t('content')}</TabsTrigger>
                            <TabsTrigger value="style" className="rounded-lg">{t('styling')}</TabsTrigger>
                        </TabsList>

                        <TabsContent value="content" className="space-y-4 pt-4">
                            <div className="space-y-4">
                                <Label className="text-sm font-semibold">{t('qr_destination')}</Label>
                                <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-100 rounded-xl">
                                    <Button
                                        variant={!useRootUrl ? "secondary" : "ghost"}
                                        onClick={() => setUseRootUrl(false)}
                                        className={cn("rounded-lg h-9 text-xs", !useRootUrl && "bg-white shadow-sm")}
                                    >
                                        {t('specific_menu')}
                                    </Button>
                                    <Button
                                        variant={useRootUrl ? "secondary" : "ghost"}
                                        onClick={() => setUseRootUrl(true)}
                                        className={cn("rounded-lg h-9 text-xs", useRootUrl && "bg-white shadow-sm")}
                                    >
                                        {t('main_menu_simple')}
                                    </Button>
                                </div>

                                {!useRootUrl && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="table" className="text-xs">{t('table_number')}</Label>
                                            <Input
                                                id="table"
                                                placeholder="Table #"
                                                value={tableNumber}
                                                onChange={(e) => setTableNumber(e.target.value)}
                                                className="h-9 text-sm rounded-xl"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs">{t('menu_language')}</Label>
                                            <Select value={language} onValueChange={setLanguage}>
                                                <SelectTrigger className="h-9 text-xs rounded-xl">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="ge">GE</SelectItem>
                                                    <SelectItem value="en">EN</SelectItem>
                                                    <SelectItem value="ru">RU</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3 pt-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-semibold">{t('logo')}</Label>
                                    {logo && (
                                        <Button variant="ghost" size="sm" className="h-6 text-[10px] text-red-500" onClick={() => setLogo('')}>
                                            {t('remove')}
                                        </Button>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        className="h-9 text-xs rounded-xl"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onload = () => setLogo(reader.result as string);
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                </div>
                                {logo && (
                                    <div className="grid grid-cols-2 gap-4 pt-2">
                                        <div className="space-y-1">
                                            <Label className="text-[10px] text-zinc-400 font-bold uppercase">{t('logo_size')}</Label>
                                            <Slider value={[logoSize]} min={0.1} max={0.5} step={0.01} onValueChange={([v]) => setLogoSize(v)} />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[10px] text-zinc-400 font-bold uppercase">{t('logo_margin')}</Label>
                                            <Slider value={[logoMargin]} min={0} max={20} step={1} onValueChange={([v]) => setLogoMargin(v)} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="style" className="space-y-6 pt-4">
                            <div className="space-y-4">
                                <Label className="text-sm font-semibold">{t('colors')}</Label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] uppercase text-zinc-500 font-bold">{t('qr_color')}</Label>
                                        <div className="flex gap-2 items-center">
                                            <input type="color" value={qrColor} onChange={(e) => setQrColor(e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer border-none p-0 bg-transparent" />
                                            <span className="text-[10px] font-mono uppercase">{qrColor}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] uppercase text-zinc-500 font-bold">{t('bg_color')}</Label>
                                        <div className="flex gap-2 items-center">
                                            <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer border-none p-0 bg-transparent" />
                                            <span className="text-[10px] font-mono uppercase">{bgColor}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-[10px] uppercase text-zinc-500 font-bold">{t('gradient')}</Label>
                                        {qrColor2 && (
                                            <Button variant="ghost" size="sm" className="h-4 text-[10px] px-1" onClick={() => setQrColor2('')}>Disable</Button>
                                        )}
                                    </div>
                                    <div className="flex gap-4">
                                        <input type="color" value={qrColor2 || '#ffffff'} onChange={(e) => setQrColor2(e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer border-none p-0 bg-transparent" />
                                        {qrColor2 && (
                                            <Select value={gradientType} onValueChange={(v) => setGradientType(v as GradientType)}>
                                                <SelectTrigger className="h-8 text-[10px] flex-1">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="linear">Linear</SelectItem>
                                                    <SelectItem value="radial">Radial</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-2 border-t">
                                <Label className="text-sm font-semibold">{t('shapes')}</Label>
                                <div className="space-y-3">
                                    <div className="space-y-1">
                                        <Label className="text-[10px] uppercase text-zinc-500 font-bold">{t('dots_style')}</Label>
                                        <Select value={dotsType} onValueChange={(v) => setDotsType(v as DotType)}>
                                            <SelectTrigger className="h-9 text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="square">Square</SelectItem>
                                                <SelectItem value="dots">Dots</SelectItem>
                                                <SelectItem value="rounded">Rounded</SelectItem>
                                                <SelectItem value="classy">Classy</SelectItem>
                                                <SelectItem value="classy-rounded">Classy Rounded</SelectItem>
                                                <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <Label className="text-[10px] uppercase text-zinc-500 font-bold">{t('corners_style')}</Label>
                                            <Select value={cornersSquareType} onValueChange={(v) => setCornersSquareType(v as CornerSquareType)}>
                                                <SelectTrigger className="h-9 text-xs">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="square">Square</SelectItem>
                                                    <SelectItem value="dot">Dot</SelectItem>
                                                    <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[10px] uppercase text-zinc-500 font-bold">{t('corner_dots_style')}</Label>
                                            <Select value={cornersDotType} onValueChange={(v) => setCornersDotType(v as CornerDotType)}>
                                                <SelectTrigger className="h-9 text-xs">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="square">Square</SelectItem>
                                                    <SelectItem value="dot">Dot</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] uppercase text-zinc-500 font-bold">{t('error_level')}</Label>
                                        <Select value={errorLevel} onValueChange={(v) => setErrorLevel(v as ErrorCorrectionLevel)}>
                                            <SelectTrigger className="h-9 text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="L">Low (Simpler)</SelectItem>
                                                <SelectItem value="M">Medium</SelectItem>
                                                <SelectItem value="Q">Quartile</SelectItem>
                                                <SelectItem value="H">High (Density)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>

                    <div className="mt-8 pt-6 border-t w-full space-y-3">
                        <div className="flex gap-2">
                            <Button
                                onClick={handleCopy}
                                className="flex-1 justify-center h-12 rounded-xl"
                                variant="outline"
                            >
                                {copied ? <Check className="w-4 h-4 mr-2 text-green-600" /> : <Copy className="w-4 h-4 mr-2" />}
                                {copied ? t('copied') : t('copy_link')}
                            </Button>

                            <Button
                                onClick={handleDownload}
                                className="flex-1 h-12 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white shadow-lg active:scale-95"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                {t('download_png')}
                            </Button>
                        </div>
                        <p className="text-[10px] text-zinc-400 font-mono text-center break-all uppercase tracking-tighter">
                            {qrUrl}
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
}
