import cryptoModel from '../../src/models/crypto.model';

describe('crypto.model', () => {
	describe('generateSalt', () => {
		it('Should return a base64 string of expected length', () => {
			const salt = cryptoModel.generateSalt(16);
			expect(typeof salt).toBe('string');
			expect(salt.length).toBeGreaterThanOrEqual(22);
		});
	});

	describe('generateHashedPassword', () => {
		it('Should successfully hash a password', async () => {
			const salt = cryptoModel.generateSalt();
			const password = 'v3ry53cur3p455w0rd!';
			const hash = await cryptoModel.generateHashedPassword(
				password,
				salt
			);
			expect(typeof hash).toBe('string');
			expect(hash).toMatch(/^\$argon2id\$/);
		});
	});

	describe('verifyPassword', () => {
		it('Should verify a correct password', async () => {
			const salt = cryptoModel.generateSalt();
			const password = 'v3ry53cur3p455w0rd!';
			const hash = await cryptoModel.generateHashedPassword(
				password,
				salt
			);
			const result = await cryptoModel.verifyPassword(hash, password);
			expect(result).toBe(true);
		});

		it('Should reject an incorrect password', async () => {
			const salt = cryptoModel.generateSalt();
			const password = 'v3ry53cur3p455w0rd!';
			const incorrectPassword = 'incorrectpassword';
			const hash = await cryptoModel.generateHashedPassword(
				password,
				salt
			);
			const result = await cryptoModel.verifyPassword(
				hash,
				incorrectPassword
			);
			expect(result).toBe(false);
		});
	});
});
