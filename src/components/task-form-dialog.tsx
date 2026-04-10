"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { User } from "@/lib/types";

interface TaskFormDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	projectId: number;
	defaultStatus?: string;
	onSuccess?: () => void;
}

export function TaskFormDialog({
	open,
	onOpenChange,
	projectId,
	defaultStatus = "todo",
	onSuccess,
}: TaskFormDialogProps) {
	const [loading, setLoading] = useState(false);
	const [users, setUsers] = useState<User[]>([]);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [priority, setPriority] = useState("medium");
	const [assigneeId, setAssigneeId] = useState("");
	const [dueDate, setDueDate] = useState("");

	useEffect(() => {
		if (open) {
			fetch("/api/users")
				.then((r) => r.json())
				.then(setUsers);
		}
	}, [open]);

	function resetForm() {
		setTitle("");
		setDescription("");
		setPriority("medium");
		setAssigneeId("");
		setDueDate("");
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);

		await fetch("/api/tasks", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				project_id: projectId,
				title,
				description: description || null,
				status: defaultStatus,
				priority,
				assignee_id: assigneeId ? Number.parseInt(assigneeId) : null,
				due_date: dueDate || null,
			}),
		});

		setLoading(false);
		resetForm();
		onOpenChange(false);
		onSuccess?.();
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create Task</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="title">Title</Label>
						<Input
							id="title"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="Task title"
							required
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="desc">Description</Label>
						<Textarea
							id="desc"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Describe the task..."
							rows={3}
						/>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label>Priority</Label>
							<Select value={priority} onValueChange={(v) => v && setPriority(v)}>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="low">Low</SelectItem>
									<SelectItem value="medium">Medium</SelectItem>
									<SelectItem value="high">High</SelectItem>
									<SelectItem value="urgent">Urgent</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label>Assignee</Label>
							<Select value={assigneeId} onValueChange={(v) => setAssigneeId(v || "")}>
								<SelectTrigger>
									<SelectValue placeholder="Select..." />
								</SelectTrigger>
								<SelectContent>
									{users.map((u) => (
										<SelectItem key={u.id} value={String(u.id)}>
											{u.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
					<div className="space-y-2">
						<Label htmlFor="due">Due Date</Label>
						<Input
							id="due"
							type="date"
							value={dueDate}
							onChange={(e) => setDueDate(e.target.value)}
						/>
					</div>
					<div className="flex justify-end gap-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={loading || !title.trim()}>
							{loading ? "Creating..." : "Create Task"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
