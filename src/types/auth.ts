import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
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
