const Joi = require("joi");

// Common Validators
const idValidator = Joi.number().required();
const titleValidator = Joi.string().required();
const descriptionValidator = Joi.string().required();
const statusValidator = Joi.string().valid("incomplete", "progress", "complete").default("incomplete");

// Payload Validators
export const todoPayloadValidators = {
    todoCreate: Joi.object({
        title: titleValidator,
        description: descriptionValidator,
        status: statusValidator,
        userId: idValidator,
    }),
    todoView: Joi.object({
        userId: idValidator,
    }),
    todoUpdate: Joi.object({
        title: titleValidator,
        description: descriptionValidator,
        status: statusValidator.required(),
    }),
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
