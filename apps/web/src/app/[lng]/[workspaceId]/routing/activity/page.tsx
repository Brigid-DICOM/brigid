import RoutingActivityContent from "./content";

interface RoutingActivityPageProps {
    params: Promise<{
        workspaceId: string;
    }>;
}

export default async function RoutingActivityPage({
    params,
}: RoutingActivityPageProps) {
    const { workspaceId } = await params;
    return <RoutingActivityContent workspaceId={workspaceId} />;
}
