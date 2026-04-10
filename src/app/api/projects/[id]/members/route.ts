import { type NextRequest, NextResponse } from "next/server";
import {
	getProjectMembers,
	addProjectMember,
	removeProjectMember,
} from "@/lib/queries/projects";

export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	return NextResponse.json(getProjectMembers(Number.parseInt(id)));
}

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	const { userId, role } = await request.json();
	addProjectMember(Number.parseInt(id), userId, role);
	return NextResponse.json({ success: true }, { status: 201 });
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	const { userId } = await request.json();
	removeProjectMember(Number.parseInt(id), userId);
	return NextResponse.json({ success: true });
}
