"use client";

import { DatabaseIcon, GaugeIcon } from "lucide-react";
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
                            <Link href="/dicom-instances">DICOM Instances</Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}