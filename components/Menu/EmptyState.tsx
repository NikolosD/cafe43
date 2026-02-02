import { SearchX, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
    message?: string;
    onClear?: () => void;
}

export default function EmptyState({ message = "No dishes found", onClear }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 animate-scale-in">
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-xl" />
                <div className="relative p-6 rounded-full bg-gradient-to-br from-muted/50 to-muted/20 border border-white/50 shadow-lg">
                    <UtensilsCrossed className="w-10 h-10 text-muted-foreground/50" />
                </div>
            </div>
            <div className="space-y-2">
                <p className="text-lg font-medium text-foreground/80">{message}</p>
                <p className="text-sm text-muted-foreground max-w-[200px]">
                    Try checking back later or explore other categories
                </p>
            </div>
            {onClear && (
                <Button 
                    variant="outline" 
                    onClick={onClear} 
                    className="rounded-full px-6 border-primary/20 hover:bg-primary/5 hover:border-primary/30 transition-all"
                >
                    <SearchX className="w-4 h-4 mr-2" />
                    Clear search
                </Button>
            )}
        </div>
    );
}
