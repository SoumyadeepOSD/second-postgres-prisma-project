const Joi = require("joi");

// Common Validators
const idValidator = Joi.number().required();
const stringRequired = Joi.string().required();
const priorityValidator = Joi.number().valid(1, 2, 3, 4).default(4);
const labelsValidator = Joi.array().items(Joi.number().integer()).optional();  // Validate array of label IDs
const statusValidator = Joi.string().valid("incomplete", "progress", "complete").default("incomplete");


// Payload Validators
export const todoPayloadValidators = {
    todoCreate: Joi.object({
        title: stringRequired,
        description: stringRequired,
        status: statusValidator,
        creationDateTime: stringRequired,
        updationDateTime: stringRequired,
        priority: priorityValidator,
        labels: labelsValidator,  // Add labels field for many-to-many relationship
    }),
    todoView: Joi.object({
        userId: idValidator,
    }),
    todoUpdate: Joi.object({
        title: stringRequired,
        description: stringRequired,
        status: statusValidator.required(),
        updationDateTime: stringRequired,
        creationDateTime: stringRequired,
        priority: priorityValidator,
        labels: labelsValidator,  // Add labels field for updating labels in Todo
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
