import { Joi } from 'celebrate';

const create = {
	body: Joi.object({
		blob: Joi.string().required().messages({
			'any.required': 'Blob is required.',
		}),
		iv: Joi.string()
			.base64({ paddingRequired: false })
			.length(16)
			.required()
			.messages({
				'string.base64': 'IV must be a valid base64 string.',
				'string.length':
					'IV must be exactly 16 characters long (12 bytes encoded).',
				'any.required': 'IV is required.',
			}),
	}).required(),
};

const getById = {
	params: Joi.object({
		id: Joi.string().required(),
	}),
};

const update = {
	params: Joi.object({
		id: Joi.string().required(),
	}),
	body: Joi.object({
		blob: Joi.string(),
		iv: Joi.string().base64({ paddingRequired: false }).length(16),
	}).required(),
};

export default { create, getById, update };
