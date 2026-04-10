import { getDb } from "@/lib/db";
import type { User } from "@/lib/types";

export function getAllUsers(): User[] {
	return getDb().prepare("SELECT * FROM users ORDER BY name").all() as User[];
}

export function getUserById(id: number): User | undefined {
	return getDb()
		.prepare("SELECT * FROM users WHERE id = ?")
		.get(id) as User | undefined;
}

export function getCurrentUser(): User {
	return getUserById(1)!;
}

export function createUser(data: {
	name: string;
	email: string;
	role: string;
	department: string;
}) {
	return getDb()
		.prepare(
			"INSERT INTO users (name, email, role, department) VALUES (?, ?, ?, ?)",
		)
		.run(data.name, data.email, data.role, data.department);
}

export function updateUser(
	id: number,
	data: Partial<{ name: string; email: string; role: string; department: string }>,
) {
	const fields: string[] = [];
	const values: (string | number)[] = [];
	for (const [key, value] of Object.entries(data)) {
		if (value !== undefined) {
			fields.push(`${key} = ?`);
			values.push(value);
		}
	}
	if (fields.length === 0) return;
	values.push(id);
	return getDb()
		.prepare(`UPDATE users SET ${fields.join(", ")} WHERE id = ?`)
		.run(...values);
}

export function getUserTaskStats(userId: number) {
	return getDb()
		.prepare(
			`SELECT
				COUNT(*) as total,
				SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END) as completed,
				SUM(CASE WHEN status != 'done' THEN 1 ELSE 0 END) as active
			 FROM tasks WHERE assignee_id = ?`,
		)
		.get(userId) as { total: number; completed: number; active: number };
}
