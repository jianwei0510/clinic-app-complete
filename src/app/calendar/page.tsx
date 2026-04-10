import { CalendarGrid } from "@/components/calendar-grid";

export default function CalendarPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
				<p className="text-muted-foreground">
					View task deadlines and project milestones.
				</p>
			</div>
			<CalendarGrid />
		</div>
	);
}
