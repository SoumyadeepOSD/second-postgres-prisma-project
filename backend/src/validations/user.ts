const Joi = require("joi");

// Common Validators
const stringRequired = Joi.string().required();
const emailValidator = Joi.string().email().required();
const passwordValidator = Joi.string().required();
const idValidator = Joi.number().required();

// Header Validators
export const headerValidators = {
    userLogin: Joi.object({
        authorization: stringRequired,
    }).options({ allowUnknown: true }),

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
};
