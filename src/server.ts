import dotenv from 'dotenv';
import express from 'express';
import { errors } from 'celebrate';

const NODE_ENV = process.env.NODE_ENV || 'development';

if (NODE_ENV !== 'production') {
	dotenv.config();
}

const PORT = process.env.PORT || 8080;

import * as databaseService from './services/database.service';
import authRoutes from './routes/auth.route';

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);

app.use(errors());

databaseService.serialise();

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
