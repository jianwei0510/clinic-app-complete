import { getDb } from "@/lib/db";
import type { Task, TaskWithDetails } from "@/lib/types";

export function getTasksByProject(
	projectId: number,
	status?: string,
	priority?: string,
): TaskWithDetails[] {
	let sql = `
		SELECT t.*,
			u.name as assignee_name,
			u.avatar_url as assignee_avatar,
			p.name as project_name,
			p.color as project_color,
			(SELECT COUNT(*) FROM comments WHERE task_id = t.id) as comment_count
		FROM tasks t
		LEFT JOIN users u ON t.assignee_id = u.id
		LEFT JOIN projects p ON t.project_id = p.id
		WHERE t.project_id = ?
	`;
	const params: (string | number)[] = [projectId];

	if (status) {
		sql += " AND t.status = ?";
		params.push(status);
	}
	if (priority) {
		sql += " AND t.priority = ?";
		params.push(priority);
	}
	sql += " ORDER BY t.position ASC, t.created_at DESC";

	return getDb().prepare(sql).all(...params) as TaskWithDetails[];
}

export function getTaskById(id: number): TaskWithDetails | undefined {
	return getDb()
		.prepare(
			`SELECT t.*,
				u.name as assignee_name,
				u.avatar_url as assignee_avatar,
				p.name as project_name,
				p.color as project_color,
				(SELECT COUNT(*) FROM comments WHERE task_id = t.id) as comment_count
			 FROM tasks t
			 LEFT JOIN users u ON t.assignee_id = u.id
			 LEFT JOIN projects p ON t.project_id = p.id
			 WHERE t.id = ?`,
		)
		.get(id) as TaskWithDetails | undefined;
}

export function getTasksByUser(userId: number): TaskWithDetails[] {
	return getDb()
		.prepare(
			`SELECT t.*,
				u.name as assignee_name,
				u.avatar_url as assignee_avatar,
				p.name as project_name,
				p.color as project_color,
				(SELECT COUNT(*) FROM comments WHERE task_id = t.id) as comment_count
			 FROM tasks t
			 LEFT JOIN users u ON t.assignee_id = u.id
			 LEFT JOIN projects p ON t.project_id = p.id
			 WHERE t.assignee_id = ?
			 ORDER BY t.due_date ASC`,
		)
		.all(userId) as TaskWithDetails[];
}

export function getTasksDueSoon(userId: number, days = 7): TaskWithDetails[] {
	const today = new Date().toISOString().split("T")[0];
	const futureDate = new Date();
	futureDate.setDate(futureDate.getDate() + days);
	const future = futureDate.toISOString().split("T")[0];

	return getDb()
		.prepare(
			`SELECT t.*,
				u.name as assignee_name,
				u.avatar_url as assignee_avatar,
				p.name as project_name,
				p.color as project_color,
				(SELECT COUNT(*) FROM comments WHERE task_id = t.id) as comment_count
			 FROM tasks t
			 LEFT JOIN users u ON t.assignee_id = u.id
			 LEFT JOIN projects p ON t.project_id = p.id
			 WHERE t.assignee_id = ? AND t.status != 'done'
			   AND t.due_date >= ? AND t.due_date <= ?
			 ORDER BY t.due_date ASC
			 LIMIT 10`,
		)
		.all(userId, today, future) as TaskWithDetails[];
}

export function getTasksByDate(date: string): TaskWithDetails[] {
	return getDb()
		.prepare(
			`SELECT t.*,
				u.name as assignee_name,
				u.avatar_url as assignee_avatar,
				p.name as project_name,
				p.color as project_color,
				(SELECT COUNT(*) FROM comments WHERE task_id = t.id) as comment_count
			 FROM tasks t
			 LEFT JOIN users u ON t.assignee_id = u.id
			 LEFT JOIN projects p ON t.project_id = p.id
			 WHERE t.due_date = ?
			 ORDER BY p.name, t.priority DESC`,
		)
		.all(date) as TaskWithDetails[];
}

export function getTaskStats() {
	return getDb()
		.prepare(
			`SELECT
				COUNT(*) as total,
				SUM(CASE WHEN status = 'todo' THEN 1 ELSE 0 END) as todo,
				SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
				SUM(CASE WHEN status = 'in_review' THEN 1 ELSE 0 END) as in_review,
				SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END) as done
			 FROM tasks`,
		)
		.get() as {
		total: number;
		todo: number;
		in_progress: number;
		in_review: number;
		done: number;
	};
}

export function getCompletedThisWeek(): number {
	const now = new Date();
	const startOfWeek = new Date(now);
	startOfWeek.setDate(now.getDate() - now.getDay());
	const start = startOfWeek.toISOString().split("T")[0];

	const row = getDb()
		.prepare(
			"SELECT COUNT(*) as count FROM tasks WHERE status = 'done' AND updated_at >= ?",
		)
		.get(start) as { count: number };
	return row.count;
}

export function getActiveTasks(): number {
	const row = getDb()
		.prepare("SELECT COUNT(*) as count FROM tasks WHERE status != 'done'")
		.get() as { count: number };
	return row.count;
}

export function createTask(data: {
	project_id: number;
	title: string;
	description?: string;
	status?: string;
	priority?: string;
	assignee_id?: number;
	due_date?: string;
	created_by: number;
}) {
	const maxPos = getDb()
		.prepare(
			"SELECT COALESCE(MAX(position), -1) + 1 as next_pos FROM tasks WHERE project_id = ? AND status = ?",
		)
		.get(data.project_id, data.status || "todo") as { next_pos: number };

	return getDb()
		.prepare(
			`INSERT INTO tasks (project_id, title, description, status, priority, assignee_id, due_date, position, created_by)
			 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		)
		.run(
			data.project_id,
			data.title,
			data.description || null,
			data.status || "todo",
			data.priority || "medium",
			data.assignee_id || null,
			data.due_date || null,
			maxPos.next_pos,
			data.created_by,
		);
}

export function updateTask(
	id: number,
	data: Partial<
		Pick<Task, "title" | "description" | "status" | "priority" | "assignee_id" | "due_date">
	>,
) {
	const fields: string[] = ["updated_at = datetime('now','localtime')"];
	const values: (string | number | null)[] = [];
	for (const [key, value] of Object.entries(data)) {
		if (value !== undefined) {
			fields.push(`${key} = ?`);
			values.push(value);
		}
	}
	values.push(id);
	return getDb()
		.prepare(`UPDATE tasks SET ${fields.join(", ")} WHERE id = ?`)
		.run(...values);
}

export function updateTaskStatus(id: number, status: string) {
	return getDb()
		.prepare(
			"UPDATE tasks SET status = ?, updated_at = datetime('now','localtime') WHERE id = ?",
		)
		.run(status, id);
}

export function deleteTask(id: number) {
	const db = getDb();
	db.prepare("DELETE FROM comments WHERE task_id = ?").run(id);
	db.prepare("DELETE FROM task_labels WHERE task_id = ?").run(id);
	return db.prepare("DELETE FROM tasks WHERE id = ?").run(id);
}

export function getAllTasks(filters?: {
	projectId?: number;
	status?: string;
	assigneeId?: number;
	date?: string;
}): TaskWithDetails[] {
	let sql = `
		SELECT t.*,
			u.name as assignee_name,
			u.avatar_url as assignee_avatar,
			p.name as project_name,
			p.color as project_color,
			(SELECT COUNT(*) FROM comments WHERE task_id = t.id) as comment_count
		FROM tasks t
		LEFT JOIN users u ON t.assignee_id = u.id
		LEFT JOIN projects p ON t.project_id = p.id
		WHERE 1=1
	`;
	const params: (string | number)[] = [];

	if (filters?.projectId) {
		sql += " AND t.project_id = ?";
		params.push(filters.projectId);
	}
	if (filters?.status) {
		sql += " AND t.status = ?";
		params.push(filters.status);
	}
	if (filters?.assigneeId) {
		sql += " AND t.assignee_id = ?";
		params.push(filters.assigneeId);
	}
	if (filters?.date) {
		sql += " AND t.due_date = ?";
		params.push(filters.date);
	}

	sql += " ORDER BY t.created_at DESC";

	return getDb().prepare(sql).all(...params) as TaskWithDetails[];
}
