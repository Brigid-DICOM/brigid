import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "../ui/button";

interface PaginationControlsProps {
    canGoPrevious: boolean;
    canGoNext: boolean;
    onPrevious: () => void;
    onNext: () => void;
}

export function PaginationControls({
    canGoPrevious,
    canGoNext,
    onPrevious,
    onNext,
}: PaginationControlsProps) {
    return (
        <div className="flex items-between items-center justify-center space-x-4">
            <Button
                variant={"outline"}
                onClick={onPrevious}
                disabled={!canGoPrevious}
                className="flex items-center space-x-2"
            >
                <ChevronLeftIcon className="size-4" />
                <span>Previous</span>
            </Button>

            <Button
                variant={"outline"}
                onClick={onNext}
                disabled={!canGoNext}
                className="flex items-center space-x-2"
            >
                <span>Next</span>
                <ChevronRightIcon className="size-4" />
            </Button>
        </div>
    );
}
