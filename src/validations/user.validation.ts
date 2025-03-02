import Joi from "joi";

export const registerValidation = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const loginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const forgotPasswordValidation = Joi.object({
  email: Joi.string().email().required(),
});
export const resetPasswordValidation = Joi.object({
  token: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
});
