import { type NextRequest, NextResponse } from "next/server";
import { getProjectById, updateProject } from "@/lib/queries/projects";

export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	const project = getProjectById(Number.parseInt(id));
	if (!project) {
		return NextResponse.json({ error: "Project not found" }, { status: 404 });
	}
	return NextResponse.json(project);
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	const body = await request.json();
	updateProject(Number.parseInt(id), body);
	return NextResponse.json({ success: true });
}
