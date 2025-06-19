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

export default router;
