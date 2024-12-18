import { PrismaClient } from "@prisma/client";
const Prisma = new PrismaClient();

const todoCreateHandler = async (req: any, h: any) => {
    try {
        const { title, description, status, creationDateTime, updationDateTime, priority, labels } = req.payload;
        const userId = req.auth.userId;

        // Check for existing Todo with the same title for the user
        const existingTodo = await Prisma.todo.findFirst({
            where: {
                title: {
                    equals: title.toLowerCase(), // Ensure title comparison is case-insensitive
                    mode: "insensitive"
                },
                userId: userId
            }
        });

        if (existingTodo) {
            return h.response({
                message: "Todo with this title already exists for this user"
            }).code(400); // Bad request as it's a validation error
        }

        // Prepare label associations
        const labelConnections = labels?.map((labelId: number) => ({ id: labelId })) || [];

        // Create a new Todo
        const newTodo = await Prisma.todo.create({
            data: {
                title: title,
                description: description,
                status: status,
                userId: userId,
                creationDateTime: creationDateTime,
                updationDateTime: updationDateTime,
                priority: priority,
                labels: {
                    connect: labelConnections, // Use the `connect` keyword to link existing labels
                },
            },
            include: {
                labels: true, // Include labels in the response
            },
        });

        return h.response({
            message: "Successfully created new Todo",
            todo: newTodo
        }).code(201); // Use 201 for resource creation

    } catch (error: any) {
        console.error(error);
        return h.response({
            message: "An error occurred while creating the Todo",
            error: error.message || "Internal Server Error"
        }).code(500);
    }
};


const todoReadHandler = async (req: any, h: any) => {
    const userId = req.auth.userId;
    try {
        const allTodos = await Prisma.todo.findMany({
            where: {
                userId: userId
            },
            include: {
                labels: true
            }
        });
        if (!allTodos || allTodos.length === 0) {
            return h.response({
                message: "No todos found",
            }).code(200);
        }
        return {
            "message": "Successfully get all todos",
            "todos": allTodos
        }
    } catch (error: any) {
        console.error(error);
        return h.response({
            message: "An error occurred while reading the todos",
            error: error.message || "Internal Server Error"
        }).code(500);
    }

}


const todoUpdateHandler = async (req: any, h: any) => {
    const { todoId } = req.params;
    const userId = req.auth.userId;
    const { title, description, status, updationDateTime, priority, labels } = req.payload;

    try {
        // Check if the Todo exists and belongs to the user
        const existingTodo = await Prisma.todo.findUnique({
            where: { id: todoId },
            include: { user: true },
        });

        if (!existingTodo || existingTodo.userId !== userId) {
            return h.response({
                message: "Todo can't be updated as it does not exist or does not belong to this user",
            }).code(401);
        }

        // Update the Todo fields
        const updatedTodo = await Prisma.todo.update({
            where: { id: todoId },
            data: {
                title: title,
                description: description,
                status: status,
                updationDateTime: updationDateTime,
                priority: priority,
                // Update the labels by connecting new ones and disconnecting old ones
                labels: {
                    set: labels.map((labelId: number) => ({ id: labelId })), // Clear existing and set new labels
                },
            },
            include: { labels: true }, // Include updated labels in the response
        });

        return h.response({
            message: "Successfully updated the todo",
            todo: updatedTodo,
        }).code(200); // Use 200 for successful updates

    } catch (error: any) {
        console.error(error);
        return h.response({
            message: "An error occurred while updating the Todo",
            error: error.message || "Internal Server Error",
        }).code(500);
    }
};


const todoDeleteHandler = async (req: any, h: any) => {
    const { todoId } = req.params;
    const userId = req.auth.userId;
    try {
        if (userId) {
            const existingTodo = await Prisma.todo.findUnique({
                where: {
                    id: todoId
                }
            });
            if (!existingTodo) {
                return h.response({
                    "message": "Todo can't deleted as it does not exist"
                }).code(401);
            }
            const deletedTodo = await Prisma.todo.delete({
                where: {
                    id: todoId
                }
            });
            if (!deletedTodo) {
                return h.response({
                    "message": "Can't delete todo"
                }).code(404);
            }
            return h.response({
                message: "Successfully deleted new Todo",
                todo: deletedTodo
            }).code(201); // Use 201 for resource creation
        }
    } catch (error: any) {
        console.error(error);
        return h.response({
            message: "An error occurred while updating the Todo",
            error: error.message || "Internal Server Error"
        }).code(500);
    }

}


const todoFetchAllHandler = async (req: any, h: any) => {
    try {
        const allTodos = await Prisma.todo.findMany({
            include: {
                labels: true
            }
        });
        if (!allTodos) {
            return h.response({
                "message": "No todos found"
            }).code(401);
        }
        return {
            "message": "Successfully fetch all todos",
            "todo": allTodos
        }
    } catch (error: any) {
        console.error(error);
        return h.response({
            message: "An error occurred while fetching all the todos",
            error: error.message || "Internal Server Error"
        }).code(500);
    }

}


export {
    todoReadHandler,
    todoUpdateHandler,
    todoCreateHandler,
    todoDeleteHandler,
    todoFetchAllHandler,
}




