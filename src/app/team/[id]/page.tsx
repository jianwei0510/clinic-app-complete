import Link from "next/link";
import { notFound } from "next/navigation";
import { Briefcase, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { ActivityFeed } from "@/components/activity-feed";
import { UserAvatar } from "@/components/user-avatar";
import { getUserById, getUserTaskStats } from "@/lib/queries/users";
import { getTasksByUser } from "@/lib/queries/tasks";
import { getActivitiesByUser } from "@/lib/queries/activities";

const statusConfig: Record<string, { label: string; className: string }> = {
	todo: { label: "To Do", className: "bg-gray-100 text-gray-700" },
	in_progress: { label: "In Progress", className: "bg-blue-100 text-blue-700" },
	in_review: { label: "In Review", className: "bg-amber-100 text-amber-700" },
	done: { label: "Done", className: "bg-green-100 text-green-700" },
};

const priorityConfig: Record<string, { label: string; className: string }> = {
	urgent: { label: "Urgent", className: "bg-red-100 text-red-700" },
	high: { label: "High", className: "bg-orange-100 text-orange-700" },
	medium: { label: "Medium", className: "bg-yellow-100 text-yellow-700" },
	low: { label: "Low", className: "bg-green-100 text-green-700" },
};

export default async function TeamMemberPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const user = getUserById(Number.parseInt(id));
	if (!user) notFound();

	const tasks = getTasksByUser(user.id);
	const stats = getUserTaskStats(user.id);
	const activities = getActivitiesByUser(user.id, 15);

	return (
		<div className="space-y-6">
			{/* Profile header */}
			<div className="flex items-center gap-4">
				<UserAvatar
					name={user.name}
					avatarUrl={user.avatar_url || undefined}
					className="size-16"
				/>
				<div>
					<h1 className="text-2xl font-bold tracking-tight">{user.name}</h1>
					<p className="text-muted-foreground">{user.role}</p>
					<div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
						<span className="flex items-center gap-1">
							<Briefcase className="size-3.5" />
							{user.department}
						</span>
						<span className="flex items-center gap-1">
							<Mail className="size-3.5" />
							{user.email}
						</span>
					</div>
				</div>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-3 gap-4">
				<Card>
					<CardContent className="pt-4 text-center">
						<div className="text-2xl font-bold">{stats.total}</div>
						<div className="text-sm text-muted-foreground">Total Tasks</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-4 text-center">
						<div className="text-2xl font-bold">{stats.active}</div>
						<div className="text-sm text-muted-foreground">Active</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-4 text-center">
						<div className="text-2xl font-bold">{stats.completed}</div>
						<div className="text-sm text-muted-foreground">Completed</div>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-6 lg:grid-cols-5">
				{/* Tasks */}
				<Card className="lg:col-span-3">
					<CardHeader>
						<CardTitle className="text-base">Assigned Tasks</CardTitle>
					</CardHeader>
					<CardContent className="p-0">
						{tasks.length === 0 ? (
							<p className="p-6 text-center text-sm text-muted-foreground">
								No tasks assigned
							</p>
						) : (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Task</TableHead>
										<TableHead>Project</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Priority</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{tasks.map((task) => {
										const status =
											statusConfig[task.status] || statusConfig.todo;
										const priority =
											priorityConfig[task.priority] || priorityConfig.medium;
										return (
											<TableRow key={task.id}>
												<TableCell className="font-medium">
													<Link
														href={`/projects/${task.project_id}`}
														className="hover:underline"
													>
														{task.title}
													</Link>
												</TableCell>
												<TableCell>
													<div className="flex items-center gap-1.5">
														<div
															className="size-2 rounded-full"
															style={{
																backgroundColor:
																	task.project_color || "#6366f1",
															}}
														/>
														<span className="text-sm">
															{task.project_name}
														</span>
													</div>
												</TableCell>
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
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						)}
					</CardContent>
				</Card>

				{/* Activity */}
				<Card className="lg:col-span-2">
					<CardHeader>
						<CardTitle className="text-base">Recent Activity</CardTitle>
					</CardHeader>
					<CardContent>
						<ActivityFeed activities={activities} />
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
