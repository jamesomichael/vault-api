import { RequestHandler } from 'express';

import authModel from '../models/auth.model';
import usersModel from '../models/users.model';

import { AuthorisedRequest } from '../types/auth';

const register: RequestHandler = async (req, res): Promise<void> => {
	const { username, password } = req.body;
	try {
		console.log(
			`[authController: register] Attempting to register user ${username}...`
		);
		if (usersModel.getUser(username)) {
			console.log('[authController: register]: User already exists.');
			res.status(409).json({ message: 'User already exists.' });
			return;
		}

		const { user, token } = await authModel.registerUser(
			username,
			password
		);
		res.status(200)
			.cookie('token', token, {
				httpOnly: true,
				secure: true,
				sameSite: 'strict',
				maxAge: 1000 * 60 * 60 * 1,
			})
			.json({ token, user });
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error(`[authController: register] ${error.message}`);
		}
		res.status(500).json({ message: 'Something went wrong.' });
	}
};

const login: RequestHandler = async (req, res): Promise<void> => {
	const { username, password } = req.body;
	try {
		console.log(
			`[authController: login] Attempting to log in user ${username}...`
		);
		const { user, token } = await authModel.logInUser(username, password);
		res.status(200)
			.cookie('token', token, {
				httpOnly: true,
				secure: true,
				sameSite: 'strict',
				maxAge: 1000 * 60 * 60 * 1,
			})
			.json({ token, user });
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error(`[authController: login] ${error.message}`);
			if (/Invalid credentials/.test(error.message)) {
				res.status(401).json({ message: error.message });
				return;
			}
		}
		res.status(500).json({ message: 'Something went wrong.' });
	}
};

const logout: RequestHandler = async (req, res): Promise<void> => {
	const userId = (req as AuthorisedRequest).user.id;
	console.log(`[authController: logout] Logging out user ${userId}...`);
	res.clearCookie('token', {
		httpOnly: true,
		secure: true,
		sameSite: 'strict',
	});
	res.status(204).send();
};

export default {
	register,
	login,
	logout,
};
