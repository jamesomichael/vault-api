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

const fetchItems: RequestHandler = async (req, res): Promise<void> => {
	const userId = (req as AuthorisedRequest).user.id;
	try {
		const items = itemsModel.fetchItems(userId);
		res.status(200).json(items);
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error(`[itemsController: fetchItems] ${error.message}`);
		}
		res.status(500).json({ message: 'Something went wrong.' });
	}
};

const fetchItemById: RequestHandler = async (req, res): Promise<void> => {
	const { id } = req.params;
	const userId = (req as AuthorisedRequest).user.id;
	try {
		const item = itemsModel.fetchItemById(id, userId);
		if (!item) {
			res.status(404).json({ message: 'Item not found.' });
			return;
		}
		res.status(200).json(item);
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error(`[itemsController: fetchItemById] ${error.message}`);
		}
		res.status(500).json({ message: 'Something went wrong.' });
	}
};

const updateItem: RequestHandler = async (req, res): Promise<void> => {
	const { id } = req.params;
	const updates = req.body;
	const userId = (req as AuthorisedRequest).user.id;
	try {
		const item = itemsModel.fetchItemById(id, userId);
		if (!item) {
			res.status(404).json({ message: 'Item not found.' });
			return;
		}
		itemsModel.updateItem(updates, id, userId);
		const updatedItem = itemsModel.fetchItemById(id, userId);
		res.status(200).json(updatedItem);
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error(`[itemsController: updateItem] ${error.message}`);
		}
		res.status(500).json({ message: 'Something went wrong.' });
	}
};

export default { createItem, fetchItems, fetchItemById, updateItem };
