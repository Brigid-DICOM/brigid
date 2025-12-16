"use client";

import { useQuery } from "@tanstack/react-query";
import {
    DatabaseIcon,
    GaugeIcon,
    Share2Icon,
    Trash2Icon,
    UploadIcon,
    UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useT } from "@/app/_i18n/client";
import { fallbackLng } from "@/app/_i18n/settings";
import { getWorkspaceByIdQuery } from "@/react-query/queries/workspace";
import { WORKSPACE_PERMISSIONS } from "@/server/const/workspace.const";
import { hasPermission } from "@/server/utils/workspacePermissions";
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
} from "./ui/sidebar";

export function NavMain() {
    const workspaceId = useParams<{ workspaceId: string }>().workspaceId;
    const lng = useParams<{ lng: string }>().lng ?? fallbackLng;
    const { t } = useT("translation");

    const { data: workspaceData } = useQuery(
        getWorkspaceByIdQuery(workspaceId),
    );

    const canRead = hasPermission(
        workspaceData?.workspace?.membership?.permissions ?? 0,
        WORKSPACE_PERMISSIONS.READ,
    );
    const canCreate = hasPermission(
        workspaceData?.workspace?.membership?.permissions ?? 0,
        WORKSPACE_PERMISSIONS.CREATE,
    );
    const canUpdate = hasPermission(
        workspaceData?.workspace?.membership?.permissions ?? 0,
        WORKSPACE_PERMISSIONS.UPDATE,
    );

    return (
        <SidebarGroup>
            <SidebarGroupContent>
                <SidebarMenu>
                    {canRead && (
                        <SidebarMenuItem key="dashboard">
                            <SidebarMenuButton tooltip={t("sidebar.dashboard")}>
                                <GaugeIcon className="size-4" />
                                <Link
                                    href={`/${lng}/${workspaceId}`}
                                    className="w-full"
                                >
                                    {t("sidebar.dashboard")}
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )}

                    {/* 使用者擁有讀取權限即可瀏覽被放到回收桶的 DICOM 影像，但不能進行 restore/delete 操作 */}
                    {canRead && (
                        <SidebarMenuItem key="dicom instances management">
                            <SidebarMenuButton
                                tooltip={t("sidebar.dicomInstances")}
                            >
                                <DatabaseIcon className="size-4" />
                                <Link
                                    href={`/${lng}/${workspaceId}/dicom-studies`}
                                    className="w-full"
                                >
                                    {t("sidebar.dicomInstances")}
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )}

                    {canRead && (
                        <SidebarMenuItem key="dicom recycle">
                            <SidebarMenuButton
                                tooltip={t("sidebar.dicomRecycle")}
                            >
                                <Trash2Icon className="size-4" />
                                <Link
                                    href={`/${lng}/${workspaceId}/dicom-recycle/studies`}
                                    className="w-full"
                                >
                                    {t("sidebar.dicomRecycle")}
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )}

                    {canCreate && (
                        <SidebarMenuItem key="dicom upload">
                            <SidebarMenuButton
                                tooltip={t("sidebar.uploadDicom")}
                            >
                                <UploadIcon className="size-4" />
                                <Link
                                    href={`/${lng}/${workspaceId}/dicom-upload`}
                                    className="w-full"
                                >
                                    {t("sidebar.uploadDicom")}
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )}

                    {canUpdate && (
                        <SidebarMenuItem key="my shares">
                            <SidebarMenuButton tooltip={t("sidebar.myShares")}>
                                <Share2Icon className="size-4" />
                                <Link
                                    href={`/${lng}/${workspaceId}/my-shares`}
                                    className="w-full"
                                >
                                    {t("sidebar.myShares")}
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )}

                    <SidebarSeparator />

                    <SidebarMenuItem key="share with me">
                        <SidebarMenuButton tooltip={t("sidebar.shareWithMe")}>
                            <UsersIcon className="size-4" />
                            <Link
                                href={`/${lng}/${workspaceId}/share-with-me`}
                                className="w-full"
                            >
                                {t("sidebar.shareWithMe")}
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
