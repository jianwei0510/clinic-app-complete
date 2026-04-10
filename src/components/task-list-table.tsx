"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { UserAvatar } from "@/components/user-avatar";
import type { TaskWithDetails } from "@/lib/types";

const statusConfig: Record<string, { label: string; className: string }> = {
	todo: { label: "To Do", className: "bg-gray-100 text-gray-700" },
	in_progress: {
		label: "In Progress",
		className: "bg-blue-100 text-blue-700",
	},
	in_review: {
		label: "In Review",
		className: "bg-amber-100 text-amber-700",
	},
	done: { label: "Done", className: "bg-green-100 text-green-700" },
};

const priorityConfig: Record<string, { label: string; className: string }> = {
	urgent: { label: "Urgent", className: "bg-red-100 text-red-700" },
	high: { label: "High", className: "bg-orange-100 text-orange-700" },
	medium: { label: "Medium", className: "bg-yellow-100 text-yellow-700" },
	low: { label: "Low", className: "bg-green-100 text-green-700" },
};

interface TaskListTableProps {
	projectId: number;
	onClickTask: (task: TaskWithDetails) => void;
	refreshKey?: number;
}

export function TaskListTable({
	projectId,
	onClickTask,
	refreshKey,
}: TaskListTableProps) {
	const [tasks, setTasks] = useState<TaskWithDetails[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchTasks = useCallback(async () => {
		const res = await fetch(`/api/tasks?projectId=${projectId}`);
		const data = await res.json();
		setTasks(data);
		setLoading(false);
	}, [projectId]);

	useEffect(() => {
		fetchTasks();
	}, [fetchTasks, refreshKey]);

	if (loading) {
		return (
			<div className="space-y-2">
				{Array.from({ length: 5 }).map((_, i) => (
					<div key={i} className="h-12 animate-pulse rounded bg-muted" />
				))}
			</div>
		);
	}

	if (tasks.length === 0) {
		return (
			<div className="py-12 text-center text-sm text-muted-foreground">
				No tasks yet. Create one to get started.
			</div>
		);
	}

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Title</TableHead>
					<TableHead>Status</TableHead>
					<TableHead>Priority</TableHead>
					<TableHead>Assignee</TableHead>
					<TableHead>Due Date</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{tasks.map((task) => {
					const status = statusConfig[task.status] || statusConfig.todo;
					const priority =
						priorityConfig[task.priority] || priorityConfig.medium;
					return (
						<TableRow
							key={task.id}
							className="cursor-pointer"
							onClick={() => onClickTask(task)}
						>
							<TableCell className="font-medium">{task.title}</TableCell>
							<TableCell>
								<Badge
									variant="secondary"
									className={status.className}
								>
									{status.label}
								</Badge>
							</TableCell>
							<TableCell>
								<Badge
									variant="secondary"
									className={priority.className}
								>
									{priority.label}
								</Badge>
							</TableCell>
							<TableCell>
								{task.assignee_name ? (
									<div className="flex items-center gap-2">
										<UserAvatar
											name={task.assignee_name}
											avatarUrl={task.assignee_avatar || undefined}
											className="size-6"
										/>
										<span className="text-sm">{task.assignee_name}</span>
									</div>
								) : (
									<span className="text-sm text-muted-foreground">
										Unassigned
									</span>
								)}
							</TableCell>
							<TableCell>
								{task.due_date
									? new Date(task.due_date).toLocaleDateString("en-US", {
											month: "short",
											day: "numeric",
											year: "numeric",
										})
									: "—"}
							</TableCell>
						</TableRow>
					);
				})}
			</TableBody>
		</Table>
	);
}
