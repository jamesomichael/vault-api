import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';

const NODE_ENV = process.env.NODE_ENV || 'development';

if (NODE_ENV !== 'production') {
	dotenv.config();
}

const PORT = process.env.PORT || 8080;

import * as databaseService from './services/database.service';
import authRoutes from './routes/auth.route';
import itemsRoutes from './routes/items.route';
import usersRoutes from './routes/users.route';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin: 'http://localhost:5173',
		credentials: true,
	})
);

app.use('/api/auth', authRoutes);
app.use('/api/items', itemsRoutes);
app.use('/api/users', usersRoutes);

app.use(errors());

databaseService.serialise();

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
