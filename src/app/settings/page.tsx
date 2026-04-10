"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export default function SettingsPage() {
	const [saved, setSaved] = useState(false);

	function handleSave() {
		setSaved(true);
		setTimeout(() => setSaved(false), 2000);
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold tracking-tight">Settings</h1>
				<p className="text-muted-foreground">
					Manage your workspace preferences.
				</p>
			</div>

			<div className="max-w-2xl space-y-6">
				{/* Workspace */}
				<Card>
					<CardHeader>
						<CardTitle className="text-base">Workspace</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="workspace-name">Workspace Name</Label>
							<Input
								id="workspace-name"
								defaultValue="FlowBoard Workspace"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="workspace-desc">Description</Label>
							<Textarea
								id="workspace-desc"
								defaultValue="A modern project management platform for high-performing teams."
								rows={3}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="workspace-url">Workspace URL</Label>
							<Input
								id="workspace-url"
								defaultValue="flowboard.io/workspace"
								readOnly
								className="text-muted-foreground"
							/>
						</div>
					</CardContent>
				</Card>

				{/* Notifications */}
				<Card>
					<CardHeader>
						<CardTitle className="text-base">Notifications</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium">Email Notifications</p>
								<p className="text-xs text-muted-foreground">
									Receive email updates for task assignments and mentions.
								</p>
							</div>
							<Switch defaultChecked />
						</div>
						<Separator />
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium">Push Notifications</p>
								<p className="text-xs text-muted-foreground">
									Get browser push notifications for urgent updates.
								</p>
							</div>
							<Switch defaultChecked />
						</div>
						<Separator />
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium">Weekly Digest</p>
								<p className="text-xs text-muted-foreground">
									Receive a weekly summary of project progress.
								</p>
							</div>
							<Switch />
						</div>
						<Separator />
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium">Activity Alerts</p>
								<p className="text-xs text-muted-foreground">
									Notify when team members complete tasks or add comments.
								</p>
							</div>
							<Switch defaultChecked />
						</div>
					</CardContent>
				</Card>

				{/* Appearance */}
				<Card>
					<CardHeader>
						<CardTitle className="text-base">Appearance</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium">Dark Mode</p>
								<p className="text-xs text-muted-foreground">
									Toggle between light and dark theme.
								</p>
							</div>
							<Switch disabled />
						</div>
						<p className="mt-2 text-xs text-muted-foreground italic">
							Coming soon
						</p>
					</CardContent>
				</Card>

				{/* Save */}
				<div className="flex items-center gap-3">
					<Button onClick={handleSave}>
						{saved ? "Saved!" : "Save Changes"}
					</Button>
					{saved && (
						<span className="text-sm text-green-600">
							Settings saved successfully.
						</span>
					)}
				</div>
			</div>
		</div>
	);
}
