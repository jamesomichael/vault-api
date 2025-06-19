import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface User {
	id: string;
	username: string;
	hashedPassword: string;
}

export interface AuthorisedRequest extends Request {
	user: {
		id: string;
	};
}

export interface TokenPayload extends JwtPayload {
	user: {
		id: string;
	};
}
