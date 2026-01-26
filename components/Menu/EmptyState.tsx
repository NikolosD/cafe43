import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
    message?: string;
    onClear?: () => void;
}

export default function EmptyState({ message = "No dishes found", onClear }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
            <div className="bg-muted/50 p-4 rounded-full">
                <SearchX className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium">{message}</p>
            {onClear && (
                <Button variant="outline" onClick={onClear} className="rounded-full">
                    Clear search
                </Button>
            )}
        </div>
    );
}
