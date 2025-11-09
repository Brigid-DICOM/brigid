"use client";

import { DatabaseIcon, GaugeIcon, UploadIcon } from "lucide-react";
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