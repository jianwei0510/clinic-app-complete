"use client";

import { usePathname } from "next/navigation";
import { Bell, Search } from "lucide-react";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

const routeLabels: Record<string, string> = {
	"": "Dashboard",
	projects: "Projects",
	team: "Team",
	calendar: "Calendar",
	reports: "Reports",
	settings: "Settings",
};

export function AppHeader() {
	const pathname = usePathname();
	const segments = pathname.split("/").filter(Boolean);

	return (
		<header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
			<SidebarTrigger className="-ml-1" />
			<Separator orientation="vertical" className="mr-2 !h-4" />
			<Breadcrumb className="flex-1">
				<BreadcrumbList>
					<BreadcrumbItem>
						{segments.length === 0 ? (
							<BreadcrumbPage>Dashboard</BreadcrumbPage>
						) : (
							<BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
						)}
					</BreadcrumbItem>
					{segments.map((segment, index) => {
						const href = `/${segments.slice(0, index + 1).join("/")}`;
						const isLast = index === segments.length - 1;
						const label =
							routeLabels[segment] || decodeURIComponent(segment);

						return (
							<BreadcrumbItem key={href}>
								<BreadcrumbSeparator />
								{isLast ? (
									<BreadcrumbPage>{label}</BreadcrumbPage>
								) : (
									<BreadcrumbLink href={href}>{label}</BreadcrumbLink>
								)}
							</BreadcrumbItem>
						);
					})}
				</BreadcrumbList>
			</Breadcrumb>
			<div className="flex items-center gap-2">
				<div className="relative hidden md:block">
					<Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						placeholder="Search..."
						className="w-60 pl-9"
						readOnly
					/>
				</div>
				<Button variant="ghost" size="icon" className="relative">
					<Bell className="size-4" />
					<span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-destructive" />
				</Button>
			</div>
		</header>
	);
}
