import { RequestHandler } from 'express';

import authModel from '../models/auth.model';

const register: RequestHandler = async (req, res): Promise<void> => {
	const { username, password } = req.body;
	try {
		console.log(
			`[authController: register] Attempting to register user ${username}...`
		);
		if (authModel.getUser(username)) {
			console.log('[authController: register]: User already exists.');
			res.status(409).json({ message: 'User already exists.' });
			return;
		}

		const { user, token } = await authModel.createUser(username, password);
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

export default {
	register,
	login,
};
