import Joi from "joi";

export const createContactSchema = Joi.object({
    name: Joi.string().required().min(2).max(20),
    email: Joi.string().email().required(),
    phone: Joi.string()
      .length(10)
      .pattern(/[6-9]{1}[0-9]{9}/)
      .required(),
})

export const updateContactSchema = Joi.object({
    name: Joi.string().min(2).max(20),
    email: Joi.string().email(),
    phone: Joi.string()
      .length(10)
      .pattern(/[6-9]{1}[0-9]{9}/),
})
