export interface User {
	id: number;
	name: string;
	email: string;
	avatar_url: string | null;
	role: string;
	department: string;
	created_at: string;
}

export interface Project {
	id: number;
	name: string;
	description: string | null;
	status: "active" | "archived" | "completed";
	color: string;
	start_date: string | null;
	due_date: string | null;
	created_by: number;
	created_at: string;
}

export interface ProjectWithStats extends Project {
	task_count: number;
	completed_count: number;
	member_count: number;
}

export interface ProjectMember {
	id: number;
	project_id: number;
	user_id: number;
	role: string;
}

export interface Task {
	id: number;
	project_id: number;
	title: string;
	description: string | null;
	status: "todo" | "in_progress" | "in_review" | "done";
	priority: "low" | "medium" | "high" | "urgent";
	assignee_id: number | null;
	due_date: string | null;
	position: number;
	created_by: number;
	created_at: string;
	updated_at: string;
}

export interface TaskWithDetails extends Task {
	assignee_name: string | null;
	assignee_avatar: string | null;
	project_name: string | null;
	project_color: string | null;
	comment_count: number;
}

export interface TaskLabel {
	id: number;
	task_id: number;
	label: string;
	color: string;
}

export interface Comment {
	id: number;
	task_id: number;
	user_id: number;
	content: string;
	created_at: string;
}

export interface CommentWithUser extends Comment {
	user_name: string;
	user_avatar: string | null;
}

export interface Activity {
	id: number;
	project_id: number | null;
	task_id: number | null;
	user_id: number;
	action: string;
	description: string;
	created_at: string;
}

export interface ActivityWithUser extends Activity {
	user_name: string;
	user_avatar: string | null;
}

export interface DashboardStats {
	totalProjects: number;
	activeTasks: number;
	completedThisWeek: number;
	teamMembers: number;
}
