const Joi = require("joi");

export const registerUserValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(30).required(),
  fcmToken: Joi.string().required(),
});

export const loginUserValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(30).required(),
  fcmToken: Joi.string().required(),
});
