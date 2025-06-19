import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

import db from '../services/database.service';
import cryptoModel from './crypto.model';

import { User } from '../types/auth';

const JWT_SECRET = process.env.JWT_SECRET!;

const getUser = (username: string): User | undefined => {
	const statement = db.prepare('SELECT * FROM users WHERE username = ?');
	const user = statement.get(username) as User | undefined;
	return user;
};

const getToken = (userId: string): string => {
	const payload = {
		user: {
			id: userId,
		},
	};
	const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
	return token;
};

const createUser = async (username: string, password: string) => {
	try {
		const authSalt = cryptoModel.generateSalt();
		const vaultSalt = cryptoModel.generateSalt();
		const hashedPassword = await cryptoModel.generateHashedPassword(
			password,
			authSalt
		);
		console.log('[authModel: createUser] Storing user in database...');
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
		console.log('[authModel: createUser] User saved.');
		const token = getToken(user.id);
		return { token, user };
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error(`[authModel: createUser] ${error.message}`);
		}
		throw error;
	}
};

const logInUser = async (username: string, password: string) => {
	const user: User | undefined = await getUser(username);
	if (!user) {
		console.error(`[authModel: logInUser] No user found.`);
		throw new Error('Invalid credentials.');
	}

	const isValid = await cryptoModel.verifyPassword(
		user.hashedPassword,
		password
	);
	if (!isValid) {
		console.error(`[authModel: logInUser] Invalid credentials provided.`);
		throw new Error('Invalid credentials.');
	}

	const token = getToken(user.id);
	return { token, user };
};

export default { getUser, createUser, logInUser };
