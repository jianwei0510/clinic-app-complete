import Link from "next/link";
import { Calendar, CheckCircle2, ListTodo } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { ProjectWithStats } from "@/lib/types";

interface ProjectCardProps {
	project: ProjectWithStats;
}

export function ProjectCard({ project }: ProjectCardProps) {
	const progress =
		project.task_count > 0
			? Math.round((project.completed_count / project.task_count) * 100)
			: 0;

	return (
		<Link href={`/projects/${project.id}`}>
			<Card className="gap-3 transition-shadow hover:shadow-md">
				<CardHeader className="pb-2">
					<div className="flex items-start gap-3">
						<div
							className="mt-0.5 size-3 shrink-0 rounded-full"
							style={{ backgroundColor: project.color }}
						/>
						<div className="flex-1">
							<h3 className="font-semibold leading-tight">{project.name}</h3>
							{project.description && (
								<p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
									{project.description}
								</p>
							)}
						</div>
					</div>
				</CardHeader>
				<CardContent className="space-y-3">
					<div className="space-y-1.5">
						<div className="flex items-center justify-between text-xs text-muted-foreground">
							<span>Progress</span>
							<span>{progress}%</span>
						</div>
						<Progress value={progress} className="h-1.5" />
					</div>
					<div className="flex items-center gap-4 text-xs text-muted-foreground">
						<span className="flex items-center gap-1">
							<ListTodo className="size-3.5" />
							{project.task_count} tasks
						</span>
						<span className="flex items-center gap-1">
							<CheckCircle2 className="size-3.5" />
							{project.completed_count} done
						</span>
						{project.due_date && (
							<span className="flex items-center gap-1">
								<Calendar className="size-3.5" />
								{new Date(project.due_date).toLocaleDateString("en-US", {
									month: "short",
									day: "numeric",
								})}
							</span>
						)}
					</div>
				</CardContent>
			</Card>
		</Link>
	);
}
