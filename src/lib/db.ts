import Database from "better-sqlite3";
import path from "node:path";

// Module-level singleton: one DB connection per process
let db: Database.Database | null = null;

export function getDb(): Database.Database {
	if (!db) {
		const dbPath = path.join(process.cwd(), "flowboard.db");
		db = new Database(dbPath);
		db.pragma("journal_mode = WAL");
		db.pragma("foreign_keys = ON");
		initializeTables(db);
		maybeSeed(db);
	}
	return db;
}

function initializeTables(db: Database.Database) {
	db.exec(`
		CREATE TABLE IF NOT EXISTS users (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL,
			email TEXT NOT NULL,
			avatar_url TEXT,
			role TEXT DEFAULT 'member',
			department TEXT,
			created_at TEXT DEFAULT (datetime('now','localtime'))
		);

		CREATE TABLE IF NOT EXISTS projects (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL,
			description TEXT,
			status TEXT DEFAULT 'active',
			color TEXT DEFAULT '#6366f1',
			start_date TEXT,
			due_date TEXT,
			created_by INTEGER,
			created_at TEXT DEFAULT (datetime('now','localtime')),
			FOREIGN KEY (created_by) REFERENCES users(id)
		);

		CREATE TABLE IF NOT EXISTS project_members (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			project_id INTEGER NOT NULL,
			user_id INTEGER NOT NULL,
			role TEXT DEFAULT 'member',
			FOREIGN KEY (project_id) REFERENCES projects(id),
			FOREIGN KEY (user_id) REFERENCES users(id)
		);

		CREATE TABLE IF NOT EXISTS tasks (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			project_id INTEGER NOT NULL,
			title TEXT NOT NULL,
			description TEXT,
			status TEXT DEFAULT 'todo',
			priority TEXT DEFAULT 'medium',
			assignee_id INTEGER,
			due_date TEXT,
			position INTEGER DEFAULT 0,
			created_by INTEGER,
			created_at TEXT DEFAULT (datetime('now','localtime')),
			updated_at TEXT DEFAULT (datetime('now','localtime')),
			FOREIGN KEY (project_id) REFERENCES projects(id),
			FOREIGN KEY (assignee_id) REFERENCES users(id),
			FOREIGN KEY (created_by) REFERENCES users(id)
		);

		CREATE TABLE IF NOT EXISTS task_labels (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			task_id INTEGER NOT NULL,
			label TEXT NOT NULL,
			color TEXT,
			FOREIGN KEY (task_id) REFERENCES tasks(id)
		);

		CREATE TABLE IF NOT EXISTS comments (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			task_id INTEGER NOT NULL,
			user_id INTEGER NOT NULL,
			content TEXT NOT NULL,
			created_at TEXT DEFAULT (datetime('now','localtime')),
			FOREIGN KEY (task_id) REFERENCES tasks(id),
			FOREIGN KEY (user_id) REFERENCES users(id)
		);

		CREATE TABLE IF NOT EXISTS activities (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			project_id INTEGER,
			task_id INTEGER,
			user_id INTEGER NOT NULL,
			action TEXT NOT NULL,
			description TEXT NOT NULL,
			created_at TEXT DEFAULT (datetime('now','localtime')),
			FOREIGN KEY (project_id) REFERENCES projects(id),
			FOREIGN KEY (task_id) REFERENCES tasks(id),
			FOREIGN KEY (user_id) REFERENCES users(id)
		);
	`);
}

function maybeSeed(db: Database.Database) {
	const row = db.prepare("SELECT COUNT(*) as count FROM users").get() as {
		count: number;
	};
	if (row.count === 0) {
		const { seed } = require("./seed");
		seed(db);
	}
}
