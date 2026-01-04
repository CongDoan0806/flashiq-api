import Joi from 'joi';

export const singleCardSchema = Joi.object({
  term: Joi.string().required().messages({
    'any.required': 'Term is required',
    'string.empty': 'Term cannot be empty',
  }),
  definition: Joi.string().required().messages({
    'any.required': 'Definition is required',
    'string.empty': 'Definition cannot be empty',
  }),
  example: Joi.string().optional().allow(''),
  image_url: Joi.string().uri().optional().allow('').messages({
    'string.uri': 'Image URL must be a valid URL',
  }),
});

export const bulkCardSchema = Joi.object({
  data: Joi.array().items(singleCardSchema).min(1).required().messages({
    'array.min': 'At least one card is required',
  }),
}).options({
  abortEarly: false,
  stripUnknown: true,
});

export const bulkUpdateCardsSchema = Joi.object({
  setId: Joi.string().required().messages({
    'any.required': 'Set id is required',
    'string.empty': 'Set id cannot be empty',
  }),

  oldCards: Joi.array().required().default([]).messages({
    'array.base': 'Old cards must be an array',
  }),

  newCards: Joi.array().required().default([]).messages({
    'array.base': 'New cards must be an array',
  }),
}).required();
