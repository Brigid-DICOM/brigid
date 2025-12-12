"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { getDicomStatsQuery } from "@/react-query/queries/stats";
import { useT } from "@/app/_i18n/client";

export default function HomeContent() {
    const { t } = useT("translation");
    const { workspaceId } = useParams<{ workspaceId: string }>();
    const { data: dicomStats } = useQuery(
        getDicomStatsQuery({
            workspaceId: workspaceId ?? "",
        }),
    );

    const useCarousel = (dicomStats?.modalities?.length ?? 0) > 3;

    return (
        <div className="p-4 h-full flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-0">
                <div className="bg-card border border-border shadow-lg rounded-lg p-8 flex flex-col">
                    <h2 className="text-2xl font-semibold mb-2 text-foreground">
                        {t("dashboard.patientCount")}
                    </h2>
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-6xl font-bold text-primary">
                            {dicomStats?.patientCount}
                        </p>
                    </div>
                </div>

                <div className="bg-card border border-border shadow-lg rounded-lg p-8 flex flex-col">
                    <h2 className="text-2xl font-semibold mb-2 text-foreground">
                        {t("dashboard.instanceCount")}
                    </h2>
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-6xl font-bold text-primary">
                            {dicomStats?.instanceCount}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-card border border-border shadow-lg rounded-lg p-6 flex-1 min-h-0 flex flex-col">
                <h2 className="text-2xl font-semibold mb-6 text-foreground">
                    {t("dashboard.modalities")}
                </h2>
                <div className="flex-1 flex items-stretch">
                    {useCarousel ? (
                        <div className="w-full px-8 relative">
                            <Carousel
                                opts={{
                                    align: "start",
                                }}
                                className="w-full h-full [&>[data-slot=carousel-content]]:h-full"
                            >
                                <CarouselContent className="h-full">
                                    {dicomStats?.modalities?.map(
                                        (modality: {
                                            modality: string;
                                            count: number;
                                        }) => (
                                            <CarouselItem
                                                key={modality.modality}
                                                className="basis-1/3 h-full"
                                            >
                                                <div
                                                    className={cn(
                                                        "border border-border",
                                                        "flex flex-col flex-1 p-8 h-full",
                                                        "bg-card hover:bg-accent",
                                                        "rounded-lg hover:shadow-md",
                                                    )}
                                                >
                                                    <h3 className="text-3xl font-semibold mb-2 text-foreground">
                                                        {modality.modality}
                                                    </h3>
                                                    <div className="flex-1 flex items-center justify-center">
                                                        <p className="text-6xl font-bold text-primary">
                                                            {modality.count}
                                                        </p>
                                                    </div>
                                                </div>
                                            </CarouselItem>
                                        ),
                                    )}
                                </CarouselContent>
                                <CarouselPrevious />
                                <CarouselNext />
                            </Carousel>
                        </div>
                    ) : dicomStats?.modalities &&
                      dicomStats.modalities.length > 0 ? (
                        <div className="flex flex-wrap gap-4 justify-between w-full">
                            {dicomStats?.modalities?.map(
                                (modality: {
                                    modality: string;
                                    count: number;
                                }) => (
                                    <div
                                        key={modality.modality}
                                        className={cn(
                                            "border border-border",
                                            "flex flex-col flex-1 p-8",
                                            "bg-card hover:bg-accent",
                                            "rounded-lg hover:shadow-md",
                                        )}
                                    >
                                        <h3 className="text-3xl font-semibold mb-2 text-foreground">
                                            {modality.modality}
                                        </h3>
                                        <div className="flex-1 flex items-center justify-center">
                                            <p className="text-6xl font-bold text-primary">
                                                {modality.count}
                                            </p>
                                        </div>
                                    </div>
                                ),
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center flex-1">
                            <p className="text-2xl font-semibold mb-2 text-foreground">
                                {t("dashboard.noModalitiesFound")}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
