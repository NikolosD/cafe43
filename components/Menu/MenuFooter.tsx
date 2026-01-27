import { MapPin, Instagram } from 'lucide-react';

interface MenuFooterProps {
    settings: {
        address: string | null;
        google_maps_url: string | null;
        instagram_url: string | null;
    } | null;
}

export default function MenuFooter({ settings }: MenuFooterProps) {
    if (!settings) return null;

    const { address, google_maps_url, instagram_url } = settings;

    // If everything is missing, hide footer
    if (!address && !instagram_url) return null;

    return (
        <footer className="mt-auto py-12 px-6 border-t border-slate-200/60 bg-white/50">
            <div className="max-w-md mx-auto flex flex-col items-center gap-6 text-center">

                {/* Address */}
                {address && (
                    <a
                        href={google_maps_url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center gap-2 group transition-all"
                    >
                        <div className="p-2.5 rounded-full bg-slate-100/80 group-hover:bg-slate-200/80 text-slate-500 transition-colors">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium text-slate-600 max-w-[200px] leading-relaxed">
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
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200 active:scale-95"
                    >
                        <Instagram className="w-4 h-4" />
                        <span>Instagram</span>
                    </a>
                )}

                {/* Subtle Brand/Copyright or just spacer */}
                <div className="mt-4 pt-8 border-t border-slate-100 w-full">
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-[0.2em]">
                        &copy; {new Date().getFullYear()} Cafe 43
                    </p>
                </div>
            </div>
        </footer>
    );
}
