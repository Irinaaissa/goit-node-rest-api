import Joi from "joi";

const phonePattern = /^\(\d{3}\) \d{3}-\d{4}$/;

export const createContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email(),
  phone: Joi.string().pattern(phonePattern),
});

export const updateContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string().pattern(phonePattern),
})
  .min(1)
  .messages({ "object.min": "Body must have at least one field" });

export const contactSchema = Joi.object({
  favorite: Joi.boolean().required(),
});




