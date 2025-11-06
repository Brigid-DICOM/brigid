import { Skeleton } from "../ui/skeleton";

export function LoadingGrid({ itemCount = 10 }: { itemCount?: number }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
            {Array.from({ length: itemCount }).map((_, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: 數值直接從 index 取得，所以 key 只能用 index
                <div key={index} className="w-full max-w-sm">
                    <Skeleton className="aspect-square w-full mb-4" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>
                </div>
            ))}
        </div>
    );
}
