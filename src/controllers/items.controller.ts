import { RequestHandler } from 'express';

import itemsModel from '../models/items.model';

import { AuthorisedRequest } from '../types/auth';

const createItem: RequestHandler = async (req, res): Promise<void> => {
	const { blob, iv } = req.body;
	const userId = (req as AuthorisedRequest).user.id;
	try {
		const item = itemsModel.createItem({ blob, iv }, userId);
		res.status(200).json(item);
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error(`[itemsController: createItem] ${error.message}`);
		}
		res.status(500).json({ message: 'Something went wrong.' });
	}
};

export default { createItem };
