const Joi = require("joi");

// Common Validators
const idValidator = Joi.number().required();
const stringRequired = Joi.string().required();
const statusValidator = Joi.string().valid("incomplete", "progress", "complete").default("incomplete");

// Payload Validators
export const todoPayloadValidators = {
    todoCreate: Joi.object({
        title: stringRequired,
        description: stringRequired,
        status: statusValidator,
    }),
    todoView: Joi.object({
        userId: idValidator,
    }),
    todoUpdate: Joi.object({
        title: stringRequired,
        description: stringRequired,
        status: statusValidator.required(),
    }),
};

export const todoHeaderValidators = {
    userValid: Joi.object({
        authorization: stringRequired,
    }).options({ allowUnknown: true }),
};


// Params Validators
export const todoParamsValidators = {
    todoUpdate: Joi.object({
        todoId: idValidator,
    }),
    todoDelete: Joi.object({
        todoId: idValidator,
    }),
    allTodosFetch: Joi.object({
        userId: idValidator,
    }),
};
