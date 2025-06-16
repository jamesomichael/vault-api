// import dotenv from 'dotenv';
import express from 'express';
import { errors } from 'celebrate';

// const NODE_ENV = process.env.NODE_ENV || 'development';

// if (NODE_ENV !== 'production') {
// 	dotenv.config();
// }

const PORT = process.env.PORT || 8080;

const app = express();
app.use(express.json());

app.use(errors());

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
