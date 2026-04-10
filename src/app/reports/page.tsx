"use client";

import { useEffect, useState } from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Legend,
	Line,
	LineChart,
	Pie,
	PieChart,
	XAxis,
	YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

const STATUS_COLORS: Record<string, string> = {
	todo: "#9ca3af",
	in_progress: "#3b82f6",
	in_review: "#f59e0b",
	done: "#10b981",
};

const PRIORITY_COLORS: Record<string, string> = {
	low: "#10b981",
	medium: "#f59e0b",
	high: "#f97316",
	urgent: "#ef4444",
};

const statusChartConfig: ChartConfig = {
	todo: { label: "To Do", color: STATUS_COLORS.todo },
	in_progress: { label: "In Progress", color: STATUS_COLORS.in_progress },
	in_review: { label: "In Review", color: STATUS_COLORS.in_review },
	done: { label: "Done", color: STATUS_COLORS.done },
};

const priorityChartConfig: ChartConfig = {
	low: { label: "Low", color: PRIORITY_COLORS.low },
	medium: { label: "Medium", color: PRIORITY_COLORS.medium },
	high: { label: "High", color: PRIORITY_COLORS.high },
	urgent: { label: "Urgent", color: PRIORITY_COLORS.urgent },
};

interface Stats {
	byStatus: Array<{ status: string; count: number }>;
	byPriority: Array<{ priority: string; count: number }>;
	byMember: Array<{ name: string; count: number }>;
	byProject: Array<{ name: string; total: number; completed: number; color: string }>;
}

export default function ReportsPage() {
	const [stats, setStats] = useState<Stats | null>(null);

	useEffect(() => {
		async function load() {
			const [tasks, users, projects] = await Promise.all([
				fetch("/api/tasks").then((r) => r.json()),
				fetch("/api/users").then((r) => r.json()),
				fetch("/api/projects").then((r) => r.json()),
			]);

			// Group by status
			const statusMap: Record<string, number> = {};
			for (const t of tasks) {
				statusMap[t.status] = (statusMap[t.status] || 0) + 1;
			}
			const byStatus = Object.entries(statusMap).map(([status, count]) => ({
				status,
				count,
			}));

			// Group by priority
			const priorityMap: Record<string, number> = {};
			for (const t of tasks) {
				priorityMap[t.priority] = (priorityMap[t.priority] || 0) + 1;
			}
			const byPriority = Object.entries(priorityMap).map(
				([priority, count]) => ({ priority, count }),
			);

			// Group by member
			const memberMap: Record<string, number> = {};
			for (const t of tasks) {
				const name = t.assignee_name || "Unassigned";
				memberMap[name] = (memberMap[name] || 0) + 1;
			}
			const byMember = Object.entries(memberMap)
				.map(([name, count]) => ({ name, count }))
				.sort((a, b) => b.count - a.count);

			// Project overview
			const byProject = projects.map(
				(p: { name: string; task_count: number; completed_count: number; color: string }) => ({
					name: p.name,
					total: p.task_count,
					completed: p.completed_count,
					color: p.color,
				}),
			);

			setStats({ byStatus, byPriority, byMember, byProject });
		}
		load();
	}, []);

	if (!stats) {
		return (
			<div className="space-y-6">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Reports</h1>
					<p className="text-muted-foreground">Loading analytics...</p>
				</div>
				<div className="grid gap-6 lg:grid-cols-2">
					{Array.from({ length: 4 }).map((_, i) => (
						<div key={i} className="h-80 animate-pulse rounded-lg bg-muted" />
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold tracking-tight">Reports</h1>
				<p className="text-muted-foreground">
					Analytics and insights across all projects.
				</p>
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				{/* Tasks by Status - Donut Chart */}
				<Card>
					<CardHeader>
						<CardTitle className="text-base">Tasks by Status</CardTitle>
					</CardHeader>
					<CardContent>
						<ChartContainer config={statusChartConfig} className="mx-auto h-64">
							<PieChart>
								<ChartTooltip content={<ChartTooltipContent />} />
								<Pie
									data={stats.byStatus}
									dataKey="count"
									nameKey="status"
									innerRadius={60}
									outerRadius={100}
									paddingAngle={2}
								>
									{stats.byStatus.map((entry) => (
										<Cell
											key={entry.status}
											fill={STATUS_COLORS[entry.status] || "#6366f1"}
										/>
									))}
								</Pie>
								<Legend
									formatter={(value: string) =>
										statusChartConfig[value]?.label || value
									}
								/>
							</PieChart>
						</ChartContainer>
					</CardContent>
				</Card>

				{/* Tasks by Priority - Bar Chart */}
				<Card>
					<CardHeader>
						<CardTitle className="text-base">Tasks by Priority</CardTitle>
					</CardHeader>
					<CardContent>
						<ChartContainer config={priorityChartConfig} className="h-64">
							<BarChart data={stats.byPriority}>
								<CartesianGrid strokeDasharray="3 3" vertical={false} />
								<XAxis
									dataKey="priority"
									tickFormatter={(v: string) =>
										priorityChartConfig[v]?.label?.toString() || v
									}
								/>
								<YAxis />
								<ChartTooltip content={<ChartTooltipContent />} />
								<Bar dataKey="count" radius={[4, 4, 0, 0]}>
									{stats.byPriority.map((entry) => (
										<Cell
											key={entry.priority}
											fill={PRIORITY_COLORS[entry.priority] || "#6366f1"}
										/>
									))}
								</Bar>
							</BarChart>
						</ChartContainer>
					</CardContent>
				</Card>

				{/* Team Workload - Horizontal Bar Chart */}
				<Card>
					<CardHeader>
						<CardTitle className="text-base">Team Workload</CardTitle>
					</CardHeader>
					<CardContent>
						<ChartContainer
							config={{
								count: { label: "Tasks", color: "#6366f1" },
							}}
							className="h-64"
						>
							<BarChart data={stats.byMember} layout="vertical">
								<CartesianGrid strokeDasharray="3 3" horizontal={false} />
								<XAxis type="number" />
								<YAxis
									dataKey="name"
									type="category"
									width={120}
									tick={{ fontSize: 12 }}
								/>
								<ChartTooltip content={<ChartTooltipContent />} />
								<Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
							</BarChart>
						</ChartContainer>
					</CardContent>
				</Card>

				{/* Project Overview - Grouped Bar Chart */}
				<Card>
					<CardHeader>
						<CardTitle className="text-base">Project Overview</CardTitle>
					</CardHeader>
					<CardContent>
						<ChartContainer
							config={{
								total: { label: "Total Tasks", color: "#e2e8f0" },
								completed: { label: "Completed", color: "#10b981" },
							}}
							className="h-64"
						>
							<BarChart data={stats.byProject}>
								<CartesianGrid strokeDasharray="3 3" vertical={false} />
								<XAxis dataKey="name" tick={{ fontSize: 11 }} />
								<YAxis />
								<ChartTooltip content={<ChartTooltipContent />} />
								<Bar dataKey="total" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
								<Bar
									dataKey="completed"
									fill="#10b981"
									radius={[4, 4, 0, 0]}
								/>
								<Legend />
							</BarChart>
						</ChartContainer>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
