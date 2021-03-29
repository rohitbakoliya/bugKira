import Joi, { ValidationResult } from 'joi';

export const JoiLabelSchema = Joi.array().items(Joi.string().min(2).max(50));

export const validateLabel = (label: string) => {
  return JoiLabelSchema.validate(label);
};

export const JoiReferencesSchema = Joi.object({
  references: Joi.array().items(Joi.number()).required(),
});

export const validateReferences = (refs: any) => {
  return JoiReferencesSchema.validate(refs);
};

export const validateBug = (bug: any): ValidationResult => {
  // nested schemas
  const schema = Joi.object({
    title: Joi.string().min(6).max(100).required(),
    body: Joi.string().min(6).max(1000).required(),
    date_opened: Joi.date().default(Date.now),
    author: Joi.object(),
    isOpen: Joi.bool().default(true),
  });
  return schema.validate(bug);
};
