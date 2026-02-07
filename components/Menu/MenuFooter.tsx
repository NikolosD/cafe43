import { MapPin, Instagram } from 'lucide-react';

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
    if (!settings) return null;

    const { address, google_maps_url, instagram_url } = settings;
    const { glovo: glovo_url, wolt: wolt_url } = deliveryLinks;

    // If everything is missing, hide footer
    if (!address && !instagram_url && !glovo_url && !wolt_url) return null;

    return (
        <footer className="mt-auto relative overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
            
            <div className="relative py-12 px-6 border-t border-black/5">
                <div className="max-w-md mx-auto flex flex-col items-center gap-8 text-center">
                    
                    {/* Decorative line */}
                    <div className="flex items-center gap-3 w-full justify-center">
                        <div className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-transparent to-primary/30" />
                        <div className="w-2 h-2 rounded-full bg-primary/40" />
                        <div className="h-px flex-1 max-w-[60px] bg-gradient-to-l from-transparent to-primary/30" />
                    </div>

                    {/* Contact Buttons Grid - Vertical stack */}
                    <div className="flex flex-col items-center gap-3 w-full max-w-xs mx-auto">
                        {/* Address */}
                        {address && (
                            <a
                                href={google_maps_url || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2.5 px-5 py-3 rounded-2xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-black/5 hover:shadow-lg hover:border-primary/20 hover:-translate-y-0.5 transition-all duration-300 group w-full"
                            >
                                <div className="p-1.5 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-medium text-foreground/80 leading-snug">
                                    {address}
                                </span>
                            </a>
                        )}

                        {/* Instagram */}
                        {instagram_url && (
                            <a
                                href={instagram_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2.5 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white font-medium hover:shadow-lg hover:shadow-pink-500/25 hover:-translate-y-0.5 transition-all duration-300 active:scale-95 w-full"
                            >
                                <Instagram className="w-4 h-4" />
                                <span>Instagram</span>
                            </a>
                        )}

                        {/* Glovo */}
                        {glovo_url && (
                            <a
                                href={glovo_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center px-6 py-2.5 rounded-xl bg-[#FFC600] hover:shadow-lg hover:shadow-[#FFC600]/30 hover:-translate-y-0.5 transition-all duration-300 active:scale-95 w-full"
                            >
                                <span className="text-[#009646] font-black text-base tracking-tight" style={{ fontFamily: 'system-ui, sans-serif' }}>Glovo</span>
                            </a>
                        )}

                        {/* Wolt */}
                        {wolt_url && (
                            <a
                                href={wolt_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center px-6 py-2.5 rounded-xl bg-[#009DE0] hover:shadow-lg hover:shadow-[#009DE0]/30 hover:-translate-y-0.5 transition-all duration-300 active:scale-95 w-full"
                            >
                                <span className="text-white font-bold text-base tracking-tight" style={{ fontFamily: 'system-ui, sans-serif' }}>Wolt</span>
                            </a>
                        )}
                    </div>

                    {/* Brand/Copyright */}
                    <div className="pt-6 border-t border-black/5 w-full">
                        <div className="flex flex-col items-center gap-2">
                            <p className="text-[11px] text-muted-foreground/60 font-medium uppercase tracking-[0.25em]">
                                Cafe 43
                            </p>
                            <p className="text-[10px] text-muted-foreground/40">
                                &copy; {new Date().getFullYear()} All rights reserved
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
