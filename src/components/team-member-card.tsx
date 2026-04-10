import Link from "next/link";
import { Briefcase, CheckCircle2, ListTodo } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { UserAvatar } from "@/components/user-avatar";

interface TeamMemberCardProps {
	member: {
		id: number;
		name: string;
		email: string;
		avatar_url: string | null;
		role: string;
		department: string;
	};
	taskStats: {
		total: number;
		completed: number;
		active: number;
	};
}

export function TeamMemberCard({ member, taskStats }: TeamMemberCardProps) {
	return (
		<Link href={`/team/${member.id}`}>
			<Card className="transition-shadow hover:shadow-md">
				<CardContent className="flex flex-col items-center pt-6 text-center">
					<UserAvatar
						name={member.name}
						avatarUrl={member.avatar_url || undefined}
						className="size-16"
					/>
					<h3 className="mt-3 font-semibold">{member.name}</h3>
					<p className="text-sm text-muted-foreground">{member.role}</p>
					<div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
						<Briefcase className="size-3" />
						{member.department}
					</div>
					<div className="mt-4 flex w-full justify-center gap-4 border-t pt-4 text-xs text-muted-foreground">
						<span className="flex items-center gap-1">
							<ListTodo className="size-3.5" />
							{taskStats.active} active
						</span>
						<span className="flex items-center gap-1">
							<CheckCircle2 className="size-3.5" />
							{taskStats.completed} done
						</span>
					</div>
				</CardContent>
			</Card>
		</Link>
	);
}
