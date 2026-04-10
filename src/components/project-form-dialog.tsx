"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const PROJECT_COLORS = [
	"#6366f1",
	"#8b5cf6",
	"#f59e0b",
	"#10b981",
	"#ec4899",
	"#3b82f6",
	"#ef4444",
	"#14b8a6",
];

interface ProjectFormDialogProps {
	trigger: React.ReactNode;
	project?: {
		id: number;
		name: string;
		description: string | null;
		color: string;
		due_date: string | null;
	};
	onSuccess?: () => void;
}

export function ProjectFormDialog({
	trigger,
	project,
	onSuccess,
}: ProjectFormDialogProps) {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [name, setName] = useState(project?.name || "");
	const [description, setDescription] = useState(project?.description || "");
	const [color, setColor] = useState(project?.color || "#6366f1");
	const [dueDate, setDueDate] = useState(project?.due_date || "");

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);

		const url = project ? `/api/projects/${project.id}` : "/api/projects";
		const method = project ? "PUT" : "POST";

		await fetch(url, {
			method,
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				name,
				description: description || null,
				color,
				due_date: dueDate || null,
			}),
		});

		setLoading(false);
		setOpen(false);
		onSuccess?.();
	}

	return (
		<>
			<div onClick={() => setOpen(true)} onKeyDown={(e) => e.key === "Enter" && setOpen(true)}>
				{trigger}
			</div>
			<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{project ? "Edit Project" : "New Project"}
					</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="name">Project Name</Label>
						<Input
							id="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Enter project name"
							required
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="description">Description</Label>
						<Textarea
							id="description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Describe the project..."
							rows={3}
						/>
					</div>
					<div className="space-y-2">
						<Label>Color</Label>
						<div className="flex gap-2">
							{PROJECT_COLORS.map((c) => (
								<button
									key={c}
									type="button"
									onClick={() => setColor(c)}
									className={`size-7 rounded-full transition-transform ${
										color === c
											? "scale-110 ring-2 ring-offset-2 ring-primary"
											: "hover:scale-105"
									}`}
									style={{ backgroundColor: c }}
								/>
							))}
						</div>
					</div>
					<div className="space-y-2">
						<Label htmlFor="dueDate">Due Date</Label>
						<Input
							id="dueDate"
							type="date"
							value={dueDate}
							onChange={(e) => setDueDate(e.target.value)}
						/>
					</div>
					<div className="flex justify-end gap-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => setOpen(false)}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={loading || !name.trim()}>
							{loading
								? "Saving..."
								: project
									? "Save Changes"
									: "Create Project"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
		</>
	);
}
