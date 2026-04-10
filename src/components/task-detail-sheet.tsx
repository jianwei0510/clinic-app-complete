"use client";

import { useCallback, useEffect, useState } from "react";
import { CalendarDays, MessageSquare, Send, User as UserIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { UserAvatar } from "@/components/user-avatar";
import type { CommentWithUser, TaskWithDetails, User } from "@/lib/types";

const statusOptions = [
	{ value: "todo", label: "To Do" },
	{ value: "in_progress", label: "In Progress" },
	{ value: "in_review", label: "In Review" },
	{ value: "done", label: "Done" },
];

const priorityOptions = [
	{ value: "low", label: "Low" },
	{ value: "medium", label: "Medium" },
	{ value: "high", label: "High" },
	{ value: "urgent", label: "Urgent" },
];

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

interface TaskDetailSheetProps {
	task: TaskWithDetails | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onUpdate?: () => void;
}

export function TaskDetailSheet({
	task,
	open,
	onOpenChange,
	onUpdate,
}: TaskDetailSheetProps) {
	const [comments, setComments] = useState<CommentWithUser[]>([]);
	const [newComment, setNewComment] = useState("");
	const [users, setUsers] = useState<User[]>([]);
	const [sending, setSending] = useState(false);

	const fetchComments = useCallback(async () => {
		if (!task) return;
		const res = await fetch(`/api/tasks/${task.id}/comments`);
		setComments(await res.json());
	}, [task]);

	useEffect(() => {
		if (open && task) {
			fetchComments();
			fetch("/api/users")
				.then((r) => r.json())
				.then(setUsers);
		}
	}, [open, task, fetchComments]);

	async function handleStatusChange(status: string) {
		if (!task) return;
		await fetch(`/api/tasks/${task.id}/status`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ status }),
		});
		onUpdate?.();
	}

	async function handleFieldUpdate(field: string, value: string | number | null) {
		if (!task) return;
		await fetch(`/api/tasks/${task.id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ [field]: value }),
		});
		onUpdate?.();
	}

	async function handleAddComment() {
		if (!task || !newComment.trim()) return;
		setSending(true);
		await fetch(`/api/tasks/${task.id}/comments`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ content: newComment }),
		});
		setNewComment("");
		setSending(false);
		fetchComments();
	}

	if (!task) return null;

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent className="w-full overflow-y-auto sm:max-w-lg">
				<SheetHeader>
					<SheetTitle className="text-left text-lg">{task.title}</SheetTitle>
				</SheetHeader>

				<div className="mt-4 space-y-6">
					{/* Status pills */}
					<div className="flex flex-wrap gap-1.5">
						{statusOptions.map((opt) => (
							<button
								key={opt.value}
								type="button"
								onClick={() => handleStatusChange(opt.value)}
								className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
									task.status === opt.value
										? "bg-primary text-primary-foreground"
										: "bg-muted text-muted-foreground hover:bg-muted/80"
								}`}
							>
								{opt.label}
							</button>
						))}
					</div>

					{/* Description */}
					{task.description && (
						<div>
							<h4 className="mb-1.5 text-sm font-medium">Description</h4>
							<p className="text-sm text-muted-foreground">
								{task.description}
							</p>
						</div>
					)}

					<Separator />

					{/* Details grid */}
					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<span className="flex items-center gap-2 text-sm text-muted-foreground">
								<UserIcon className="size-4" />
								Assignee
							</span>
							<Select
								value={String(task.assignee_id || "")}
								onValueChange={(v) => {
									handleFieldUpdate(
										"assignee_id",
										v ? Number.parseInt(v) : null,
									);
								}}
							>
								<SelectTrigger className="w-40">
									<SelectValue placeholder="Unassigned" />
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

						<div className="flex items-center justify-between">
							<span className="text-sm text-muted-foreground">Priority</span>
							<Select
								value={task.priority}
								onValueChange={(v) => v && handleFieldUpdate("priority", v)}
							>
								<SelectTrigger className="w-40">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{priorityOptions.map((opt) => (
										<SelectItem key={opt.value} value={opt.value}>
											{opt.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="flex items-center justify-between">
							<span className="flex items-center gap-2 text-sm text-muted-foreground">
								<CalendarDays className="size-4" />
								Due Date
							</span>
							<span className="text-sm">
								{task.due_date
									? new Date(task.due_date).toLocaleDateString("en-US", {
											month: "short",
											day: "numeric",
											year: "numeric",
										})
									: "Not set"}
							</span>
						</div>

						{task.project_name && (
							<div className="flex items-center justify-between">
								<span className="text-sm text-muted-foreground">Project</span>
								<div className="flex items-center gap-2">
									<div
										className="size-2 rounded-full"
										style={{
											backgroundColor: task.project_color || "#6366f1",
										}}
									/>
									<span className="text-sm">{task.project_name}</span>
								</div>
							</div>
						)}
					</div>

					<Separator />

					{/* Comments */}
					<div>
						<h4 className="mb-3 flex items-center gap-2 text-sm font-medium">
							<MessageSquare className="size-4" />
							Comments ({comments.length})
						</h4>
						<div className="space-y-3">
							{comments.map((comment) => (
								<div key={comment.id} className="flex gap-2.5">
									<UserAvatar
										name={comment.user_name}
										avatarUrl={comment.user_avatar || undefined}
										className="size-7 shrink-0"
									/>
									<div className="flex-1">
										<div className="flex items-baseline gap-2">
											<span className="text-sm font-medium">
												{comment.user_name}
											</span>
											<span className="text-xs text-muted-foreground">
												{getTimeAgo(comment.created_at)}
											</span>
										</div>
										<p className="mt-0.5 text-sm text-muted-foreground">
											{comment.content}
										</p>
									</div>
								</div>
							))}
							{comments.length === 0 && (
								<p className="py-3 text-center text-sm text-muted-foreground">
									No comments yet
								</p>
							)}
						</div>

						{/* Add comment */}
						<div className="mt-3 flex gap-2">
							<Textarea
								value={newComment}
								onChange={(e) => setNewComment(e.target.value)}
								placeholder="Add a comment..."
								rows={2}
								className="flex-1 resize-none"
								onKeyDown={(e) => {
									if (e.key === "Enter" && e.metaKey) handleAddComment();
								}}
							/>
							<Button
								size="icon"
								disabled={sending || !newComment.trim()}
								onClick={handleAddComment}
								className="shrink-0 self-end"
							>
								<Send className="size-4" />
							</Button>
						</div>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
