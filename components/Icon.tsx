'use client';

import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface IconProps {
    icon: LucideIcon;
    className?: string;
    size?: number;
    strokeWidth?: number;
}

// iOS Safari fix: явные размеры + viewBox + preserveAspectRatio
export default function Icon({ icon: IconComponent, className, size = 24, strokeWidth = 1.5 }: IconProps) {
    return (
        <div 
            className={cn("flex items-center justify-center flex-shrink-0", className)}
            style={{ 
                width: size, 
                height: size,
                minWidth: size,
                minHeight: size
            }}
        >
            <IconComponent 
                width={size} 
                height={size} 
                strokeWidth={strokeWidth}
                style={{
                    width: size,
                    height: size,
                    display: 'block',
                    flexShrink: 0
                }}
            />
        </div>
    );
}

// Pre-sized icons for common use cases
export function IconSmall({ icon, className }: { icon: LucideIcon; className?: string }) {
    return <Icon icon={icon} size={16} className={className} />;
}

export function IconMedium({ icon, className }: { icon: LucideIcon; className?: string }) {
    return <Icon icon={icon} size={24} className={className} />;
}

export function IconLarge({ icon, className }: { icon: LucideIcon; className?: string }) {
    return <Icon icon={icon} size={32} className={className} />;
}
