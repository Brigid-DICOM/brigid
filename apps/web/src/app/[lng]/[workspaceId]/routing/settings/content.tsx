"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DestinationsTab } from "./destinations-tab";
import { RulesTab } from "./rules-tab";
import { TagsTab } from "./tags-tab";

export default function RoutingSettingsContent({
    workspaceId,
}: {
    workspaceId: string;
}) {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Routing Settings</h1>

            <Tabs defaultValue="destinations">
                <TabsList>
                    <TabsTrigger value="destinations">
                        Destinations
                    </TabsTrigger>
                    <TabsTrigger value="rules">Rules</TabsTrigger>
                    <TabsTrigger value="tags">Tags</TabsTrigger>
                </TabsList>
                <TabsContent value="destinations">
                    <DestinationsTab workspaceId={workspaceId} />
                </TabsContent>
                <TabsContent value="rules">
                    <RulesTab workspaceId={workspaceId} />
                </TabsContent>
                <TabsContent value="tags">
                    <TagsTab workspaceId={workspaceId} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
