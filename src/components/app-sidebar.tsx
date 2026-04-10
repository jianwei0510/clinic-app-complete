"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	BarChart3,
	CalendarDays,
	FolderKanban,
	Layers,
	LayoutDashboard,
	Settings,
	Users,
} from "lucide-react";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "@/components/ui/sidebar";
import { UserAvatar } from "@/components/user-avatar";

const navItems = [
	{ title: "Dashboard", href: "/", icon: LayoutDashboard },
	{ title: "Projects", href: "/projects", icon: FolderKanban },
	{ title: "Team", href: "/team", icon: Users },
	{ title: "Calendar", href: "/calendar", icon: CalendarDays },
	{ title: "Reports", href: "/reports", icon: BarChart3 },
	{ title: "Settings", href: "/settings", icon: Settings },
];

export function AppSidebar() {
	const pathname = usePathname();

	return (
		<Sidebar collapsible="icon">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" render={<Link href="/" />}>
							<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
								<Layers className="size-4" />
							</div>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-semibold">FlowBoard</span>
								<span className="truncate text-xs text-muted-foreground">
									Project Management
								</span>
							</div>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Navigation</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{navItems.map((item) => {
								const isActive =
									item.href === "/"
										? pathname === "/"
										: pathname.startsWith(item.href);
								return (
									<SidebarMenuItem key={item.href}>
										<SidebarMenuButton
											isActive={isActive}
											render={<Link href={item.href} />}
										>
											<item.icon className="size-4" />
											<span>{item.title}</span>
										</SidebarMenuButton>
									</SidebarMenuItem>
								);
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg">
							<UserAvatar name="Alex Chen" className="size-8" />
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-semibold">Alex Chen</span>
								<span className="truncate text-xs text-muted-foreground">
									Product Manager
								</span>
							</div>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
