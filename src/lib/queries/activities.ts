import { getDb } from "@/lib/db";
import type { ActivityWithUser } from "@/lib/types";

export function getRecentActivities(limit = 10): ActivityWithUser[] {
	return getDb()
		.prepare(
			`SELECT a.*, u.name as user_name, u.avatar_url as user_avatar
			 FROM activities a
			 JOIN users u ON a.user_id = u.id
			 ORDER BY a.created_at DESC
			 LIMIT ?`,
		)
		.all(limit) as ActivityWithUser[];
}

export function getActivitiesByProject(
	projectId: number,
	limit = 20,
): ActivityWithUser[] {
	return getDb()
		.prepare(
			`SELECT a.*, u.name as user_name, u.avatar_url as user_avatar
			 FROM activities a
			 JOIN users u ON a.user_id = u.id
			 WHERE a.project_id = ?
			 ORDER BY a.created_at DESC
			 LIMIT ?`,
		)
		.all(projectId, limit) as ActivityWithUser[];
}

export function getActivitiesByUser(
	userId: number,
	limit = 20,
): ActivityWithUser[] {
	return getDb()
		.prepare(
			`SELECT a.*, u.name as user_name, u.avatar_url as user_avatar
			 FROM activities a
			 JOIN users u ON a.user_id = u.id
			 WHERE a.user_id = ?
			 ORDER BY a.created_at DESC
			 LIMIT ?`,
		)
		.all(userId, limit) as ActivityWithUser[];
}

export function createActivity(data: {
	project_id?: number;
	task_id?: number;
	user_id: number;
	action: string;
	description: string;
}) {
	return getDb()
		.prepare(
			`INSERT INTO activities (project_id, task_id, user_id, action, description)
			 VALUES (?, ?, ?, ?, ?)`,
		)
		.run(
			data.project_id || null,
			data.task_id || null,
			data.user_id,
			data.action,
			data.description,
		);
}
