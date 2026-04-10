"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TaskWithDetails } from "@/lib/types";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getDaysInMonth(year: number, month: number) {
	return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
	return new Date(year, month, 1).getDay();
}

function formatDate(year: number, month: number, day: number) {
	return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function CalendarGrid() {
	const today = new Date();
	const [currentYear, setCurrentYear] = useState(today.getFullYear());
	const [currentMonth, setCurrentMonth] = useState(today.getMonth());
	const [selectedDate, setSelectedDate] = useState<string | null>(null);
	const [tasks, setTasks] = useState<Record<string, TaskWithDetails[]>>({});
	const [selectedDayTasks, setSelectedDayTasks] = useState<TaskWithDetails[]>([]);

	const fetchTasks = useCallback(async () => {
		// Fetch tasks for the visible date range
		const firstDay = new Date(currentYear, currentMonth, 1);
		const lastDay = new Date(currentYear, currentMonth + 1, 0);
		const start = firstDay.toISOString().split("T")[0];
		const end = lastDay.toISOString().split("T")[0];

		const res = await fetch(`/api/tasks`);
		const allTasks: TaskWithDetails[] = await res.json();

		// Group tasks by due_date
		const grouped: Record<string, TaskWithDetails[]> = {};
		for (const task of allTasks) {
			if (task.due_date && task.due_date >= start && task.due_date <= end) {
				if (!grouped[task.due_date]) grouped[task.due_date] = [];
				grouped[task.due_date].push(task);
			}
		}
		setTasks(grouped);
	}, [currentYear, currentMonth]);

	useEffect(() => {
		fetchTasks();
	}, [fetchTasks]);

	useEffect(() => {
		if (selectedDate && tasks[selectedDate]) {
			setSelectedDayTasks(tasks[selectedDate]);
		} else {
			setSelectedDayTasks([]);
		}
	}, [selectedDate, tasks]);

	function prevMonth() {
		if (currentMonth === 0) {
			setCurrentYear((y) => y - 1);
			setCurrentMonth(11);
		} else {
			setCurrentMonth((m) => m - 1);
		}
		setSelectedDate(null);
	}

	function nextMonth() {
		if (currentMonth === 11) {
			setCurrentYear((y) => y + 1);
			setCurrentMonth(0);
		} else {
			setCurrentMonth((m) => m + 1);
		}
		setSelectedDate(null);
	}

	function goToToday() {
		setCurrentYear(today.getFullYear());
		setCurrentMonth(today.getMonth());
		setSelectedDate(formatDate(today.getFullYear(), today.getMonth(), today.getDate()));
	}

	const daysInMonth = getDaysInMonth(currentYear, currentMonth);
	const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
	const todayStr = formatDate(today.getFullYear(), today.getMonth(), today.getDate());
	const monthName = new Date(currentYear, currentMonth).toLocaleDateString("en-US", {
		month: "long",
		year: "numeric",
	});

	// Build 6-week grid (42 cells)
	const prevMonthDays = getDaysInMonth(
		currentMonth === 0 ? currentYear - 1 : currentYear,
		currentMonth === 0 ? 11 : currentMonth - 1,
	);
	const cells: Array<{
		day: number;
		date: string;
		isCurrentMonth: boolean;
		isToday: boolean;
	}> = [];

	// Previous month trailing days
	for (let i = firstDay - 1; i >= 0; i--) {
		const day = prevMonthDays - i;
		const m = currentMonth === 0 ? 11 : currentMonth - 1;
		const y = currentMonth === 0 ? currentYear - 1 : currentYear;
		cells.push({
			day,
			date: formatDate(y, m, day),
			isCurrentMonth: false,
			isToday: false,
		});
	}

	// Current month days
	for (let day = 1; day <= daysInMonth; day++) {
		const date = formatDate(currentYear, currentMonth, day);
		cells.push({
			day,
			date,
			isCurrentMonth: true,
			isToday: date === todayStr,
		});
	}

	// Next month leading days
	const remaining = 42 - cells.length;
	for (let day = 1; day <= remaining; day++) {
		const m = currentMonth === 11 ? 0 : currentMonth + 1;
		const y = currentMonth === 11 ? currentYear + 1 : currentYear;
		cells.push({
			day,
			date: formatDate(y, m, day),
			isCurrentMonth: false,
			isToday: false,
		});
	}

	const priorityConfig: Record<string, string> = {
		urgent: "bg-red-100 text-red-700",
		high: "bg-orange-100 text-orange-700",
		medium: "bg-yellow-100 text-yellow-700",
		low: "bg-green-100 text-green-700",
	};

	return (
		<div className="grid gap-6 lg:grid-cols-3">
			<div className="lg:col-span-2">
				{/* Header */}
				<div className="mb-4 flex items-center justify-between">
					<h2 className="text-lg font-semibold">{monthName}</h2>
					<div className="flex items-center gap-2">
						<Button variant="outline" size="sm" onClick={goToToday}>
							Today
						</Button>
						<Button variant="outline" size="icon" className="size-8" onClick={prevMonth}>
							<ChevronLeft className="size-4" />
						</Button>
						<Button variant="outline" size="icon" className="size-8" onClick={nextMonth}>
							<ChevronRight className="size-4" />
						</Button>
					</div>
				</div>

				{/* Day headers */}
				<div className="grid grid-cols-7 gap-px rounded-t-lg bg-muted">
					{DAYS_OF_WEEK.map((day) => (
						<div
							key={day}
							className="bg-background py-2 text-center text-xs font-medium text-muted-foreground"
						>
							{day}
						</div>
					))}
				</div>

				{/* Calendar grid */}
				<div className="grid grid-cols-7 gap-px rounded-b-lg border bg-muted">
					{cells.map((cell) => {
						const dayTasks = tasks[cell.date] || [];
						const isSelected = selectedDate === cell.date;

						return (
							<button
								type="button"
								key={cell.date}
								onClick={() => setSelectedDate(cell.date)}
								className={`min-h-20 bg-background p-1.5 text-left transition-colors hover:bg-accent/50 ${
									!cell.isCurrentMonth ? "text-muted-foreground/40" : ""
								} ${isSelected ? "ring-2 ring-primary ring-inset" : ""}`}
							>
								<span
									className={`inline-flex size-6 items-center justify-center rounded-full text-xs ${
										cell.isToday
											? "bg-primary text-primary-foreground font-semibold"
											: ""
									}`}
								>
									{cell.day}
								</span>
								{dayTasks.length > 0 && (
									<div className="mt-1 space-y-0.5">
										{dayTasks.slice(0, 3).map((t) => (
											<div
												key={t.id}
												className="flex items-center gap-1 truncate"
											>
												<div
													className="size-1.5 shrink-0 rounded-full"
													style={{
														backgroundColor:
															t.project_color || "#6366f1",
													}}
												/>
												<span className="truncate text-[10px]">
													{t.title}
												</span>
											</div>
										))}
										{dayTasks.length > 3 && (
											<span className="text-[10px] text-muted-foreground">
												+{dayTasks.length - 3} more
											</span>
										)}
									</div>
								)}
							</button>
						);
					})}
				</div>
			</div>

			{/* Selected day sidebar */}
			<Card>
				<CardHeader>
					<CardTitle className="text-base">
						{selectedDate
							? new Date(selectedDate + "T00:00").toLocaleDateString("en-US", {
									weekday: "long",
									month: "long",
									day: "numeric",
								})
							: "Select a day"}
					</CardTitle>
				</CardHeader>
				<CardContent>
					{!selectedDate ? (
						<p className="text-sm text-muted-foreground">
							Click on a day to see tasks due.
						</p>
					) : selectedDayTasks.length === 0 ? (
						<p className="text-sm text-muted-foreground">
							No tasks due on this day.
						</p>
					) : (
						<div className="space-y-3">
							{selectedDayTasks.map((task) => (
								<div
									key={task.id}
									className="rounded-lg border p-3 text-sm"
								>
									<div className="flex items-start gap-2">
										<div
											className="mt-0.5 size-2 shrink-0 rounded-full"
											style={{
												backgroundColor:
													task.project_color || "#6366f1",
											}}
										/>
										<div className="flex-1">
											<p className="font-medium">{task.title}</p>
											<p className="text-xs text-muted-foreground">
												{task.project_name}
											</p>
										</div>
									</div>
									<div className="mt-2 flex gap-2">
										<Badge
											variant="secondary"
											className={
												priorityConfig[task.priority] || ""
											}
										>
											{task.priority}
										</Badge>
										{task.assignee_name && (
											<span className="text-xs text-muted-foreground">
												{task.assignee_name}
											</span>
										)}
									</div>
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
