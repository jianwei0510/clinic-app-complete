import Link from "next/link";
import {
	CheckCircle2,
	Clock,
	FolderKanban,
	ListTodo,
	Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/stat-card";
import { ActivityFeed } from "@/components/activity-feed";
import { UserAvatar } from "@/components/user-avatar";
import { getAllProjects } from "@/lib/queries/projects";
import {
	getActiveTasks,
	getCompletedThisWeek,
	getTasksDueSoon,
} from "@/lib/queries/tasks";
import { getAllUsers } from "@/lib/queries/users";
import { getRecentActivities } from "@/lib/queries/activities";
import { getProjectStats } from "@/lib/queries/projects";

const priorityColors: Record<string, string> = {
	urgent: "bg-red-100 text-red-700",
	high: "bg-orange-100 text-orange-700",
	medium: "bg-yellow-100 text-yellow-700",
	low: "bg-green-100 text-green-700",
};

export default function DashboardPage() {
	const projects = getAllProjects();
	const activeTasks = getActiveTasks();
	const completedThisWeek = getCompletedThisWeek();
	const teamMembers = getAllUsers();
	const dueSoon = getTasksDueSoon(1, 7);
	const recentActivity = getRecentActivities(10);
	const projectStats = getProjectStats();

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold tracking-tight">
					Welcome back, Alex
				</h1>
				<p className="text-muted-foreground">
					Here&apos;s what&apos;s happening with your projects today.
				</p>
			</div>

			{/* Stat cards */}
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<StatCard
					title="Total Projects"
					value={projects.length}
					icon={FolderKanban}
					description={`${projects.filter((p) => p.status === "active").length} active`}
				/>
				<StatCard
					title="Active Tasks"
					value={activeTasks}
					icon={ListTodo}
					description="Across all projects"
				/>
				<StatCard
					title="Completed This Week"
					value={completedThisWeek}
					icon={CheckCircle2}
					description="Tasks marked done"
				/>
				<StatCard
					title="Team Members"
					value={teamMembers.length}
					icon={Users}
					description="Across all departments"
				/>
			</div>

			{/* Two-column layout */}
			<div className="grid gap-6 lg:grid-cols-5">
				{/* My tasks due soon */}
				<Card className="lg:col-span-3">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-base">
							<Clock className="size-4" />
							My Tasks Due Soon
						</CardTitle>
					</CardHeader>
					<CardContent>
						{dueSoon.length === 0 ? (
							<p className="py-4 text-center text-sm text-muted-foreground">
								No upcoming deadlines. You&apos;re all caught up!
							</p>
						) : (
							<div className="space-y-3">
								{dueSoon.map((task) => (
									<Link
										key={task.id}
										href={`/projects/${task.project_id}`}
										className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
									>
										<div
											className="size-2 shrink-0 rounded-full"
											style={{
												backgroundColor: task.project_color || "#6366f1",
											}}
										/>
										<div className="flex-1 truncate">
											<p className="truncate text-sm font-medium">
												{task.title}
											</p>
											<p className="text-xs text-muted-foreground">
												{task.project_name}
											</p>
										</div>
										<Badge
											variant="secondary"
											className={priorityColors[task.priority]}
										>
											{task.priority}
										</Badge>
										<span className="shrink-0 text-xs text-muted-foreground">
											{task.due_date
												? new Date(task.due_date).toLocaleDateString(
														"en-US",
														{ month: "short", day: "numeric" },
													)
												: "No date"}
										</span>
									</Link>
								))}
							</div>
						)}
					</CardContent>
				</Card>

				{/* Recent activity */}
				<Card className="lg:col-span-2">
					<CardHeader>
						<CardTitle className="text-base">Recent Activity</CardTitle>
					</CardHeader>
					<CardContent>
						<ActivityFeed activities={recentActivity} />
					</CardContent>
				</Card>
			</div>

			{/* Project progress */}
			<Card>
				<CardHeader>
					<CardTitle className="text-base">Project Progress</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{projectStats.map((project) => {
							const progress =
								project.task_count > 0
									? Math.round(
											(project.completed_count / project.task_count) * 100,
										)
									: 0;
							return (
								<Link
									key={project.id}
									href={`/projects/${project.id}`}
									className="group flex items-center gap-4 rounded-lg p-2 transition-colors hover:bg-muted/50"
								>
									<div
										className="size-3 shrink-0 rounded-full"
										style={{ backgroundColor: project.color }}
									/>
									<span className="w-40 shrink-0 truncate text-sm font-medium">
										{project.name}
									</span>
									<div className="flex-1">
										<Progress value={progress} className="h-2" />
									</div>
									<span className="w-16 shrink-0 text-right text-sm text-muted-foreground">
										{progress}%
									</span>
									<span className="w-20 shrink-0 text-right text-xs text-muted-foreground">
										{project.completed_count}/{project.task_count} tasks
									</span>
								</Link>
							);
						})}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
