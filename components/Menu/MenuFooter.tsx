'use client';

import { MapPin, Instagram } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface MenuFooterProps {
    settings: {
        address: string | null;
        google_maps_url: string | null;
        instagram_url: string | null;
    } | null;
    deliveryLinks?: {
        glovo?: string;
        wolt?: string;
    };
}

export default function MenuFooter({ settings, deliveryLinks = {} }: MenuFooterProps) {
    const t = useTranslations('Menu');
    if (!settings) return null;

    const { address, google_maps_url, instagram_url } = settings;
    const { glovo: glovo_url, wolt: wolt_url } = deliveryLinks;

    if (!address && !instagram_url && !glovo_url && !wolt_url) return null;

    return (
        <footer className="mt-auto">
            <div className="py-10 px-6 border-t border-black/[0.06]">
                <div className="max-w-sm mx-auto flex flex-col items-center gap-6 text-center">

                    {/* Address */}
                    {address && (
                        <a
                            href={google_maps_url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-foreground/40 hover:text-foreground/60 transition-colors"
                        >
                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                            <span className="text-[13px]">{address}</span>
                        </a>
                    )}

                    {/* Links row */}
                    <div className="flex items-center gap-4 text-[13px]">
                        {instagram_url && (
                            <a
                                href={instagram_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-foreground/40 hover:text-foreground/60 transition-colors"
                            >
                                <Instagram className="w-3.5 h-3.5" />
                                <span>Instagram</span>
                            </a>
                        )}
                        {glovo_url && (
                            <a
                                href={glovo_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-foreground/40 hover:text-foreground/60 transition-colors font-medium"
                            >
                                Glovo
                            </a>
                        )}
                        {wolt_url && (
                            <a
                                href={wolt_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-foreground/40 hover:text-foreground/60 transition-colors font-medium"
                            >
                                Wolt
                            </a>
                        )}
                    </div>

                    {/* Brand */}
                    <div className="pt-4 border-t border-black/[0.04] w-full">
                        <p className="text-[11px] text-foreground/20 font-display font-light tracking-[0.25em] uppercase">
                            Cafe 43
                        </p>
                        <p className="text-[10px] text-foreground/15 mt-1">
                            &copy; {new Date().getFullYear()} {t('all_rights')}
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
