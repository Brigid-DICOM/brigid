"use client";

import { DatabaseIcon, GaugeIcon, Trash2Icon, UploadIcon } from "lucide-react";
import Link from "next/link";
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";

export function NavMain() {
    return (
        <SidebarGroup>
            <SidebarGroupContent>
                <SidebarMenu>
                    <SidebarMenuItem
                        key="dashboard"
                    >
                        <SidebarMenuButton tooltip="Dashboard">
                            <GaugeIcon className="size-4" />
                            <Link href="/">Dashboard</Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem
                        key="dicom instances management"
                    >
                        <SidebarMenuButton tooltip="DICOM Instances Management">
                            <DatabaseIcon className="size-4" />
                            <Link href="/dicom-studies">DICOM Instances</Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem
                        key="dicom recycle"
                    >
                        <SidebarMenuButton tooltip="DICOM Recycle">
                            <Trash2Icon className="size-4" />
                            <Link href="/dicom-recycle/studies">DICOM Recycle</Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem key="dicom upload">
                        <SidebarMenuButton tooltip={"Upload DICOM"}>
                            <UploadIcon className="size-4" />
                            <Link href="/dicom-upload">Upload DICOM</Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}