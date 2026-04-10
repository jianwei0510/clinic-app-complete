import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import "./globals.css";

const inter = Inter({
	variable: "--font-sans",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "FlowBoard - Project Management",
	description: "Modern project management for high-performing teams",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={`${inter.variable} h-full`}>
			<body className="min-h-full antialiased">
				<TooltipProvider>
					<SidebarProvider>
						<AppSidebar />
						<SidebarInset>
							<AppHeader />
							<main className="flex-1 overflow-auto p-6">{children}</main>
						</SidebarInset>
					</SidebarProvider>
				</TooltipProvider>
			</body>
		</html>
	);
}
