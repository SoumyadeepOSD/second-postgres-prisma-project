const Joi = require("joi");

// Common Validators
const idValidator = Joi.number().required();
const stringRequired = Joi.string().required();

export const labelPayloadValidators = {
    labelCreate: Joi.object({
        name: stringRequired,
    }),
    labelView: Joi.object({
        userId: idValidator,
    }),
    labelUpdate: Joi.object({
        name: stringRequired,
    }),
};


export const labelHeaderValidators = {
    userValid: Joi.object({
        authorization: stringRequired,
    }).options({ allowUnknown: true }),
};


// Params Validators
export const labelParamsValidators = {
    labelUpdate: Joi.object({
        labelId: idValidator,
    }),
    labelDelete: Joi.object({
        labelId: idValidator,
    }),
    allTodosFetch: Joi.object({
        userId: idValidator,
    }),
};
