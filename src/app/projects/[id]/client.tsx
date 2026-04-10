"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
	Calendar,
	CheckCircle2,
	ListTodo,
	Settings as SettingsIcon,
	Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActivityFeed } from "@/components/activity-feed";
import { KanbanBoard } from "@/components/kanban-board";
import { TaskDetailSheet } from "@/components/task-detail-sheet";
import { TaskFormDialog } from "@/components/task-form-dialog";
import { TaskListTable } from "@/components/task-list-table";
import { UserAvatar } from "@/components/user-avatar";
import type { ActivityWithUser, ProjectWithStats, TaskWithDetails } from "@/lib/types";
import type { ProjectMemberWithUser } from "@/lib/queries/projects";

interface ProjectDetailClientProps {
	project: ProjectWithStats;
	members: ProjectMemberWithUser[];
	activities: ActivityWithUser[];
}

export function ProjectDetailClient({
	project,
	members,
	activities,
}: ProjectDetailClientProps) {
	const router = useRouter();
	const [selectedTask, setSelectedTask] = useState<TaskWithDetails | null>(null);
	const [sheetOpen, setSheetOpen] = useState(false);
	const [taskFormOpen, setTaskFormOpen] = useState(false);
	const [taskFormStatus, setTaskFormStatus] = useState("todo");
	const [refreshKey, setRefreshKey] = useState(0);

	const progress =
		project.task_count > 0
			? Math.round((project.completed_count / project.task_count) * 100)
			: 0;

	function handleClickTask(task: TaskWithDetails) {
		setSelectedTask(task);
		setSheetOpen(true);
	}

	function handleAddTask(status: string) {
		setTaskFormStatus(status);
		setTaskFormOpen(true);
	}

	function handleRefresh() {
		setRefreshKey((k) => k + 1);
		router.refresh();
	}

	return (
		<div className="space-y-6">
			{/* Project header */}
			<div className="flex items-start justify-between">
				<div className="flex items-center gap-3">
					<div
						className="size-4 rounded-full"
						style={{ backgroundColor: project.color }}
					/>
					<div>
						<h1 className="text-2xl font-bold tracking-tight">
							{project.name}
						</h1>
						{project.description && (
							<p className="mt-1 max-w-2xl text-muted-foreground">
								{project.description}
							</p>
						)}
					</div>
				</div>
				<div className="flex items-center gap-4 text-sm text-muted-foreground">
					<span className="flex items-center gap-1">
						<ListTodo className="size-4" />
						{project.task_count} tasks
					</span>
					<span className="flex items-center gap-1">
						<CheckCircle2 className="size-4" />
						{progress}% complete
					</span>
					{project.due_date && (
						<span className="flex items-center gap-1">
							<Calendar className="size-4" />
							Due{" "}
							{new Date(project.due_date).toLocaleDateString("en-US", {
								month: "short",
								day: "numeric",
							})}
						</span>
					)}
				</div>
			</div>

			{/* Tabs */}
			<Tabs defaultValue="board">
				<TabsList>
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="board">Board</TabsTrigger>
					<TabsTrigger value="list">List</TabsTrigger>
					<TabsTrigger value="settings">Settings</TabsTrigger>
				</TabsList>

				{/* Overview Tab */}
				<TabsContent value="overview" className="mt-6 space-y-6">
					<div className="grid gap-6 lg:grid-cols-3">
						{/* Progress card */}
						<Card>
							<CardHeader>
								<CardTitle className="text-base">Progress</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<div className="flex items-center justify-between text-sm">
									<span className="text-muted-foreground">Completion</span>
									<span className="font-medium">{progress}%</span>
								</div>
								<Progress value={progress} className="h-2" />
								<div className="grid grid-cols-2 gap-2 text-sm">
									<div className="rounded-lg bg-muted/50 p-2 text-center">
										<div className="font-semibold">{project.completed_count}</div>
										<div className="text-xs text-muted-foreground">Done</div>
									</div>
									<div className="rounded-lg bg-muted/50 p-2 text-center">
										<div className="font-semibold">
											{project.task_count - project.completed_count}
										</div>
										<div className="text-xs text-muted-foreground">
											Remaining
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Members card */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-base">
									<Users className="size-4" />
									Members ({members.length})
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									{members.map((m) => (
										<Link
											key={m.id}
											href={`/team/${m.id}`}
											className="flex items-center gap-2.5 rounded-lg p-1 transition-colors hover:bg-muted/50"
										>
											<UserAvatar
												name={m.name}
												avatarUrl={m.avatar_url || undefined}
												className="size-7"
											/>
											<div className="flex-1">
												<p className="text-sm font-medium">{m.name}</p>
												<p className="text-xs text-muted-foreground">
													{m.role}
												</p>
											</div>
											{m.project_role === "owner" && (
												<Badge variant="secondary" className="text-xs">
													Owner
												</Badge>
											)}
										</Link>
									))}
								</div>
							</CardContent>
						</Card>

						{/* Activity card */}
						<Card>
							<CardHeader>
								<CardTitle className="text-base">Recent Activity</CardTitle>
							</CardHeader>
							<CardContent>
								<ActivityFeed activities={activities} />
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				{/* Board Tab */}
				<TabsContent value="board" className="mt-6">
					<KanbanBoard
						projectId={project.id}
						onClickTask={handleClickTask}
						onAddTask={handleAddTask}
						refreshKey={refreshKey}
					/>
				</TabsContent>

				{/* List Tab */}
				<TabsContent value="list" className="mt-6">
					<Card>
						<CardContent className="p-0">
							<TaskListTable
								projectId={project.id}
								onClickTask={handleClickTask}
								refreshKey={refreshKey}
							/>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Settings Tab */}
				<TabsContent value="settings" className="mt-6">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-base">
								<SettingsIcon className="size-4" />
								Project Settings
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<p className="text-sm font-medium">Name</p>
								<p className="text-sm text-muted-foreground">
									{project.name}
								</p>
							</div>
							<div>
								<p className="text-sm font-medium">Description</p>
								<p className="text-sm text-muted-foreground">
									{project.description || "No description"}
								</p>
							</div>
							<div>
								<p className="text-sm font-medium">Status</p>
								<Badge variant="secondary" className="mt-1">
									{project.status}
								</Badge>
							</div>
							<div>
								<p className="text-sm font-medium">Color</p>
								<div className="mt-1 flex items-center gap-2">
									<div
										className="size-5 rounded-full"
										style={{ backgroundColor: project.color }}
									/>
									<span className="text-sm text-muted-foreground">
										{project.color}
									</span>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>

			{/* Task detail sheet */}
			<TaskDetailSheet
				task={selectedTask}
				open={sheetOpen}
				onOpenChange={setSheetOpen}
				onUpdate={handleRefresh}
			/>

			{/* Task create dialog */}
			<TaskFormDialog
				open={taskFormOpen}
				onOpenChange={setTaskFormOpen}
				projectId={project.id}
				defaultStatus={taskFormStatus}
				onSuccess={handleRefresh}
			/>
		</div>
	);
}
