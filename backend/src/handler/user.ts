const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const Prisma = new PrismaClient();
const bcryptJS = require("bcryptjs");
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const REFRESH_TOKEN_EXPIRATION = "24h";
const ACCESS_TOKEN_EXPIRATION = "1h";



const userLoginHandler = async (req: any, h: any) => {
    const { email, password } = req.payload;

    try {
        // Step 1: Validate email and password
        if (!email || !password) {
            return h.response({
                message: "Email and password are required",
            }).code(400);
        }

        // Step 2: Check if the user exists
        const existingUser = await Prisma.user.findUnique({
            where: { email },
        });

        if (!existingUser) {
            return h.response({
                message: "User does not exist",
            }).code(401);
        }

        // Step 3: Validate the password
        const isPasswordValid = bcryptJS.compareSync(password, existingUser.password);
        if (!isPasswordValid) {
            return h.response({
                message: "Invalid password",
            }).code(401);
        }

        // Step 4: Check if a refresh token exists in the database
        let newAccessToken;
        if (existingUser.refreshToken) {
            try {
                const verifiedToken = jwt.verify(existingUser.refreshToken, JWT_REFRESH_SECRET);
                // Step 5a: Generate a new access token from a valid refresh token
                newAccessToken = jwt.sign(
                    { id: verifiedToken.id, email: verifiedToken.email },
                    JWT_SECRET,
                    { expiresIn: ACCESS_TOKEN_EXPIRATION }
                );

                return h.response({
                    id: verifiedToken.id,
                    accessToken: newAccessToken,
                }).code(200);
            } catch (error:any) {
                if (error.name !== "TokenExpiredError") {
                    return h.response({
                        message: "Invalid refresh token",
                    }).code(401);
                }
            }
        }

        // Step 5b: Create and store a new refresh token if the existing one is invalid or not present
        const newRefreshToken = jwt.sign(
            { id: existingUser.id, email: existingUser.email },
            JWT_REFRESH_SECRET,
            { expiresIn: REFRESH_TOKEN_EXPIRATION }
        );

        await Prisma.user.update({
            where: { id: existingUser.id },
            data: { refreshToken: newRefreshToken },
        });

        // Step 6: Generate a new access token
        newAccessToken = jwt.sign(
            { id: existingUser.id, email: existingUser.email },
            JWT_SECRET,
            { expiresIn: ACCESS_TOKEN_EXPIRATION }
        );

        return h.response({
            id: existingUser.id,
            accessToken: newAccessToken,
        }).code(200);
    } catch (error: any) {
        return h.response({
            message: "An error occurred during login",
            error: error.message || error,
        }).code(500);
    }
};



const tokenValidHandler = async (req: any, h: any) => {
    try {
        const authHeader = req.headers.authorization;
        const { tokenType } = req.params;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return h.response({
                message: "Missing or invalid Authorization header",
            }).code(400);
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, tokenType === "refresh" ? JWT_REFRESH_SECRET : JWT_SECRET); // Ensures expiration is checked
        console.log(decoded);
        return h.response({
            data: decoded
        });
    } catch (error) {
        return h.response({
            message: "Invalid token",
        }).code(401);
    }

};



const userSignupHandler = async (req: any, h: any) => {
    const { firstName, lastName, email, password } = req.payload;
    try {
        const existingUser = await Prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if (existingUser) {
            return h.response({
                "message": "User already exist!"
            }).code(500);
        }
        const salt = bcryptJS.genSaltSync(10);
        const hashedPassword = bcryptJS.hashSync(password, salt);

        const newUser = await Prisma.user.create({
            data: {
                first_name: firstName,
                last_name: lastName,
                email: email,
                password: hashedPassword,
                accessToken: "",
                refreshToken: ""
            }
        });

        // Generate Refresh Token
        const refreshToken = jwt.sign(
            { id: newUser.id, email: newUser.email, password: newUser.password },
            JWT_REFRESH_SECRET,
            { expiresIn: REFRESH_TOKEN_EXPIRATION }
        );

        await Prisma.user.update({
            where: {
                id: newUser.id
            },
            data: {
                refreshToken: refreshToken,
            }
        });

        if (!newUser) {
            throw new Error("Can't create new user");
        }
        return h.response({
            message: "Signup Successful",
            user: {
                id: newUser.id,
                firstName: newUser.firstName,
                secondName: newUser.secondName,
                email: newUser.email,
                refreshToken: newUser.refreshToken,
            }
        }).code(201);
    } catch (error) {
        console.log(error);
        return h.response({
            error: "Failed to create user",
        }).code(500);
    }
}


const userForgotPasswordHandler = async (req: any, h: any) => {
    const { email } = req.payload;
    return {
        "token": "sdtwtrett35v2345vv4v55t554"
    }
}



const userDeleteHandler = async (req: any, h: any) => {
    const { id } = req.payload;
    try {
        const user = await Prisma.user.findUnique({
            where: {
                id: id
            }
        });
        if (!user) {
            return h.response({
                "message": "Following user does not exist into the db"
            }).code(404);
        }
        const deletedUser = await Prisma.user.delete({
            where: {
                id: id
            }
        });
        return {
            "message": "Successfully deleted",
            "user": deletedUser
        }
    } catch (error: any) {
        console.error(error);
        return h.response({
            message: "An error occurred while Deleting the Todo",
            error: error.message || "Internal Server Error"
        }).code(500);
    }
}




const fetchAllUsersHandler = async (req: any, h: any) => {
    try {
        const allUsers = await Prisma.user.findMany();

        if (!allUsers) {
            return h.response({
                message: "No user found"
            }).code(201); // Bad request as it's a validation error
        }
        return h.response({
            message: "Successfully fetched all users",
            users: allUsers
        }).code(201); // Use 201 for resource creation

    } catch (error: any) {
        console.error(error);
        return h.response({
            message: "An error occurred while fetching the users from db",
            error: error.message || "Internal Server Error"
        }).code(500);
    }
}



export {
    userLoginHandler,
    userSignupHandler,
    userDeleteHandler,
    fetchAllUsersHandler,
    userForgotPasswordHandler,
    tokenValidHandler
};