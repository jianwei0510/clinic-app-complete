import { type NextRequest, NextResponse } from "next/server";
import { getAllProjects, createProject } from "@/lib/queries/projects";

export async function GET() {
	return NextResponse.json(getAllProjects());
}

export async function POST(request: NextRequest) {
	const body = await request.json();
	const result = createProject({ ...body, created_by: 1 });
	return NextResponse.json(
		{ id: result.lastInsertRowid },
		{ status: 201 },
	);
}
