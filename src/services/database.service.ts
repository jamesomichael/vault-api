import Database from 'better-sqlite3';

const db = new Database('./db/vault.db');
// db.pragma('journal_mode = WAL');

const serialise = () => {
	db.exec(`\
		CREATE TABLE IF NOT EXISTS users (\
			id TEXT PRIMARY KEY NOT NULL,\
			username TEXT UNIQUE NOT NULL,\
			hashedPassword TEXT NOT NULL\
		);\
	`);

	db.exec(`\
		CREATE TABLE IF NOT EXISTS items (\
			id TEXT PRIMARY KEY,\
			type TEXT NOT NULL,\
			name TEXT NOT NULL,\
			username TEXT NOT NULL,\
			password TEXT NOT NULL,\
			uri TEXT NOT NULL,\
			folderId TEXT,\
			isFavourite INTEGER NOT NULL,\
			createdAt TEXT NOT NULL,\
			updatedAt TEXT NOT NULL,\
			deletedAt TEXT\
		);\
	`);
};

export default db;
export { serialise };
