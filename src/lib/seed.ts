import type Database from "better-sqlite3";

// Helper: get date relative to today
function daysFromNow(days: number): string {
	const d = new Date();
	d.setDate(d.getDate() + days);
	return d.toISOString().split("T")[0];
}

function datetimeFromNow(days: number, hours = 0): string {
	const d = new Date();
	d.setDate(d.getDate() + days);
	d.setHours(d.getHours() + hours, 0, 0, 0);
	return d.toISOString().replace("T", " ").slice(0, 19);
}

export function seed(db: Database.Database) {
	const seedAll = db.transaction(() => {
		// ── Users ──
		const insertUser = db.prepare(
			`INSERT INTO users (name, email, avatar_url, role, department) VALUES (?, ?, ?, ?, ?)`,
		);

		const users = [
			["Alex Chen", "alex@flowboard.io", null, "Product Manager", "Product"],
			["Sarah Kim", "sarah@flowboard.io", null, "UI/UX Designer", "Design"],
			[
				"Marcus Johnson",
				"marcus@flowboard.io",
				null,
				"Frontend Developer",
				"Engineering",
			],
			[
				"Emily Davis",
				"emily@flowboard.io",
				null,
				"Backend Developer",
				"Engineering",
			],
			[
				"James Wilson",
				"james@flowboard.io",
				null,
				"Full Stack Developer",
				"Engineering",
			],
			["Priya Patel", "priya@flowboard.io", null, "QA Engineer", "Quality"],
			[
				"David Thompson",
				"david@flowboard.io",
				null,
				"DevOps Engineer",
				"Infrastructure",
			],
			[
				"Lisa Wang",
				"lisa@flowboard.io",
				null,
				"Marketing Lead",
				"Marketing",
			],
		];
		for (const u of users) insertUser.run(...u);

		// ── Projects ──
		const insertProject = db.prepare(
			`INSERT INTO projects (name, description, status, color, start_date, due_date, created_by)
			 VALUES (?, ?, ?, ?, ?, ?, ?)`,
		);

		const projects = [
			[
				"Website Redesign",
				"Complete overhaul of the company website with modern design system and improved performance metrics.",
				"active",
				"#6366f1",
				daysFromNow(-30),
				daysFromNow(30),
				1,
			],
			[
				"Mobile App v2",
				"Major update to the mobile application with new features, improved UX, and cross-platform support.",
				"active",
				"#f59e0b",
				daysFromNow(-14),
				daysFromNow(45),
				1,
			],
			[
				"API Migration",
				"Migrate legacy REST endpoints to GraphQL with improved documentation and rate limiting.",
				"active",
				"#10b981",
				daysFromNow(-21),
				daysFromNow(21),
				4,
			],
			[
				"Marketing Campaign",
				"Q2 product launch campaign including social media, email sequences, and landing pages.",
				"active",
				"#ec4899",
				daysFromNow(-7),
				daysFromNow(60),
				8,
			],
			[
				"Design System",
				"Build a unified component library and design tokens for consistent UI across all products.",
				"active",
				"#8b5cf6",
				daysFromNow(-45),
				daysFromNow(15),
				2,
			],
		];
		for (const p of projects) insertProject.run(...p);

		// ── Project Members ──
		const insertMember = db.prepare(
			`INSERT INTO project_members (project_id, user_id, role) VALUES (?, ?, ?)`,
		);
		// Project 1: Website Redesign
		insertMember.run(1, 1, "owner");
		insertMember.run(1, 2, "member");
		insertMember.run(1, 3, "member");
		insertMember.run(1, 5, "member");
		insertMember.run(1, 6, "member");
		// Project 2: Mobile App v2
		insertMember.run(2, 1, "owner");
		insertMember.run(2, 3, "member");
		insertMember.run(2, 4, "member");
		insertMember.run(2, 5, "member");
		insertMember.run(2, 6, "member");
		// Project 3: API Migration
		insertMember.run(3, 4, "owner");
		insertMember.run(3, 5, "member");
		insertMember.run(3, 7, "member");
		// Project 4: Marketing Campaign
		insertMember.run(4, 8, "owner");
		insertMember.run(4, 1, "member");
		insertMember.run(4, 2, "member");
		// Project 5: Design System
		insertMember.run(5, 2, "owner");
		insertMember.run(5, 3, "member");
		insertMember.run(5, 1, "member");

		// ── Tasks ──
		const insertTask = db.prepare(
			`INSERT INTO tasks (project_id, title, description, status, priority, assignee_id, due_date, position, created_by)
			 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		);

		const tasks: (string | number | null)[][] = [
			// Project 1: Website Redesign (12 tasks)
			[1, "Design new homepage layout", "Create wireframes and mockups for the homepage hero section, feature grid, and CTA areas.", "done", "high", 2, daysFromNow(-5), 0, 1],
			[1, "Implement responsive navigation", "Build the main nav with mobile hamburger menu, dropdown submenus, and scroll behavior.", "done", "high", 3, daysFromNow(-3), 1, 1],
			[1, "Set up design tokens", "Configure color palette, typography scale, spacing, and shadow tokens in Tailwind config.", "done", "medium", 2, daysFromNow(-7), 2, 2],
			[1, "Build hero section component", "Implement the animated hero section with background video and CTA buttons.", "in_progress", "high", 3, daysFromNow(2), 3, 1],
			[1, "Create testimonials carousel", "Build a testimonial slider with customer quotes, avatars, and company logos.", "in_progress", "medium", 5, daysFromNow(5), 4, 1],
			[1, "Implement contact form", "Build the contact page form with validation, captcha, and email integration.", "todo", "medium", 3, daysFromNow(7), 5, 1],
			[1, "Performance audit", "Run Lighthouse audit and fix performance issues. Target score: 95+.", "todo", "high", 5, daysFromNow(10), 6, 1],
			[1, "SEO optimization", "Implement meta tags, structured data, sitemap, and Open Graph tags.", "todo", "medium", 3, daysFromNow(12), 7, 1],
			[1, "Cross-browser testing", "Test all pages on Chrome, Firefox, Safari, and Edge. Fix any rendering issues.", "todo", "low", 6, daysFromNow(14), 8, 6],
			[1, "Accessibility review", "Run WCAG 2.1 AA audit and fix all critical accessibility issues.", "in_review", "high", 6, daysFromNow(1), 9, 1],
			[1, "Footer redesign", "Update footer with new layout, social links, newsletter signup, and sitemap.", "in_progress", "low", 5, daysFromNow(3), 10, 2],
			[1, "Image optimization pipeline", "Set up automatic image compression and WebP conversion in the build pipeline.", "in_review", "medium", 5, daysFromNow(0), 11, 3],

			// Project 2: Mobile App v2 (11 tasks)
			[2, "Design new onboarding flow", "Create a 4-step onboarding wizard with personalization options.", "done", "high", 2, daysFromNow(-4), 0, 1],
			[2, "Implement push notifications", "Set up Firebase Cloud Messaging for iOS and Android with deep linking.", "in_progress", "urgent", 4, daysFromNow(1), 1, 1],
			[2, "Build offline sync engine", "Implement local-first data storage with background sync when connection is restored.", "in_progress", "high", 5, daysFromNow(5), 2, 4],
			[2, "Redesign settings screen", "Update settings with new grouped sections and improved navigation.", "todo", "medium", 3, daysFromNow(8), 3, 1],
			[2, "Add biometric authentication", "Integrate Face ID and fingerprint login with secure token storage.", "todo", "high", 4, daysFromNow(10), 4, 1],
			[2, "Performance profiling", "Profile app startup time, memory usage, and identify bottlenecks.", "todo", "medium", 6, daysFromNow(15), 5, 6],
			[2, "Dark mode implementation", "Implement system-aware dark mode with manual toggle option.", "in_review", "medium", 3, daysFromNow(0), 6, 2],
			[2, "Crash reporting setup", "Integrate Sentry for crash reporting with source maps and breadcrumbs.", "done", "high", 7, daysFromNow(-6), 7, 7],
			[2, "App store screenshots", "Create new promotional screenshots for App Store and Google Play.", "todo", "low", 2, daysFromNow(20), 8, 8],
			[2, "Beta testing coordination", "Set up TestFlight and Google Play beta channels, recruit testers.", "in_progress", "medium", 1, daysFromNow(3), 9, 1],
			[2, "API client update", "Update mobile API client to use new v2 endpoints with improved caching.", "in_progress", "high", 5, daysFromNow(4), 10, 4],

			// Project 3: API Migration (10 tasks)
			[3, "Schema design", "Design GraphQL schema with types, queries, mutations, and subscriptions.", "done", "urgent", 4, daysFromNow(-10), 0, 4],
			[3, "Set up GraphQL server", "Configure Apollo Server with Express, auth middleware, and error handling.", "done", "high", 4, daysFromNow(-8), 1, 4],
			[3, "Migrate user endpoints", "Convert user CRUD REST endpoints to GraphQL resolvers.", "done", "high", 5, daysFromNow(-3), 2, 4],
			[3, "Migrate product endpoints", "Convert product catalog REST endpoints to GraphQL with pagination.", "in_progress", "high", 5, daysFromNow(2), 3, 4],
			[3, "Implement rate limiting", "Add rate limiting per IP and per authenticated user with Redis.", "todo", "medium", 7, daysFromNow(7), 4, 4],
			[3, "Write API documentation", "Generate and review API docs using GraphQL introspection and Markdown.", "todo", "medium", 4, daysFromNow(10), 5, 1],
			[3, "Integration tests", "Write comprehensive integration tests for all GraphQL resolvers.", "todo", "high", 6, daysFromNow(12), 6, 6],
			[3, "Set up monitoring", "Configure DataDog APM for GraphQL query performance monitoring.", "in_review", "medium", 7, daysFromNow(1), 7, 7],
			[3, "Legacy endpoint deprecation plan", "Create timeline and communication plan for deprecating REST endpoints.", "in_progress", "low", 1, daysFromNow(5), 8, 1],
			[3, "Load testing", "Run k6 load tests simulating 10K concurrent users on new endpoints.", "todo", "high", 7, daysFromNow(14), 9, 7],

			// Project 4: Marketing Campaign (8 tasks)
			[4, "Campaign strategy doc", "Draft the comprehensive marketing strategy with channels, budget, and KPIs.", "done", "urgent", 8, daysFromNow(-5), 0, 8],
			[4, "Design email templates", "Create 5 responsive email templates for the drip campaign sequence.", "in_progress", "high", 2, daysFromNow(3), 1, 8],
			[4, "Build landing page", "Create high-converting landing page with A/B test variants.", "in_progress", "high", 3, daysFromNow(5), 2, 8],
			[4, "Social media content calendar", "Plan 30 days of social content across Twitter, LinkedIn, and Instagram.", "todo", "medium", 8, daysFromNow(7), 3, 8],
			[4, "Set up analytics tracking", "Configure UTM tracking, conversion funnels, and attribution model.", "todo", "high", 7, daysFromNow(4), 4, 8],
			[4, "Write blog posts", "Draft 3 blog posts supporting the campaign narrative.", "todo", "medium", 8, daysFromNow(10), 5, 8],
			[4, "Prepare press kit", "Compile media kit with product shots, bios, fact sheet, and press release.", "in_review", "low", 8, daysFromNow(1), 6, 1],
			[4, "Influencer outreach", "Contact 15 industry influencers for partnership opportunities.", "todo", "medium", 8, daysFromNow(14), 7, 8],

			// Project 5: Design System (11 tasks)
			[5, "Audit existing components", "Catalog all current UI components and identify inconsistencies.", "done", "high", 2, daysFromNow(-14), 0, 2],
			[5, "Define color system", "Create semantic color tokens with light/dark variants and accessibility contrast ratios.", "done", "high", 2, daysFromNow(-10), 1, 2],
			[5, "Build Button component", "Create Button with size, variant, loading, and icon support.", "done", "medium", 3, daysFromNow(-7), 2, 2],
			[5, "Build Input components", "Create Input, Textarea, Select, Checkbox, Radio, and Toggle components.", "done", "medium", 3, daysFromNow(-4), 3, 2],
			[5, "Build Card component", "Create Card with header, body, footer sections and elevation variants.", "in_progress", "medium", 3, daysFromNow(1), 4, 2],
			[5, "Build Modal component", "Create accessible modal with focus trap, animations, and size variants.", "in_progress", "high", 3, daysFromNow(3), 5, 2],
			[5, "Build data table component", "Create sortable, filterable data table with pagination and row selection.", "todo", "high", 3, daysFromNow(7), 6, 2],
			[5, "Write documentation site", "Build Storybook-like documentation with live examples and API reference.", "todo", "medium", 2, daysFromNow(10), 7, 1],
			[5, "Create Figma library", "Mirror all coded components in Figma with auto-layout and variants.", "in_review", "high", 2, daysFromNow(0), 8, 2],
			[5, "Typography scale", "Define heading, body, and caption type styles with responsive scaling.", "done", "medium", 2, daysFromNow(-8), 9, 2],
			[5, "Icon library curation", "Select and standardize icon set, create icon component with size props.", "in_progress", "low", 2, daysFromNow(2), 10, 2],
		];

		for (const t of tasks) insertTask.run(...t);

		// ── Task Labels ──
		const insertLabel = db.prepare(
			`INSERT INTO task_labels (task_id, label, color) VALUES (?, ?, ?)`,
		);
		insertLabel.run(1, "design", "#8b5cf6");
		insertLabel.run(2, "frontend", "#3b82f6");
		insertLabel.run(4, "frontend", "#3b82f6");
		insertLabel.run(4, "animation", "#ec4899");
		insertLabel.run(7, "performance", "#f59e0b");
		insertLabel.run(10, "a11y", "#10b981");
		insertLabel.run(13, "design", "#8b5cf6");
		insertLabel.run(13, "ux", "#ec4899");
		insertLabel.run(14, "backend", "#10b981");
		insertLabel.run(14, "urgent", "#ef4444");
		insertLabel.run(15, "backend", "#10b981");
		insertLabel.run(19, "security", "#ef4444");
		insertLabel.run(23, "backend", "#10b981");
		insertLabel.run(24, "backend", "#10b981");
		insertLabel.run(35, "design", "#8b5cf6");
		insertLabel.run(38, "frontend", "#3b82f6");

		// ── Comments ──
		const insertComment = db.prepare(
			`INSERT INTO comments (task_id, user_id, content, created_at) VALUES (?, ?, ?, ?)`,
		);

		const comments: [number, number, string, string][] = [
			[4, 2, "I've uploaded the mockups to Figma. Check the 'Hero v2' page for the latest designs.", datetimeFromNow(-2, 3)],
			[4, 3, "Looks great! I'll start implementing the animation using Framer Motion. Should be ready by EOD tomorrow.", datetimeFromNow(-2, 5)],
			[4, 1, "Let's make sure the animation is subtle and doesn't impact Core Web Vitals.", datetimeFromNow(-1, 2)],
			[5, 5, "Should we use Swiper or build a custom carousel? Swiper has better mobile touch support.", datetimeFromNow(-1, 4)],
			[5, 1, "Let's go with Swiper for reliability. We can customize the styling.", datetimeFromNow(-1, 6)],
			[10, 6, "Found 12 WCAG violations. Most are contrast ratio issues with the gray text on light backgrounds.", datetimeFromNow(-1, 1)],
			[10, 2, "I'll update the color tokens to fix contrast. Should we also add skip navigation links?", datetimeFromNow(0, -4)],
			[14, 4, "Firebase setup is done. We need to decide on notification categories and quiet hours handling.", datetimeFromNow(-1, 3)],
			[14, 1, "Categories: alerts, updates, social, marketing. Default quiet hours: 10pm-8am.", datetimeFromNow(-1, 5)],
			[15, 5, "Using IndexedDB for local storage with a custom sync queue. Initial implementation is working.", datetimeFromNow(-2, 2)],
			[15, 4, "Make sure to handle conflict resolution. Last-write-wins might cause data loss.", datetimeFromNow(-1, 8)],
			[15, 5, "Good point. I'll implement a merge strategy with user-facing conflict UI for critical data.", datetimeFromNow(-1, 9)],
			[23, 4, "The schema is finalized. I've posted the RFC in Notion for team review.", datetimeFromNow(-8, 2)],
			[26, 5, "Product endpoints are 60% done. The nested relations are trickier than expected.", datetimeFromNow(-1, 6)],
			[26, 4, "Consider using DataLoader for the N+1 problem. Happy to pair on this tomorrow.", datetimeFromNow(-1, 7)],
			[32, 8, "Draft is ready for review. Budget breakdown is in the appendix.", datetimeFromNow(-4, 3)],
			[32, 1, "Looks solid. Let's increase the paid social budget by 15% and reduce print.", datetimeFromNow(-3, 5)],
			[33, 2, "Email templates are 3/5 done. The product announcement template is my favorite so far.", datetimeFromNow(0, -6)],
			[34, 3, "Landing page wireframe is approved. Starting to build with our design system components.", datetimeFromNow(-1, 2)],
			[39, 2, "Color system documentation is live. Check the new contrast checker tool I added.", datetimeFromNow(-9, 4)],
			[41, 3, "Button component is ready for review. Includes 5 variants, 3 sizes, and icon support.", datetimeFromNow(-6, 2)],
			[41, 2, "Reviewed and approved! Small note: add focus-visible ring for keyboard navigation.", datetimeFromNow(-6, 5)],
			[45, 3, "Modal is tricky with iOS Safari viewport handling. Working on a fix.", datetimeFromNow(-1, 3)],
			[45, 2, "Try using dvh units instead of vh. That should fix the iOS bottom bar issue.", datetimeFromNow(-1, 5)],
			[48, 2, "Figma library is nearly done. Auto-layout works perfectly with the spacing tokens.", datetimeFromNow(0, -8)],
			[48, 1, "This is looking amazing. Can we get a walkthrough video for the team?", datetimeFromNow(0, -6)],
			[21, 3, "Dark mode toggle animation is smooth. Using CSS transitions on the color variables.", datetimeFromNow(-2, 4)],
			[21, 2, "Love the transition! Make sure the user's preference persists across sessions.", datetimeFromNow(-1, 2)],
			[12, 5, "WebP conversion is saving 40-60% on image sizes. Build time increased by ~5s.", datetimeFromNow(-1, 7)],
			[12, 3, "Can we run the optimization in parallel? That should cut the build time increase.", datetimeFromNow(0, -3)],
			[35, 3, "A/B variant B has 23% higher click-through in early testing.", datetimeFromNow(0, -5)],
			[31, 7, "Monitoring dashboard is set up. Query latency P95 is at 45ms.", datetimeFromNow(-1, 4)],
			[22, 1, "Great work on the beta setup! First round of feedback is coming in.", datetimeFromNow(0, -7)],
			[37, 7, "Analytics tracking is partially implemented. UTM parsing is done.", datetimeFromNow(0, -2)],
			[9, 6, "Safari has a minor flexbox issue in the footer. Fixing now.", datetimeFromNow(0, -1)],
		];
		for (const c of comments) insertComment.run(...c);

		// ── Activities ──
		const insertActivity = db.prepare(
			`INSERT INTO activities (project_id, task_id, user_id, action, description, created_at)
			 VALUES (?, ?, ?, ?, ?, ?)`,
		);

		const activities: [number | null, number | null, number, string, string, string][] = [
			[1, 1, 2, "completed", "completed \"Design new homepage layout\"", datetimeFromNow(-5, 2)],
			[1, 2, 3, "completed", "completed \"Implement responsive navigation\"", datetimeFromNow(-3, 4)],
			[1, 3, 2, "completed", "completed \"Set up design tokens\"", datetimeFromNow(-7, 6)],
			[5, 38, 2, "completed", "completed \"Audit existing components\"", datetimeFromNow(-14, 3)],
			[5, 39, 2, "completed", "completed \"Define color system\"", datetimeFromNow(-10, 5)],
			[5, 40, 3, "completed", "completed \"Build Button component\"", datetimeFromNow(-7, 2)],
			[5, 41, 3, "completed", "completed \"Build Input components\"", datetimeFromNow(-4, 7)],
			[3, 23, 4, "completed", "completed \"Schema design\"", datetimeFromNow(-10, 4)],
			[3, 24, 4, "completed", "completed \"Set up GraphQL server\"", datetimeFromNow(-8, 5)],
			[3, 25, 5, "completed", "completed \"Migrate user endpoints\"", datetimeFromNow(-3, 6)],
			[2, 13, 2, "completed", "completed \"Design new onboarding flow\"", datetimeFromNow(-4, 3)],
			[2, 20, 7, "completed", "completed \"Crash reporting setup\"", datetimeFromNow(-6, 4)],
			[4, 32, 8, "completed", "completed \"Campaign strategy doc\"", datetimeFromNow(-5, 5)],
			[1, 4, 3, "status_change", "moved \"Build hero section component\" to In Progress", datetimeFromNow(-2, 3)],
			[1, 5, 5, "status_change", "moved \"Create testimonials carousel\" to In Progress", datetimeFromNow(-1, 2)],
			[1, 10, 6, "status_change", "moved \"Accessibility review\" to In Review", datetimeFromNow(-1, 5)],
			[1, 12, 5, "status_change", "moved \"Image optimization pipeline\" to In Review", datetimeFromNow(0, -4)],
			[2, 14, 4, "status_change", "moved \"Implement push notifications\" to In Progress", datetimeFromNow(-1, 3)],
			[2, 15, 5, "status_change", "moved \"Build offline sync engine\" to In Progress", datetimeFromNow(-2, 4)],
			[2, 19, 3, "status_change", "moved \"Dark mode implementation\" to In Review", datetimeFromNow(0, -3)],
			[3, 26, 5, "status_change", "moved \"Migrate product endpoints\" to In Progress", datetimeFromNow(-1, 6)],
			[3, 30, 7, "status_change", "moved \"Set up monitoring\" to In Review", datetimeFromNow(0, -2)],
			[4, 33, 2, "status_change", "moved \"Design email templates\" to In Progress", datetimeFromNow(-1, 4)],
			[4, 34, 3, "status_change", "moved \"Build landing page\" to In Progress", datetimeFromNow(-1, 5)],
			[4, 38, 8, "status_change", "moved \"Prepare press kit\" to In Review", datetimeFromNow(0, -5)],
			[5, 44, 3, "status_change", "moved \"Build Card component\" to In Progress", datetimeFromNow(-1, 3)],
			[5, 45, 3, "status_change", "moved \"Build Modal component\" to In Progress", datetimeFromNow(-1, 6)],
			[5, 48, 2, "status_change", "moved \"Create Figma library\" to In Review", datetimeFromNow(0, -7)],
			[1, 4, 1, "comment", "commented on \"Build hero section component\"", datetimeFromNow(-1, 2)],
			[2, 14, 1, "comment", "commented on \"Implement push notifications\"", datetimeFromNow(-1, 5)],
			[2, 15, 4, "comment", "commented on \"Build offline sync engine\"", datetimeFromNow(-1, 8)],
			[3, 26, 4, "comment", "commented on \"Migrate product endpoints\"", datetimeFromNow(-1, 7)],
			[4, 32, 1, "comment", "commented on \"Campaign strategy doc\"", datetimeFromNow(-3, 5)],
			[5, 48, 1, "comment", "commented on \"Create Figma library\"", datetimeFromNow(0, -6)],
			[1, null, 1, "member_added", "added Priya Patel to \"Website Redesign\"", datetimeFromNow(-12, 2)],
			[2, null, 1, "member_added", "added James Wilson to \"Mobile App v2\"", datetimeFromNow(-13, 3)],
			[1, 6, 1, "created", "created task \"Implement contact form\"", datetimeFromNow(-3, 2)],
			[1, 7, 1, "created", "created task \"Performance audit\"", datetimeFromNow(-3, 3)],
			[2, 18, 1, "created", "created task \"Redesign settings screen\"", datetimeFromNow(-2, 4)],
			[2, 19, 1, "created", "created task \"Add biometric authentication\"", datetimeFromNow(-2, 5)],
			[3, 27, 4, "created", "created task \"Implement rate limiting\"", datetimeFromNow(-5, 3)],
			[4, 36, 8, "created", "created task \"Social media content calendar\"", datetimeFromNow(-2, 2)],
			[5, 46, 2, "created", "created task \"Build data table component\"", datetimeFromNow(-3, 5)],
			[5, 49, 2, "created", "created task \"Typography scale\"", datetimeFromNow(-8, 2)],
			[5, 50, 2, "created", "created task \"Icon library curation\"", datetimeFromNow(-2, 3)],
		];
		for (const a of activities) insertActivity.run(...a);
	});

	seedAll();
}
