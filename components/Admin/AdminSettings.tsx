'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { adminUpdateSettings } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Instagram, Save, Globe } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface AdminSettingsProps {
    initialSettings: {
        id: string;
        address: string | null;
        google_maps_url: string | null;
        instagram_url: string | null;
    } | null;
}

export default function AdminSettings({ initialSettings }: AdminSettingsProps) {
    const t = useTranslations('Admin');
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState(initialSettings || {
        address: '',
        google_maps_url: '',
        instagram_url: ''
    });

    const handleSave = async () => {
        setLoading(true);
        try {
            await adminUpdateSettings(supabase, settings);
            alert(t('settings_saved'));
        } catch (error) {
            console.error(error);
            alert(t('settings_error'));
        } finally {
            setLoading(false);
        }
    };

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
                                    onChange={e => setSettings({ ...settings, address: e.target.value })}
                                    className="rounded-xl border-zinc-200 focus-visible:ring-zinc-900"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="maps">{t('maps_url')}</Label>
                                <Input
                                    id="maps"
                                    placeholder="https://maps.app.goo.gl/..."
                                    value={settings.google_maps_url || ''}
                                    onChange={e => setSettings({ ...settings, google_maps_url: e.target.value })}
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
                                    onChange={e => setSettings({ ...settings, instagram_url: e.target.value })}
                                    className="rounded-xl border-zinc-200 focus-visible:ring-zinc-900"
                                />
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
