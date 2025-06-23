import express from 'express';
import asyncHandler from 'express-async-handler';

import usersController from '../controllers/users.controller';

const router = express.Router();

router.get('/', asyncHandler(usersController.fetchLocalUsers));

export default router;
