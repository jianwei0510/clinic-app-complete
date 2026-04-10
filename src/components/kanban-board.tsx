"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Circle, Eye, Timer } from "lucide-react";
import { KanbanColumn } from "@/components/kanban-column";
import type { TaskWithDetails } from "@/lib/types";

const COLUMNS = [
	{
		status: "todo",
		title: "To Do",
		icon: Circle,
		colorClass: "text-gray-500",
	},
	{
		status: "in_progress",
		title: "In Progress",
		icon: Timer,
		colorClass: "text-blue-500",
	},
	{
		status: "in_review",
		title: "In Review",
		icon: Eye,
		colorClass: "text-amber-500",
	},
	{
		status: "done",
		title: "Done",
		icon: CheckCircle2,
		colorClass: "text-green-500",
	},
];

interface KanbanBoardProps {
	projectId: number;
	onClickTask: (task: TaskWithDetails) => void;
	onAddTask: (status: string) => void;
	refreshKey?: number;
}

export function KanbanBoard({
	projectId,
	onClickTask,
	onAddTask,
	refreshKey,
}: KanbanBoardProps) {
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

	async function handleStatusChange(taskId: number, newStatus: string) {
		// Optimistic update
		setTasks((prev) =>
			prev.map((t) => (t.id === taskId ? { ...t, status: newStatus as TaskWithDetails["status"] } : t)),
		);

		await fetch(`/api/tasks/${taskId}/status`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ status: newStatus }),
		});
	}

	async function handleDeleteTask(taskId: number) {
		setTasks((prev) => prev.filter((t) => t.id !== taskId));
		await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
	}

	if (loading) {
		return (
			<div className="grid h-96 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{COLUMNS.map((col) => (
					<div
						key={col.status}
						className="animate-pulse rounded-lg bg-muted/50 p-3"
					>
						<div className="mb-3 h-5 w-24 rounded bg-muted" />
						<div className="space-y-2">
							<div className="h-24 rounded bg-muted" />
							<div className="h-24 rounded bg-muted" />
						</div>
					</div>
				))}
			</div>
		);
	}

	return (
		<div className="grid h-[calc(100vh-280px)] min-h-96 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{COLUMNS.map((col) => (
				<KanbanColumn
					key={col.status}
					{...col}
					tasks={tasks.filter((t) => t.status === col.status)}
					onStatusChange={handleStatusChange}
					onDeleteTask={handleDeleteTask}
					onClickTask={onClickTask}
					onAddTask={onAddTask}
				/>
			))}
		</div>
	);
}
