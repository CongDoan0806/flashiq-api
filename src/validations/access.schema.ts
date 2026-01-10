import Joi from 'joi';

export const shareSetSchema = Joi.object({
  setId: Joi.string().required().messages({
    'any.required': 'setId is required',
  }),
  userId: Joi.string().required().messages({
    'any.required': 'userId is required',
  }),
  permission: Joi.string().valid('VIEW', 'EDIT').required(),
});
