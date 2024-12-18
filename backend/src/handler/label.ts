import { PrismaClient } from "@prisma/client";
const Prisma = new PrismaClient();

const labelCreateHandler = async (req: any, h: any) => {
    try {
        const { name } = req.payload;
        const userId = req.auth.userId; 
        const existingTodo = await Prisma.label.findFirst({
            where: {
                name: {
                    equals: name.toLowerCase(), // Ensure title comparison is case-insensitive
                    mode: "insensitive"
                },
                userId: userId
            }
        });

        if (existingTodo) {
            return h.response({
                message: "Label with this name already exists for this user"
            }).code(400); // Bad request as it's a validation error
        }

        // Create a new Todo
        const newTodo = await Prisma.label.create({
            data:{
                name:name,
                userId:userId
            }
        });

        return h.response({
            message: "Successfully created new label",
            todo: newTodo
        }).code(201); // Use 201 for resource creation

    } catch (error: any) {
        console.error(error);
        return h.response({
            message: "An error occurred while creating the label",
            error: error.message || "Internal Server Error"
        }).code(500);
    }
}


const labelReadHandler = async (req: any, h: any) => {
    const userId = req.auth.userId;
    try {
        const allLabels = await Prisma.label.findMany({
            where: {
                userId: userId
            },
        });
        if (!allLabels || allLabels.length === 0) {
            return h.response({
                message: "No Labels found",
            }).code(200);
        }
        return {
            "message": "Successfully get all labels",
            "labels": allLabels
        }
    } catch (error: any) {
        console.error(error);
        return h.response({
            message: "An error occurred while reading the labels",
            error: error.message || "Internal Server Error"
        }).code(500);
    }

}


const labelUpdateHandler = async (req: any, h: any) => {
    const { labelId } = req.params;
    const userId = req.auth.userId;
    const { name } = req.payload;

    try {
        // Check if the Todo exists and belongs to the user
        const existingLabel = await Prisma.label.findUnique({
            where: { id: labelId },
        });

        if (!existingLabel || existingLabel.userId !== userId) {
            return h.response({
                message: "Label can't be updated as it does not exist or does not belong to this user",
            }).code(401);
        }

        // Update the Todo fields
        const updatedLabel = await Prisma.label.update({
            where: { id: labelId },
            data: {
                name:name
            },
        });

        return h.response({
            message: "Successfully updated the label",
            label: updatedLabel,
        }).code(200); // Use 200 for successful updates

    } catch (error: any) {
        console.error(error);
        return h.response({
            message: "An error occurred while updating the label",
            error: error.message || "Internal Server Error",
        }).code(500);
    }
};


const labelDeleteHandler = async (req: any, h: any) => {
    const { labelId } = req.params;
    const userId = req.auth.userId;
    try {
        if (userId) {
            const existingLabel = await Prisma.label.findUnique({
                where: {
                    id: labelId
                }
            });
            if (!existingLabel) {
                return h.response({
                    "message": "Label can't deleted as it does not exist"
                }).code(401);
            }
            const deletedTodo = await Prisma.label.delete({
                where: {
                    id: labelId
                }
            });
            if (!deletedTodo) {
                return h.response({
                    "message": "Can't delete label"
                }).code(404);
            }
            return h.response({
                message: "Successfully deleted label",
                todo: deletedTodo
            }).code(201); // Use 201 for resource creation
        }
    } catch (error: any) {
        console.error(error);
        return h.response({
            message: "An error occurred while updating the label",
            error: error.message || "Internal Server Error"
        }).code(500);
    }

}



export {
    labelCreateHandler,
    labelReadHandler,
    labelUpdateHandler,
    labelDeleteHandler
}