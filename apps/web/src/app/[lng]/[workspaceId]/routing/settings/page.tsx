import RoutingSettingsContent from "./content";

interface RoutingSettingsPageProps {
    params: Promise<{
        workspaceId: string;
    }>;
}

export default async function RoutingSettingsPage({
    params,
}: RoutingSettingsPageProps) {
    const { workspaceId } = await params;
    return <RoutingSettingsContent workspaceId={workspaceId} />;
}
