interface EmptyStateProps {
    title: string;
    description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    {title}
                </h2>
                <p className="text-gray-600">{description}</p>
            </div>
        </div>
    );
}
