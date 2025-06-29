import express from 'express';
import { celebrate } from 'celebrate';
import asyncHandler from 'express-async-handler';

import authSchema from '../schemas/auth.schema';

import authController from '../controllers/auth.controller';

import { auth as authMiddleware } from '../middleware';

const router = express.Router();

router.post(
	'/register',
	celebrate(authSchema.register),
	asyncHandler(authController.register)
);

router.post(
	'/login',
	celebrate(authSchema.login),
	asyncHandler(authController.login)
);

router.post('/logout', authMiddleware, asyncHandler(authController.logout));

export default router;
