import { NextFunction, Request, Response } from 'express';

import usersController from '../../src/controllers/users.controller';
import usersModel from '../../src/models/users.model';

import type { LocalUserDto } from '../../src/types/users';

jest.mock('../../src/models/users.model');

describe('users.controller', () => {
	const req: Partial<Request> = { body: {} };
	let res: Partial<Response>;
	let next: Partial<NextFunction>;
	let statusMock: jest.Mock;
	let jsonMock: jest.Mock;
	let sendMock: jest.Mock;

	beforeEach(() => {
		jest.clearAllMocks();
		statusMock = jest.fn().mockReturnThis();
		jsonMock = jest.fn();
		sendMock = jest.fn();
		res = {
			status: statusMock,
			json: jsonMock,
			send: sendMock,
		};
		next = jest.fn();
	});

	describe('fetchLocalUsers', () => {
		it('Should successfully fetch all local users', async () => {
			const usersMock: LocalUserDto[] = [
				{
					id: 'test-user-id-1',
					username: 'James',
				},
				{
					id: 'test-user-id-2',
					username: 'Test',
				},
			];
			(usersModel.fetchLocalUsers as jest.Mock).mockReturnValue(
				usersMock
			);

			await usersController.fetchLocalUsers(
				req as Request,
				res as Response,
				next as NextFunction
			);

			expect(statusMock).toHaveBeenCalledWith(200);
			expect(jsonMock).toHaveBeenCalledWith(usersMock);
		});

		it('Should respond with a 500 if an error is thrown', async () => {
			(usersModel.fetchLocalUsers as jest.Mock).mockImplementation(() => {
				throw new Error('Failed to fetch local users.');
			});

			await usersController.fetchLocalUsers(
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
});
