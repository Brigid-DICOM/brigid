import { cookies } from "next/headers";
import Image from "next/image";
import type { ComponentProps } from "react";
import { getQueryClient } from "@/react-query/get-query-client";
import { authSessionQuery } from "@/react-query/queries/session";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { NavWorkspace } from "./nav-workspace";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "./ui/sidebar";

export async function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
    const cookieStore = await cookies();
    const queryClient = getQueryClient();
    const session = await queryClient.fetchQuery(
        authSessionQuery(cookieStore.toString()),
    );

    const user = session?.user;

    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem className="mb-2">
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:!p-1.5"
                        >
                            <a href="/">
                                <Image
                                    src="/logo.png"
                                    alt="Brigid Logo"
                                    width={32}
                                    height={32}
                                />
                                <span className="text-base font-semibold">
                                    Brigid
                                </span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    <NavWorkspace />
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain />
            </SidebarContent>
            <SidebarFooter>
                {user && (
                    <NavUser
                        user={{
                            name: user.name ?? "",
                            email: user.email ?? "",
                            image: user.image ?? "",
                        }}
                    />
                )}
            </SidebarFooter>
        </Sidebar>
    );
}
