'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { TableRow, TableCell } from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface SortableRowProps {
    id: string;
    children: React.ReactNode;
    className?: string;
    disabled?: boolean;
}

export function SortableRow({ id, children, className, disabled }: SortableRowProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id, disabled });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <TableRow
            ref={setNodeRef}
            style={style}
            className={cn(
                "group transition-colors relative",
                isDragging ? "opacity-50 z-50 bg-zinc-50 cursor-grabbing" : "hover:bg-zinc-50/60",
                disabled && "cursor-default",
                className
            )}
        >
            <TableCell className="w-[40px] px-2 text-zinc-400">
                <button
                    {...attributes}
                    {...listeners}
                    className={cn(
                        "p-1 rounded-md transition-colors",
                        disabled
                            ? "cursor-default opacity-20"
                            : "cursor-grab active:cursor-grabbing hover:bg-zinc-100"
                    )}
                    type="button"
                    title={disabled ? "Reordering available inside category" : "Drag to reorder"}
                >
                    <GripVertical className="h-4 w-4" />
                </button>
            </TableCell>
            {children}
        </TableRow>
    );
}
