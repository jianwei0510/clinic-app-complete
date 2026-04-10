import { getDb } from "@/lib/db";
import type { Project, ProjectWithStats } from "@/lib/types";

export function getAllProjects(): ProjectWithStats[] {
	return getDb()
		.prepare(
			`SELECT p.*,
				(SELECT COUNT(*) FROM tasks WHERE project_id = p.id) as task_count,
				(SELECT COUNT(*) FROM tasks WHERE project_id = p.id AND status = 'done') as completed_count,
				(SELECT COUNT(*) FROM project_members WHERE project_id = p.id) as member_count
			 FROM projects p
			 ORDER BY p.created_at DESC`,
		)
		.all() as ProjectWithStats[];
}

export function getProjectById(id: number): ProjectWithStats | undefined {
	return getDb()
		.prepare(
			`SELECT p.*,
				(SELECT COUNT(*) FROM tasks WHERE project_id = p.id) as task_count,
				(SELECT COUNT(*) FROM tasks WHERE project_id = p.id AND status = 'done') as completed_count,
				(SELECT COUNT(*) FROM project_members WHERE project_id = p.id) as member_count
			 FROM projects p
			 WHERE p.id = ?`,
		)
		.get(id) as ProjectWithStats | undefined;
}

export interface ProjectMemberWithUser {
	id: number;
	name: string;
	email: string;
	avatar_url: string | null;
	role: string;
	department: string;
	project_role: string;
}

export function getProjectMembers(projectId: number): ProjectMemberWithUser[] {
	return getDb()
		.prepare(
			`SELECT u.*, pm.role as project_role
			 FROM project_members pm
			 JOIN users u ON pm.user_id = u.id
			 WHERE pm.project_id = ?
			 ORDER BY pm.role DESC, u.name`,
		)
		.all(projectId) as ProjectMemberWithUser[];
}

export function getProjectStats() {
	return getDb()
		.prepare(
			`SELECT p.id, p.name, p.color,
				(SELECT COUNT(*) FROM tasks WHERE project_id = p.id) as task_count,
				(SELECT COUNT(*) FROM tasks WHERE project_id = p.id AND status = 'done') as completed_count
			 FROM projects p WHERE p.status = 'active'
			 ORDER BY p.created_at DESC
			 LIMIT 5`,
		)
		.all() as {
		id: number;
		name: string;
		color: string;
		task_count: number;
		completed_count: number;
	}[];
}

export function createProject(data: {
	name: string;
	description?: string;
	color?: string;
	start_date?: string;
	due_date?: string;
	created_by: number;
}) {
	return getDb()
		.prepare(
			`INSERT INTO projects (name, description, color, start_date, due_date, created_by)
			 VALUES (?, ?, ?, ?, ?, ?)`,
		)
		.run(
			data.name,
			data.description || null,
			data.color || "#6366f1",
			data.start_date || null,
			data.due_date || null,
			data.created_by,
		);
}

export function updateProject(
	id: number,
	data: Partial<Pick<Project, "name" | "description" | "status" | "color" | "due_date">>,
) {
	const fields: string[] = [];
	const values: (string | number | null)[] = [];
	for (const [key, value] of Object.entries(data)) {
		if (value !== undefined) {
			fields.push(`${key} = ?`);
			values.push(value);
		}
	}
	if (fields.length === 0) return;
	values.push(id);
	return getDb()
		.prepare(`UPDATE projects SET ${fields.join(", ")} WHERE id = ?`)
		.run(...values);
}

export function addProjectMember(projectId: number, userId: number, role = "member") {
	return getDb()
		.prepare(
			"INSERT INTO project_members (project_id, user_id, role) VALUES (?, ?, ?)",
		)
		.run(projectId, userId, role);
}

export function removeProjectMember(projectId: number, userId: number) {
	return getDb()
		.prepare("DELETE FROM project_members WHERE project_id = ? AND user_id = ?")
		.run(projectId, userId);
}
