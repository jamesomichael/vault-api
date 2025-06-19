import * as argon2 from 'argon2';
import crypto from 'crypto';

const generateSalt = (length = 16) => {
	return crypto.randomBytes(length).toString('base64');
};

const generateHashedPassword = async (
	password: string,
	salt: string
): Promise<string> => {
	const hashedPassword = await argon2.hash(password, {
		salt: Buffer.from(salt, 'base64'),
	});
	return hashedPassword;
};

const verifyPassword = (hashedPassword: string, password: string) =>
	argon2.verify(hashedPassword, password);

export default { generateSalt, generateHashedPassword, verifyPassword };
