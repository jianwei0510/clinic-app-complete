import { getDb } from "@/lib/db";
import type { CommentWithUser } from "@/lib/types";

export function getCommentsByTask(taskId: number): CommentWithUser[] {
	return getDb()
		.prepare(
			`SELECT c.*, u.name as user_name, u.avatar_url as user_avatar
			 FROM comments c
			 JOIN users u ON c.user_id = u.id
			 WHERE c.task_id = ?
			 ORDER BY c.created_at ASC`,
		)
		.all(taskId) as CommentWithUser[];
}

export function createComment(data: {
	task_id: number;
	user_id: number;
	content: string;
}) {
	return getDb()
		.prepare(
			"INSERT INTO comments (task_id, user_id, content) VALUES (?, ?, ?)",
		)
		.run(data.task_id, data.user_id, data.content);
}
