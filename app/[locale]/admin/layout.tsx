export const dynamic = 'force-dynamic';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen bg-zinc-50 font-sans text-zinc-900">
            {children}
        </div>
    );
}
