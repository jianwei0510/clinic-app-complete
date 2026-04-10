import { getAllUsers, getUserTaskStats } from "@/lib/queries/users";
import { TeamMemberCard } from "@/components/team-member-card";

export default function TeamPage() {
	const users = getAllUsers();

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold tracking-tight">Team</h1>
				<p className="text-muted-foreground">
					Your team members and their roles.
				</p>
			</div>

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{users.map((user) => {
					const stats = getUserTaskStats(user.id);
					return (
						<TeamMemberCard key={user.id} member={user} taskStats={stats} />
					);
				})}
			</div>
		</div>
	);
}
