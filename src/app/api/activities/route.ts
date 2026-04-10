import { type NextRequest, NextResponse } from "next/server";
import {
	getRecentActivities,
	getActivitiesByProject,
	getActivitiesByUser,
} from "@/lib/queries/activities";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const limit = Number.parseInt(searchParams.get("limit") || "20");
	const projectId = searchParams.get("projectId");
	const userId = searchParams.get("userId");

	if (projectId) {
		return NextResponse.json(
			getActivitiesByProject(Number.parseInt(projectId), limit),
		);
	}
	if (userId) {
		return NextResponse.json(
			getActivitiesByUser(Number.parseInt(userId), limit),
		);
	}
	return NextResponse.json(getRecentActivities(limit));
}
