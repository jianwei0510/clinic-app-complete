import { type NextRequest, NextResponse } from "next/server";
import { getAllUsers, createUser } from "@/lib/queries/users";

export async function GET() {
	return NextResponse.json(getAllUsers());
}

export async function POST(request: NextRequest) {
	const body = await request.json();
	const result = createUser(body);
	return NextResponse.json(
		{ id: result.lastInsertRowid },
		{ status: 201 },
	);
}
