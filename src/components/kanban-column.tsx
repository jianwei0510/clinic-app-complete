"use client";

import type { LucideIcon } from "lucide-react";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TaskCard } from "@/components/task-card";
import type { TaskWithDetails } from "@/lib/types";

interface KanbanColumnProps {
	title: string;
	icon: LucideIcon;
	status: string;
	tasks: TaskWithDetails[];
	colorClass: string;
	onStatusChange: (taskId: number, newStatus: string) => void;
	onDeleteTask: (taskId: number) => void;
	onClickTask: (task: TaskWithDetails) => void;
	onAddTask: (status: string) => void;
}

export function KanbanColumn({
	title,
	icon: Icon,
	status,
	tasks,
	colorClass,
	onStatusChange,
	onDeleteTask,
	onClickTask,
	onAddTask,
}: KanbanColumnProps) {
	return (
		<div className="flex h-full flex-col rounded-lg bg-muted/50 p-3">
			<div className="mb-3 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Icon className={`size-4 ${colorClass}`} />
					<h3 className="text-sm font-semibold">{title}</h3>
					<Badge variant="secondary" className="text-xs">
						{tasks.length}
					</Badge>
				</div>
				<Button
					variant="ghost"
					size="icon"
					className="size-6"
					onClick={() => onAddTask(status)}
				>
					<Plus className="size-3.5" />
				</Button>
			</div>
			<ScrollArea className="flex-1">
				<div className="space-y-2 pr-2">
					{tasks.map((task) => (
						<TaskCard
							key={task.id}
							task={task}
							onStatusChange={onStatusChange}
							onDelete={onDeleteTask}
							onClick={onClickTask}
						/>
					))}
					{tasks.length === 0 && (
						<div className="flex h-20 items-center justify-center rounded-lg border border-dashed text-xs text-muted-foreground">
							No tasks
						</div>
					)}
				</div>
			</ScrollArea>
		</div>
	);
}
