import { NextFunction, Request, Response } from 'express';

import authController from '../../src/controllers/auth.controller';
import authModel from '../../src/models/auth.model';
import usersModel from '../../src/models/users.model';
import { AuthorisedRequest } from '../../src/types/auth';

jest.mock('../../src/models/auth.model');
jest.mock('../../src/models/users.model');

describe('auth.controller', () => {
	const req: Partial<Request> = { body: {} };
	let res: Partial<Response>;
	let next: Partial<NextFunction>;
	let statusMock: jest.Mock;
	let jsonMock: jest.Mock;
	let sendMock: jest.Mock;
	let cookieMock: jest.Mock;
	let clearCookieMock: jest.Mock;

	beforeEach(() => {
		jest.clearAllMocks();
		statusMock = jest.fn().mockReturnThis();
		jsonMock = jest.fn();
		cookieMock = jest.fn().mockReturnThis();
		clearCookieMock = jest.fn();
		sendMock = jest.fn();
		res = {
			clearCookie: clearCookieMock,
			status: statusMock,
			cookie: cookieMock,
			json: jsonMock,
			send: sendMock,
		};
		next = jest.fn();
	});

	describe('register', () => {
		it('Should create the user and return a token', async () => {
			(usersModel.getUser as jest.Mock).mockReturnValue(undefined);
			(authModel.registerUser as jest.Mock).mockResolvedValue({
				token: 'test-token',
				user: {
					id: 'test-user-id',
					username: 'James',
					hashedPassword: 'hashed-password-1',
					authSalt: 'auth-salt-1',
					vaultSalt: 'vault-salt-1',
				},
			});

			req.body = {
				username: 'James',
				password: 'p455w0rd!',
			};

			await authController.register(
				req as Request,
				res as Response,
				next as NextFunction
			);

			expect(statusMock).toHaveBeenCalledWith(200);
			expect(jsonMock).toHaveBeenCalledWith({
				token: 'test-token',
				user: {
					id: 'test-user-id',
					username: 'James',
					hashedPassword: 'hashed-password-1',
					authSalt: 'auth-salt-1',
					vaultSalt: 'vault-salt-1',
				},
			});
		});

		it('Should respond with a 409 if the user already exists', async () => {
			(usersModel.getUser as jest.Mock).mockReturnValue({
				id: 'test-user-id-1',
				username: 'James',
				hashedPassword: 'hashed-password-1',
				authSalt: 'auth-salt-1',
				vaultSalt: 'vault-salt-1',
			});

			req.body = {
				username: 'James',
				password: 'p455w0rd!',
			};

			await authController.register(
				req as Request,
				res as Response,
				next as NextFunction
			);

			expect(statusMock).toHaveBeenCalledWith(409);
			expect(jsonMock).toHaveBeenCalledWith({
				message: 'User already exists.',
			});
		});

		it('Should respond with a 500 if an error is thrown', async () => {
			(usersModel.getUser as jest.Mock).mockReturnValue(undefined);
			(authModel.registerUser as jest.Mock).mockRejectedValue(
				new Error('Cannot register user.')
			);

			req.body = {
				username: 'James',
				password: 'p455w0rd!',
			};

			await authController.register(
				req as Request,
				res as Response,
				next as NextFunction
			);

			expect(statusMock).toHaveBeenCalledWith(500);
			expect(jsonMock).toHaveBeenCalledWith({
				message: 'Something went wrong.',
			});
		});
	});

	describe('login', () => {
		it('Should successfully log in a user and return a token', async () => {
			(authModel.logInUser as jest.Mock).mockResolvedValue({
				token: 'test-token',
				user: {
					id: 'test-user-id',
					username: 'James',
					hashedPassword: 'hashed-password-1',
					authSalt: 'auth-salt-1',
					vaultSalt: 'vault-salt-1',
				},
			});

			req.body = {
				username: 'James',
				password: 'p455w0rd!',
			};

			await authController.login(
				req as Request,
				res as Response,
				next as NextFunction
			);

			expect(statusMock).toHaveBeenCalledWith(200);
			expect(jsonMock).toHaveBeenCalledWith({
				token: 'test-token',
				user: {
					id: 'test-user-id',
					username: 'James',
					hashedPassword: 'hashed-password-1',
					authSalt: 'auth-salt-1',
					vaultSalt: 'vault-salt-1',
				},
			});
		});

		it('Should respond with a 401 if invalid credentials are used', async () => {
			(authModel.logInUser as jest.Mock).mockRejectedValue(
				new Error('Invalid credentials.')
			);

			req.body = {
				username: 'James',
				password: 'p455w0rd!',
			};

			await authController.login(
				req as Request,
				res as Response,
				next as NextFunction
			);

			expect(statusMock).toHaveBeenCalledWith(401);
			expect(jsonMock).toHaveBeenCalledWith({
				message: 'Invalid credentials.',
			});
		});

		it('Should respond with a 500 if an error is thrown', async () => {
			(authModel.logInUser as jest.Mock).mockRejectedValue(
				new Error('Something went wrong.')
			);

			req.body = {
				username: 'James',
				password: 'p455w0rd!',
			};

			await authController.login(
				req as Request,
				res as Response,
				next as NextFunction
			);

			expect(statusMock).toHaveBeenCalledWith(500);
			expect(jsonMock).toHaveBeenCalledWith({
				message: 'Something went wrong.',
			});
		});
	});

	describe('logout', () => {
		it('Should successfully log out a user', async () => {
			const authorisedRequestMock = {
				user: {
					id: 'test-user-id-1',
				},
			};
			await authController.logout(
				authorisedRequestMock as AuthorisedRequest,
				res as Response,
				next as NextFunction
			);

			expect(statusMock).toHaveBeenCalledWith(204);
			expect(clearCookieMock).toHaveBeenCalled();
		});
	});
});
