import Joi from "joi";

export const registerSchema = Joi.object({
    email: Joi.string().email().required().custom((value, helpers) => {
      return value.toLowerCase(); 
    }),
    password: Joi.string().min(6).required(),
    subscription: Joi.string().valid('starter', 'pro', 'business').default('starter'),
  });
export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });