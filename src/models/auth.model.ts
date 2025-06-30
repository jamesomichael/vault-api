import jwt from 'jsonwebtoken';

import usersModel from './users.model';
import cryptoModel from './crypto.model';

import type { UserDto } from '../types/users';

const JWT_SECRET = process.env.JWT_SECRET!;

const getToken = (userId: string): string => {
	const payload = {
		user: {
			id: userId,
		},
	};
	const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
	return token;
};

const registerUser = async (username: string, password: string) => {
	try {
		const authSalt = cryptoModel.generateSalt();
		const vaultSalt = cryptoModel.generateSalt();
		const hashedPassword = await cryptoModel.generateHashedPassword(
			password,
			authSalt
		);
		console.log('[authModel: createUser] Storing user in database...');
		const user = usersModel.createUser(
			username,
			hashedPassword,
			authSalt,
			vaultSalt
		);
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
	const user: UserDto | undefined = await usersModel.getUser(username);
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

export default { registerUser, logInUser };
