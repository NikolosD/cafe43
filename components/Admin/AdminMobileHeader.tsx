'use client';

import { Menu, Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import AdminSidebar from './AdminSidebar';
import { useState } from 'react';

export default function AdminMobileHeader() {
    const [open, setOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full bg-zinc-900 text-white border-b border-white/10 md:hidden">
            <div className="px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3 font-bold text-lg tracking-tight">
                    <div className="bg-white text-zinc-900 p-1.5 rounded-lg">
                        <Coffee className="w-5 h-5" />
                    </div>
                    Cafe 43
                </div>

                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-white/10">
                            <Menu className="w-6 h-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 border-none w-[280px] bg-zinc-900">
                        {/* Reuse Sidebar Component inside Drawer */}
                        <div className="h-full" onClick={() => setOpen(false)}>
                            <AdminSidebar className="h-full border-none" />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}
