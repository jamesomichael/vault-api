import { RequestHandler } from 'express';

import usersModel from '../models/users.model';

const fetchLocalUsers: RequestHandler = async (req, res): Promise<void> => {
	try {
		const users = usersModel.fetchLocalUsers();
		res.status(200).json(users);
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error(
				`[usersController: fetchLocalUsers] ${error.message}`
			);
		}
		res.status(500).json({ message: 'Something went wrong.' });
	}
};

export default { fetchLocalUsers };
