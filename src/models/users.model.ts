import { v4 as uuidv4 } from 'uuid';

import db from '../services/database.service';

import type { LocalUserDto, UserDto } from '../types/users';

const getUser = (username: string): UserDto | undefined => {
	const statement = db.prepare('SELECT * FROM users WHERE username = ?');
	const user = statement.get(username) as UserDto | undefined;
	return user;
};

const fetchLocalUsers = (): LocalUserDto[] => {
	const statement = db.prepare('SELECT id, username FROM users');
	const items = statement.all() as LocalUserDto[];
	return items;
};

const createUser = (
	username: string,
	hashedPassword: string,
	authSalt: string,
	vaultSalt: string
): UserDto => {
	const user = {
		id: uuidv4(),
		username,
		hashedPassword,
		authSalt,
		vaultSalt,
	};
	const statement = db.prepare(
		'INSERT INTO users (id, username, hashedPassword, authSalt, vaultSalt) VALUES (@id, @username, @hashedPassword, @authSalt, @vaultSalt)'
	);
	statement.run(user);
	return user;
};

export default { getUser, fetchLocalUsers, createUser };
