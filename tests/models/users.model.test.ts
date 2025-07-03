jest.mock('better-sqlite3', () => {
	return jest.fn().mockImplementation(() => ({
		prepare: jest.fn().mockReturnValue({
			run: jest.fn(),
			get: jest.fn(),
			all: jest.fn(),
		}),
		exec: jest.fn(),
	}));
});

import { v4 as uuidv4 } from 'uuid';

import usersModel from '../../src/models/users.model';
import db from '../../src/services/database.service';

jest.mock('uuid');
jest.mock('../../src/services/database.service');

describe('users.model', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('getUser', () => {
		it('Should get the user', () => {
			const getMock = jest.fn();
			const userMock = {
				id: 'test-user-id-1',
				username: 'James',
				hashedPassword: 'hashed-password-1',
				authSalt: 'auth-salt-1',
				vaultSalt: 'vault-salt-1',
			};
			getMock.mockReturnValue(userMock);
			(db.prepare as jest.Mock).mockReturnValue({ get: getMock });
			const data = usersModel.getUser('James');
			expect(data).toEqual(userMock);
		});
	});

	describe('fetchLocalUsers', () => {
		it('Should fetch local users', () => {
			const allMock = jest.fn();
			const usersMock = [
				{
					id: 'test-user-id-1',
					username: 'James',
				},
				{
					id: 'test-user-id-2',
					username: 'Test',
				},
			];
			allMock.mockReturnValue(usersMock);
			(db.prepare as jest.Mock).mockReturnValue({ all: allMock });
			const data = usersModel.fetchLocalUsers();
			expect(data).toEqual(usersMock);
		});
	});

	describe('createUser', () => {
		it('Should add a new user record', () => {
			const userId = 'test-user-id-1';
			const username = 'James';
			const hashedPassword = 'hashed-password-1';
			const authSalt = 'auth-salt-1';
			const vaultSalt = 'vault-salt-1';
			const runMock = jest.fn();
			runMock.mockReturnValue(true);
			(db.prepare as jest.Mock).mockReturnValue({ run: runMock });
			(uuidv4 as jest.Mock).mockReturnValue(userId);
			const data = usersModel.createUser(
				username,
				hashedPassword,
				authSalt,
				vaultSalt
			);
			expect(data).toEqual({
				id: userId,
				username,
				hashedPassword,
				authSalt,
				vaultSalt,
			});
		});
	});
});
