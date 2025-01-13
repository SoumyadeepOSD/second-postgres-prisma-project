const Joi = require("joi");

// Common Validators
const idValidator = Joi.number().required();
const stringRequired = Joi.string().required();
const passwordValidator = Joi.string().required();
const emailValidator = Joi.string().email().required();

// Header Validators
export const headerValidators = {
    userValid: Joi.object({
        authorization: stringRequired,
    }).options({ allowUnknown: true }),
};

// Payload Validators
export const userPayloadValidators = {
    userLogin: Joi.object({
        email: emailValidator,
        password: passwordValidator,
    }),
    userSignup: Joi.object({
        firstName: stringRequired,
        lastName: stringRequired,
        email: emailValidator,
        password: passwordValidator,
    }),
    userDelete: Joi.object({
        id: idValidator,
    }),
    userForgotPassword: Joi.object({
        email: emailValidator,
    }),
    userResetPassword: Joi.object({
        password:passwordValidator
    }),
};

// Param Validators
export const userParamValidators = {
    userValid: Joi.object({
        tokenType: stringRequired
    }),
    userResetPassword: Joi.object({
        token: stringRequired
    })
}