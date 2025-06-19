import * as argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

import db from '../services/database.service';

const JWT_SECRET = process.env.JWT_SECRET!;

const getUser = (username: string) => {
	const statement = db.prepare('SELECT * FROM users WHERE username = ?');
	const user = statement.get(username);
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

const generateHashedPassword = async (password: string) => {
	const hashedPassword = await argon2.hash(password);
	return hashedPassword;
};

const createUser = async (username: string, password: string) => {
	try {
		const hashedPassword = await generateHashedPassword(password);
		console.log('[authModel: createUser] Storing user in database...');
		const user = {
			id: uuidv4(),
			username,
			hashedPassword,
		};

		const statement = db.prepare(
			'INSERT INTO users (id, username, hashedPassword) VALUES (@id, @username, @hashedPassword)'
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
	const user = await getUser(username);
	console.log(user);
	if (!user) {
		console.error(`[authModel: logInUser] No user found.`);
		throw new Error('Invalid credentials.');
	}

	const isValid = await argon2.verify(user.hashedPassword, password);
	if (!isValid) {
		console.error(`[authModel: logInUser] Invalid credentials provided.`);
		throw new Error('Invalid credentials.');
	}

	const token = getToken(user.id);
	return { token, user };
};

export default { getUser, createUser, logInUser };
