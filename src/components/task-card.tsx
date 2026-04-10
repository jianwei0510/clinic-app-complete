"use client";

import {
	ArrowLeft,
	ArrowRight,
	MessageSquare,
	MoreHorizontal,
	Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/user-avatar";
import type { TaskWithDetails } from "@/lib/types";

const priorityConfig: Record<
	string,
	{ label: string; className: string }
> = {
	urgent: { label: "Urgent", className: "bg-red-100 text-red-700 hover:bg-red-100" },
	high: { label: "High", className: "bg-orange-100 text-orange-700 hover:bg-orange-100" },
	medium: { label: "Medium", className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100" },
	low: { label: "Low", className: "bg-green-100 text-green-700 hover:bg-green-100" },
};

const STATUS_ORDER = ["todo", "in_progress", "in_review", "done"] as const;

interface TaskCardProps {
	task: TaskWithDetails;
	onStatusChange: (taskId: number, newStatus: string) => void;
	onDelete: (taskId: number) => void;
	onClick: (task: TaskWithDetails) => void;
}

export function TaskCard({
	task,
	onStatusChange,
	onDelete,
	onClick,
}: TaskCardProps) {
	const priority = priorityConfig[task.priority] || priorityConfig.medium;
	const currentIndex = STATUS_ORDER.indexOf(
		task.status as (typeof STATUS_ORDER)[number],
	);
	const canMoveLeft = currentIndex > 0;
	const canMoveRight = currentIndex < STATUS_ORDER.length - 1;

	return (
		<div
			className="group cursor-pointer rounded-lg border bg-card p-3 shadow-sm transition-shadow hover:shadow-md"
			onClick={() => onClick(task)}
			onKeyDown={(e) => e.key === "Enter" && onClick(task)}
		>
			<div className="mb-2 flex items-start justify-between gap-2">
				<h4 className="text-sm font-medium leading-tight">{task.title}</h4>
				<DropdownMenu>
					<DropdownMenuTrigger
						render={
							<Button
								variant="ghost"
								size="icon"
								className="size-6 shrink-0 opacity-0 group-hover:opacity-100"
								onClick={(e) => e.stopPropagation()}
							>
								<MoreHorizontal className="size-3.5" />
							</Button>
						}
					/>
					<DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
						{canMoveLeft && (
							<DropdownMenuItem
								onClick={() =>
									onStatusChange(task.id, STATUS_ORDER[currentIndex - 1])
								}
							>
								<ArrowLeft className="mr-2 size-4" />
								Move Left
							</DropdownMenuItem>
						)}
						{canMoveRight && (
							<DropdownMenuItem
								onClick={() =>
									onStatusChange(task.id, STATUS_ORDER[currentIndex + 1])
								}
							>
								<ArrowRight className="mr-2 size-4" />
								Move Right
							</DropdownMenuItem>
						)}
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={() => onDelete(task.id)}
							className="text-destructive"
						>
							<Trash2 className="mr-2 size-4" />
							Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<div className="flex items-center gap-2">
				<Badge variant="secondary" className={`text-[10px] ${priority.className}`}>
					{priority.label}
				</Badge>
				{task.due_date && (
					<span className="text-[10px] text-muted-foreground">
						{new Date(task.due_date).toLocaleDateString("en-US", {
							month: "short",
							day: "numeric",
						})}
					</span>
				)}
			</div>

			<div className="mt-2.5 flex items-center justify-between">
				<div className="flex items-center gap-1.5">
					{task.assignee_name && (
						<UserAvatar
							name={task.assignee_name}
							avatarUrl={task.assignee_avatar || undefined}
							className="size-5"
						/>
					)}
				</div>
				{task.comment_count > 0 && (
					<span className="flex items-center gap-1 text-xs text-muted-foreground">
						<MessageSquare className="size-3" />
						{task.comment_count}
					</span>
				)}
			</div>
		</div>
	);
}
