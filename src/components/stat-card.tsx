import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
	title: string;
	value: string | number;
	icon: LucideIcon;
	description?: string;
	className?: string;
}

export function StatCard({
	title,
	value,
	icon: Icon,
	description,
	className,
}: StatCardProps) {
	return (
		<Card className={cn("gap-2", className)}>
			<CardContent>
				<div className="flex items-center justify-between">
					<div className="space-y-1">
						<p className="text-sm font-medium text-muted-foreground">
							{title}
						</p>
						<p className="text-2xl font-bold">{value}</p>
						{description && (
							<p className="text-xs text-muted-foreground">{description}</p>
						)}
					</div>
					<div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
						<Icon className="size-5 text-primary" />
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
