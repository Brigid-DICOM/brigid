"use client";

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

    return (
        <SidebarGroup>
            <SidebarGroupContent>
                <SidebarMenu>
                    <SidebarMenuItem key="dashboard">
                        <SidebarMenuButton tooltip="Dashboard">
                            <GaugeIcon className="size-4" />
                            <Link href={`/${workspaceId}`} className="w-full">
                                Dashboard
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem key="dicom instances management">
                        <SidebarMenuButton tooltip="DICOM Instances Management">
                            <DatabaseIcon className="size-4" />
                            <Link href={`/${workspaceId}/dicom-studies`} className="w-full">
                                DICOM Instances
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem key="dicom recycle">
                        <SidebarMenuButton tooltip="DICOM Recycle">
                            <Trash2Icon className="size-4" />
                            <Link
                                href={`/${workspaceId}/dicom-recycle/studies`}
                                className="w-full"
                            >
                                DICOM Recycle
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem key="dicom upload">
                        <SidebarMenuButton tooltip={"Upload DICOM"}>
                            <UploadIcon className="size-4" />
                            <Link href={`/${workspaceId}/dicom-upload`} className="w-full">
                                Upload DICOM
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem key="my shares">
                        <SidebarMenuButton tooltip="My Shares">
                            <Share2Icon className="size-4" />
                            <Link href={`/${workspaceId}/my-shares`} className="w-full">
                                My Shares
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarSeparator />

                    <SidebarMenuItem key="share with me">
                        <SidebarMenuButton tooltip="Share With Me">
                            <UsersIcon className="size-4" />
                            <Link href={`/${workspaceId}/share-with-me`} className="w-full">
                                Share With Me
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
