import { type NextRequest, NextResponse } from "next/server";
import { getTaskById, updateTask, deleteTask } from "@/lib/queries/tasks";

export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	const task = getTaskById(Number.parseInt(id));
	if (!task) {
		return NextResponse.json({ error: "Task not found" }, { status: 404 });
	}
	return NextResponse.json(task);
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	const body = await request.json();
	updateTask(Number.parseInt(id), body);
	return NextResponse.json({ success: true });
}

export async function DELETE(
	_request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	deleteTask(Number.parseInt(id));
	return NextResponse.json({ success: true });
}
