import Link from 'next/link';

export default function NotFound() {
    return (
        <div
            className="min-h-screen bg-[#faf9f7] flex flex-col items-center justify-center p-6 text-center"
            style={{ minHeight: '100dvh' }}
        >
            <div className="max-w-sm space-y-6">
                <div className="text-8xl font-extrabold tracking-tighter text-primary/20 font-display">
                    404
                </div>
                <h1
                    className="text-3xl tracking-tighter uppercase text-black"
                    style={{ fontFamily: '"Cooper Black", serif' }}
                >
                    CAFE 43
                </h1>
                <p className="text-muted-foreground text-sm">
                    This page does not exist or has been moved.
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-medium rounded-2xl hover:opacity-90 transition-opacity active:scale-[0.98]"
                >
                    Go to Menu
                </Link>
            </div>
        </div>
    );
}
