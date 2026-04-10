import { NextResponse } from "next/server";
import { getAllProjects, getProjectStats } from "@/lib/queries/projects";
import { getActiveTasks, getCompletedThisWeek, getTasksDueSoon } from "@/lib/queries/tasks";
import { getAllUsers } from "@/lib/queries/users";
import { getRecentActivities } from "@/lib/queries/activities";

export async function GET() {
	const projects = getAllProjects();
	const activeTasks = getActiveTasks();
	const completedThisWeek = getCompletedThisWeek();
	const teamMembers = getAllUsers();
	const dueSoon = getTasksDueSoon(1, 7);
	const recentActivity = getRecentActivities(10);
	const projectProgress = getProjectStats();

	return NextResponse.json({
		stats: {
			totalProjects: projects.length,
			activeTasks,
			completedThisWeek,
			teamMembers: teamMembers.length,
		},
		dueSoon,
		recentActivity,
		projectProgress,
	});
}
