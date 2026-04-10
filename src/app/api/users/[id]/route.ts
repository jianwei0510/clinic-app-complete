import { type NextRequest, NextResponse } from "next/server";
import { getUserById, updateUser } from "@/lib/queries/users";

export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	const user = getUserById(Number.parseInt(id));
	if (!user) {
		return NextResponse.json({ error: "User not found" }, { status: 404 });
	}
	return NextResponse.json(user);
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	const body = await request.json();
	updateUser(Number.parseInt(id), body);
	return NextResponse.json({ success: true });
}
