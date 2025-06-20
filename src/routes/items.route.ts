import express from 'express';
import { celebrate } from 'celebrate';
import asyncHandler from 'express-async-handler';

import itemsSchema from '../schemas/items.schema';

import itemsController from '../controllers/items.controller';

import { auth as authMiddleware } from '../middleware';

const router = express.Router();

router.post(
	'/',
	[authMiddleware, celebrate(itemsSchema.create)],
	asyncHandler(itemsController.createItem)
);

router.get('/', authMiddleware, asyncHandler(itemsController.fetchItems));

router.get(
	'/:id',
	[authMiddleware, celebrate(itemsSchema.getById)],
	asyncHandler(itemsController.fetchItemById)
);

router.patch(
	'/:id',
	[authMiddleware, celebrate(itemsSchema.update)],
	asyncHandler(itemsController.updateItem)
);

router.delete(
	'/:id',
	[authMiddleware, celebrate(itemsSchema.remove)],
	asyncHandler(itemsController.deleteItem)
);

export default router;
