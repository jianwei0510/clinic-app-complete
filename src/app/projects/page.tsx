import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/project-card";
import { ProjectFormDialog } from "@/components/project-form-dialog";
import { getAllProjects } from "@/lib/queries/projects";

export default function ProjectsPage() {
	const projects = getAllProjects();

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Projects</h1>
					<p className="text-muted-foreground">
						Manage and track all your team projects.
					</p>
				</div>
				<ProjectFormDialog
					trigger={
						<Button>
							<Plus className="mr-2 size-4" />
							New Project
						</Button>
					}
				/>
			</div>

			{projects.length === 0 ? (
				<div className="rounded-lg border border-dashed p-12 text-center">
					<h3 className="text-lg font-medium">No projects yet</h3>
					<p className="mt-1 text-sm text-muted-foreground">
						Create your first project to get started.
					</p>
				</div>
			) : (
				<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
					{projects.map((project) => (
						<ProjectCard key={project.id} project={project} />
					))}
				</div>
			)}
		</div>
	);
}
