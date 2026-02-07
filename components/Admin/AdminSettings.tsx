'use client';

import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { adminUpdateSettings, adminUpdateDeliveryLink } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Instagram, Save, Globe, Truck } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface AdminSettingsProps {
    initialSettings: {
        id: string;
        address: string | null;
        google_maps_url: string | null;
        instagram_url: string | null;
    } | null;
    initialDeliveryLinks: Array<{
        id: string;
        platform: string;
        lang: string;
        url: string;
    }>;
}

const LANGUAGES = [
    { code: 'ge', label: 'ქართული' },
    { code: 'ru', label: 'Русский' },
    { code: 'en', label: 'English' },
];

export default function AdminSettings({ initialSettings, initialDeliveryLinks }: AdminSettingsProps) {
    const t = useTranslations('Admin');
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState(initialSettings || {
        address: '',
        google_maps_url: '',
        instagram_url: '',
    });

    // Convert delivery links array to structured object
    const [deliveryLinks, setDeliveryLinks] = useState(() => {
        const links: Record<string, Record<string, string>> = {
            glovo: { ge: '', ru: '', en: '' },
            wolt: { ge: '', ru: '', en: '' },
        };
        initialDeliveryLinks.forEach((link) => {
            if (links[link.platform]) {
                links[link.platform][link.lang] = link.url;
            }
        });
        return links;
    });

    const handleSave = async () => {
        setLoading(true);
        try {
            // Save settings
            await adminUpdateSettings(supabase, settings);

            // Save delivery links
            for (const platform of ['glovo', 'wolt']) {
                for (const lang of ['ge', 'ru', 'en']) {
                    const url = deliveryLinks[platform][lang];
                    if (url) {
                        await adminUpdateDeliveryLink(supabase, platform, lang, url);
                    }
                }
            }

            alert(t('settings_saved'));
        } catch (error) {
            console.error(error);
            alert(t('settings_error'));
        } finally {
            setLoading(false);
        }
    };

    const updateDeliveryLink = useCallback((platform: string, lang: string, url: string) => {
        setDeliveryLinks((prev) => ({
            ...prev,
            [platform]: {
                ...prev[platform],
                [lang]: url,
            },
        }));
    }, []);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mb-2">{t('settings')}</h1>
                <p className="text-zinc-500 text-sm italic">{t('settings_desc_page')}</p>
            </div>

            <Card className="border-zinc-200 shadow-sm rounded-3xl overflow-hidden bg-white">
                <CardHeader className="bg-zinc-50/50">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Globe className="w-5 h-5 text-zinc-400" />
                        {t('footer_info')}
                    </CardTitle>
                    <CardDescription>
                        {t('footer_info_desc')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-8">
                    {/* Address Group */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900 uppercase tracking-wider">
                            <MapPin className="w-4 h-4" /> {t('location')}
                        </div>
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="address">{t('physical_address')}</Label>
                                <Input
                                    id="address"
                                    placeholder="e.g. 189 Davit Aghmashenebeli Ave, Tbilisi 0112"
                                    value={settings.address || ''}
                                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                                    className="rounded-xl border-zinc-200 focus-visible:ring-zinc-900"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="maps">{t('maps_url')}</Label>
                                <Input
                                    id="maps"
                                    placeholder="https://maps.app.goo.gl/..."
                                    value={settings.google_maps_url || ''}
                                    onChange={(e) => setSettings({ ...settings, google_maps_url: e.target.value })}
                                    className="rounded-xl border-zinc-200 focus-visible:ring-zinc-900"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Social Group */}
                    <div className="space-y-4 pt-4 border-t border-zinc-100">
                        <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900 uppercase tracking-wider">
                            <Instagram className="w-4 h-4" /> {t('social_links')}
                        </div>
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="instagram">{t('instagram_link')}</Label>
                                <Input
                                    id="instagram"
                                    placeholder="https://www.instagram.com/your-cafe"
                                    value={settings.instagram_url || ''}
                                    onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                                    className="rounded-xl border-zinc-200 focus-visible:ring-zinc-900"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Delivery Group */}
                    <div className="space-y-4 pt-4 border-t border-zinc-100">
                        <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900 uppercase tracking-wider">
                            <Truck className="w-4 h-4" /> {t('delivery_links')}
                        </div>

                        {/* Glovo Links */}
                        <div className="space-y-3">
                            <Label className="text-sm text-zinc-600 font-medium">Glovo</Label>
                            <div className="grid gap-3 sm:grid-cols-3">
                                {LANGUAGES.map((lang) => (
                                    <div key={`glovo-${lang.code}`} className="space-y-1.5">
                                        <Label htmlFor={`glovo-${lang.code}`} className="text-xs text-zinc-400">
                                            {lang.label}
                                        </Label>
                                        <Input
                                            id={`glovo-${lang.code}`}
                                            placeholder={`https://glovoapp.com/${lang.code}/...`}
                                            value={deliveryLinks.glovo[lang.code]}
                                            onChange={(e) => updateDeliveryLink('glovo', lang.code, e.target.value)}
                                            className="rounded-xl border-zinc-200 focus-visible:ring-zinc-900 text-sm"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Wolt Links */}
                        <div className="space-y-3 pt-2">
                            <Label className="text-sm text-zinc-600 font-medium">Wolt</Label>
                            <div className="grid gap-3 sm:grid-cols-3">
                                {LANGUAGES.map((lang) => (
                                    <div key={`wolt-${lang.code}`} className="space-y-1.5">
                                        <Label htmlFor={`wolt-${lang.code}`} className="text-xs text-zinc-400">
                                            {lang.label}
                                        </Label>
                                        <Input
                                            id={`wolt-${lang.code}`}
                                            placeholder={`https://wolt.com/${lang.code}/...`}
                                            value={deliveryLinks.wolt[lang.code]}
                                            onChange={(e) => updateDeliveryLink('wolt', lang.code, e.target.value)}
                                            className="rounded-xl border-zinc-200 focus-visible:ring-zinc-900 text-sm"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-zinc-900 hover:bg-zinc-800 text-white shadow-xl shadow-zinc-200 transition-all active:scale-95 px-8 h-12 rounded-xl"
                >
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? t('saving') : t('save_settings')}
                </Button>
            </div>
        </div>
    );
}
