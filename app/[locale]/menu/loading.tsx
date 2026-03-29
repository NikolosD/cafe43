import { Skeleton } from '@/components/ui/skeleton';

export default function MenuLoading() {
    return (
        <div className="min-h-screen bg-[#faf9f7] flex flex-col relative" style={{ minHeight: '100dvh' }}>
            {/* Header skeleton */}
            <div className="pt-6 pb-4 flex justify-center">
                <Skeleton className="h-12 w-32 rounded-2xl" />
            </div>

            {/* Categories skeleton */}
            <div className="max-w-3xl mx-auto px-4 pt-6 pb-24 w-full space-y-5">
                {[1, 2, 3, 4].map(i => (
                    <Skeleton key={i} className="h-32 sm:h-44 w-full rounded-[2rem]" />
                ))}
            </div>
        </div>
    );
}
