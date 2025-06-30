import Database from 'better-sqlite3';

const db = new Database('./db/vault.db');

const serialise = () => {
	db.exec(`\
		CREATE TABLE IF NOT EXISTS users (\
			id TEXT PRIMARY KEY NOT NULL,\
			username TEXT UNIQUE NOT NULL,\
			hashedPassword TEXT NOT NULL,\
			authSalt TEXT NOT NULL,\
			vaultSalt TEXT NOT NULL,\
			createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP\
		);\
	`);

	db.exec(`\
		CREATE TABLE IF NOT EXISTS items (\
			id TEXT PRIMARY KEY,\
			userId TEXT NOT NULL,\
			blob TEXT NOT NULL,\
			iv TEXT NOT NULL,\
			createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,\
			updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,\
			deletedAt TEXT\
		);\
	`);
};

export default db;
export { serialise };
