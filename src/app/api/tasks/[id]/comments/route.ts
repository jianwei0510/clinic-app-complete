import { type NextRequest, NextResponse } from "next/server";
import { getCommentsByTask, createComment } from "@/lib/queries/comments";
import { getTaskById } from "@/lib/queries/tasks";
import { createActivity } from "@/lib/queries/activities";

export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	return NextResponse.json(getCommentsByTask(Number.parseInt(id)));
}

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	const taskId = Number.parseInt(id);
	const { content } = await request.json();

	createComment({ task_id: taskId, user_id: 1, content });

	const task = getTaskById(taskId);
	if (task) {
		createActivity({
			project_id: task.project_id,
			task_id: taskId,
			user_id: 1,
			action: "comment",
			description: `commented on "${task.title}"`,
		});
	}

	return NextResponse.json({ success: true }, { status: 201 });
}
