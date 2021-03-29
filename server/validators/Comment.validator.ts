import Joi, { ValidationResult } from 'joi';

export const validateComment = (comment: any): ValidationResult => {
  const schema = Joi.object({
    body: Joi.string().min(6).max(1000).required(),
    date: Joi.date().default(Date.now),
    author: Joi.object(),
    bugId: Joi.number(),
    reactions: Joi.array().default([]),
  });
  return schema.validate(comment);
};
