import jwt from 'jsonwebtoken';

import authModel from '../../src/models/auth.model';
import usersModel from '../../src/models/users.model';
import cryptoModel from '../../src/models/crypto.model';

jest.mock('../../src/models/users.model');
jest.mock('../../src/models/crypto.model');
jest.mock('jsonwebtoken');

describe('auth.model', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('registerUser', () => {
		it('Should successfully register a new user', async () => {
			const userMock = {
				id: 'test-user-id-1',
				username: 'James',
				hashedPassword: 'hashed-password-1',
				authSalt: 'auth-salt-1',
				vaultSalt: 'vault-salt-1',
			};
			const password = 'p455w0rd!';
			(cryptoModel.generateSalt as jest.Mock)
				.mockReturnValueOnce(userMock.authSalt)
				.mockReturnValueOnce(userMock.vaultSalt);
			(cryptoModel.generateHashedPassword as jest.Mock).mockResolvedValue(
				userMock.hashedPassword
			);
			(usersModel.createUser as jest.Mock).mockReturnValue(userMock);
			(jwt.sign as jest.Mock).mockReturnValue('test-token-1');
			const data = await authModel.registerUser(
				userMock.username,
				password
			);
			expect(cryptoModel.generateSalt).toHaveBeenCalledTimes(2);
			expect(cryptoModel.generateHashedPassword).toHaveBeenCalledWith(
				password,
				userMock.authSalt
			);
			expect(usersModel.createUser).toHaveBeenCalledWith(
				userMock.username,
				userMock.hashedPassword,
				userMock.authSalt,
				userMock.vaultSalt
			);
			expect(data).toEqual({
				token: 'test-token-1',
				user: userMock,
			});
		});

		it('Should throw an error if a new user cannot be registered', async () => {
			const username = 'James';
			const password = 'p455w0rd!';
			const errorMessage = 'Failed to hash password.';
			(cryptoModel.generateSalt as jest.Mock)
				.mockReturnValueOnce('auth-salt-1')
				.mockReturnValueOnce('vault-salt-1');
			(cryptoModel.generateHashedPassword as jest.Mock).mockRejectedValue(
				new Error(errorMessage)
			);

			const promise = authModel.registerUser(username, password);
			await expect(promise).rejects.toThrow(errorMessage);
		});
	});

	describe('logInUser', () => {
		it('Should successfully log in an existing user', async () => {
			const userMock = {
				id: 'test-user-id-1',
				username: 'James',
				hashedPassword: 'hashed-password-1',
				authSalt: 'auth-salt-1',
				vaultSalt: 'vault-salt-1',
			};
			const tokenMock = 'test-token-1';
			(usersModel.getUser as jest.Mock).mockResolvedValue(userMock);
			(cryptoModel.verifyPassword as jest.Mock).mockResolvedValue(true);
			(jwt.sign as jest.Mock).mockReturnValue(tokenMock);
			const data = await authModel.logInUser('James', 'p455w0rd!');
			expect(data).toEqual({
				token: tokenMock,
				user: userMock,
			});
		});

		it('Should fail to log in if the user does not exist', async () => {
			(usersModel.getUser as jest.Mock).mockResolvedValue(undefined);
			const promise = authModel.logInUser('James', 'p455w0rd!');
			await expect(promise).rejects.toThrow('Invalid credentials.');
		});

		it('Should fail to log in if an incorrect password is used', async () => {
			const userMock = {
				id: 'test-user-id-1',
				username: 'James',
				hashedPassword: 'hashed-password-1',
				authSalt: 'auth-salt-1',
				vaultSalt: 'vault-salt-1',
			};
			(usersModel.getUser as jest.Mock).mockResolvedValue(userMock);
			(cryptoModel.verifyPassword as jest.Mock).mockResolvedValue(false);
			const promise = authModel.logInUser('James', 'p455w0rd!');
			await expect(promise).rejects.toThrow('Invalid credentials.');
		});
	});
});
