import { type NextRequest, NextResponse } from "next/server";
import { getTaskById, updateTaskStatus } from "@/lib/queries/tasks";
import { createActivity } from "@/lib/queries/activities";

const statusLabels: Record<string, string> = {
	todo: "To Do",
	in_progress: "In Progress",
	in_review: "In Review",
	done: "Done",
};

export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	const { status } = await request.json();
	const taskId = Number.parseInt(id);

	const task = getTaskById(taskId);
	if (!task) {
		return NextResponse.json({ error: "Task not found" }, { status: 404 });
	}

	updateTaskStatus(taskId, status);

	const action = status === "done" ? "completed" : "status_change";
	const description =
		status === "done"
			? `completed "${task.title}"`
			: `moved "${task.title}" to ${statusLabels[status] || status}`;

	createActivity({
		project_id: task.project_id,
		task_id: taskId,
		user_id: 1,
		action,
		description,
	});

	return NextResponse.json({ success: true });
}
