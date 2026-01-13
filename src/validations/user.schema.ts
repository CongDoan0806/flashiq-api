import Joi from 'joi';

export const userParamsSchema = Joi.object({
  userId: Joi.string().trim().required().messages({
    'any.required': 'userId is required',
    'string.empty': 'userId must not be empty',
  }),
});
