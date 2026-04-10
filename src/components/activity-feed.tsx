import type { ActivityWithUser } from "@/lib/types";
import { UserAvatar } from "@/components/user-avatar";

interface ActivityFeedProps {
	activities: ActivityWithUser[];
}

function getTimeAgo(dateStr: string): string {
	const now = new Date();
	const date = new Date(dateStr);
	const diffMs = now.getTime() - date.getTime();
	const diffMins = Math.floor(diffMs / 60000);
	const diffHours = Math.floor(diffMins / 60);
	const diffDays = Math.floor(diffHours / 24);

	if (diffMins < 1) return "just now";
	if (diffMins < 60) return `${diffMins}m ago`;
	if (diffHours < 24) return `${diffHours}h ago`;
	if (diffDays < 7) return `${diffDays}d ago`;
	return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getActionIcon(action: string): string {
	switch (action) {
		case "completed":
			return "bg-green-100 text-green-600";
		case "status_change":
			return "bg-blue-100 text-blue-600";
		case "comment":
			return "bg-amber-100 text-amber-600";
		case "created":
			return "bg-purple-100 text-purple-600";
		case "member_added":
			return "bg-pink-100 text-pink-600";
		default:
			return "bg-gray-100 text-gray-600";
	}
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
	if (activities.length === 0) {
		return (
			<p className="py-6 text-center text-sm text-muted-foreground">
				No recent activity
			</p>
		);
	}

	return (
		<div className="space-y-4">
			{activities.map((activity) => (
				<div key={activity.id} className="flex items-start gap-3">
					<UserAvatar
						name={activity.user_name}
						avatarUrl={activity.user_avatar || undefined}
						className="size-7 shrink-0"
					/>
					<div className="flex-1 space-y-0.5">
						<p className="text-sm">
							<span className="font-medium">{activity.user_name}</span>{" "}
							<span className="text-muted-foreground">
								{activity.description}
							</span>
						</p>
						<p className="text-xs text-muted-foreground">
							{getTimeAgo(activity.created_at)}
						</p>
					</div>
					<div
						className={`mt-0.5 size-2 shrink-0 rounded-full ${getActionIcon(activity.action).split(" ")[0]}`}
					/>
				</div>
			))}
		</div>
	);
}
