import Joi from 'joi';

export const aiStorySchema = Joi.object({
  storyLength: Joi.number().min(50).max(300).required().messages({
    'number.base': 'Story length must be a number',
    'number.min': 'Story length must be at least 50 characters',
    'number.max': 'Story length must not exceed 300 characters',
    'any.required': 'Story length is required',
  }),
  style: Joi.string()
    .valid('Funny', 'Academic', 'Dialogue', 'Creative')
    .required()
    .messages({
      'string.valid':
        'Style must be one of: Funny, Academic, Dialogue, Creative',
      'any.required': 'Style is required',
    }),
});
