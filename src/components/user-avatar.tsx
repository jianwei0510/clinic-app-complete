import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
	name: string;
	avatarUrl?: string;
	className?: string;
}

function getInitials(name: string) {
	const parts = name.split(" ");
	return parts
		.map((p) => p[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
}

function getDiceBearUrl(name: string) {
	return `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=6366f1,8b5cf6,a78bfa,c4b5fd&backgroundType=solid&fontFamily=Inter&fontSize=40`;
}

export function UserAvatar({ name, avatarUrl, className }: UserAvatarProps) {
	const src = avatarUrl || getDiceBearUrl(name);

	return (
		<Avatar className={cn("size-8", className)}>
			<AvatarImage src={src} alt={name} />
			<AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
				{getInitials(name)}
			</AvatarFallback>
		</Avatar>
	);
}
