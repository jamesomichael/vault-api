import { Joi } from 'celebrate';

const register = {
	body: Joi.object()
		.keys({
			username: Joi.string().required().messages({
				'any.required': 'Username is required.',
			}),
			password: Joi.string().min(8).max(32).required().messages({
				'string.min': 'Password must be at least 8 characters long',
				'string.max': 'Password must be at most 32 characters long',
				'any.required': 'Password is required.',
			}),
		})
		.required(),
};

const login = {
	body: Joi.object()
		.keys({
			username: Joi.string().required().messages({
				'any.required': 'Username is required.',
			}),
			password: Joi.string().required().messages({
				'any.required': 'Password is required.',
			}),
		})
		.required(),
};

export { register, login };
