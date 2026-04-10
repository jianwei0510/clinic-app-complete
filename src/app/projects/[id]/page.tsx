import { notFound } from "next/navigation";
import { getProjectById, getProjectMembers } from "@/lib/queries/projects";
import { getActivitiesByProject } from "@/lib/queries/activities";
import { ProjectDetailClient } from "./client";

export default async function ProjectDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const project = getProjectById(Number.parseInt(id));

	if (!project) notFound();

	const members = getProjectMembers(project.id);
	const activities = getActivitiesByProject(project.id, 10);

	return (
		<ProjectDetailClient
			project={project}
			members={members}
			activities={activities}
		/>
	);
}
