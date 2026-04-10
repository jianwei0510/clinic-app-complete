import { type NextRequest, NextResponse } from "next/server";
import { getAllTasks, createTask } from "@/lib/queries/tasks";
import { createActivity } from "@/lib/queries/activities";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const projectId = searchParams.get("projectId");
	const status = searchParams.get("status");
	const assigneeId = searchParams.get("assigneeId");
	const date = searchParams.get("date");

	return NextResponse.json(
		getAllTasks({
			projectId: projectId ? Number.parseInt(projectId) : undefined,
			status: status || undefined,
			assigneeId: assigneeId ? Number.parseInt(assigneeId) : undefined,
			date: date || undefined,
		}),
	);
}

export async function POST(request: NextRequest) {
	const body = await request.json();
	const result = createTask({ ...body, created_by: 1 });

	createActivity({
		project_id: body.project_id,
		task_id: Number(result.lastInsertRowid),
		user_id: 1,
		action: "created",
		description: `created task "${body.title}"`,
	});

	return NextResponse.json(
		{ id: result.lastInsertRowid },
		{ status: 201 },
	);
}
