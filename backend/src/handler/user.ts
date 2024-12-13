const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const Prisma = new PrismaClient();
const bcryptJS = require("bcryptjs");
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_TOKEN_EXPIRATION = process.env.ACCESS_TOKEN_EXPIRATION;
const REFRESH_TOKEN_EXPIRATION = process.env.REFRESH_TOKEN_EXPIRATION;
// const REFRESH_TOKEN_EXPIRATION = "3d";

const PORT = process.env.PORT || 3000;

const userLoginHandler = async (req: any, h: any) => {
    const { email, password } = req.payload;
    const authHeader = req.headers.authorization;


    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return h.response({
            message: "Invalid or missing Authorization header",
        }).code(400);
    }

    const refreshToken = authHeader.split(" ")[1]; // Extract the token
    try {
        // If refresh token is there 
        if (refreshToken) {
            try {
                const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
                const existingUser = await Prisma.user.findUnique({
                    where: {
                        id: decoded.id
                    }
                });

                if (!existingUser || existingUser.refreshToken !== refreshToken) {
                    return h.response({
                        message: "Invalid/expired refresh token"
                    }).code(401);
                }

                // New Accesstoken
                const newAccessToken = jwt.sign(
                    { id: existingUser.id, email: existingUser.email },
                    JWT_SECRET,
                    { expiresIn: ACCESS_TOKEN_EXPIRATION }
                );

                await Prisma.user.update({
                    where: {
                        id: existingUser.id
                    },
                    data: {
                        accessToken: newAccessToken,
                    }
                });

                return h.response({
                    message: "Access token refreshed successfully",
                    accessToken: newAccessToken,
                    refreshToken: refreshToken
                }).code(200);
            } catch (error: any) {
                if (error.name === 'TokenExpiredError') {
                    console.log("Access token expired, falling back to email/password login.");
                } else {
                    return h.response({ message: "Invalid refresh token" }).code(401);
                }
            }

        }


        // If email and password is there
        if (email && password) {
            const user = await Prisma.user.findUnique({
                where: {
                    email: email
                }
            });

            if (!user) {
                return h.response({
                    message: "User not found"
                }).code(404);
            }

            const isPasswordValid = bcryptJS.compareSync(password, user.password);
            if (!isPasswordValid) {
                return h.response({
                    message: "Password did not match"
                }).code(401);
            }

            const accessToken = jwt.sign(
                { id: user.id, email: user.email },
                JWT_SECRET,
                { expiresIn: ACCESS_TOKEN_EXPIRATION }
            );

            let refreshToken = user.refreshToken;

            if (!refreshToken) {
                refreshToken = jwt.sign(
                    { id: user.id, email: user.email },
                    JWT_REFRESH_SECRET,
                    { expiresIn: REFRESH_TOKEN_EXPIRATION }
                );
            }


            await Prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    refreshToken: refreshToken
                }
            });

            return h.response({
                message: "Login Successful",
                accessToken: accessToken,
                refreshToken: refreshToken
            }).code(200);
        }
    } catch (error: any) {
        console.error("Login error:", error);
        return h.response({
            message: "Failed to process login",
            error: error.message || "Unknown error",
        }).code(500);
    }
}


const tokenValidHandler = async (req: any, h: any) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return h.response({
                message: "Missing or invalid Authorization header",
            }).code(400);
        }    
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, JWT_REFRESH_SECRET); // Ensures expiration is checked
        console.log(decoded);
        return h.response({
            data:decoded
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

        // Generate Access Token
        const accessToken = jwt.sign(
            { id: newUser.id, email: newUser.email },
            JWT_SECRET,
            { expiresIn: ACCESS_TOKEN_EXPIRATION }
        );

        // Generate Refresh Token
        const refreshToken = jwt.sign(
            { id: newUser.id, email: newUser.email },
            JWT_REFRESH_SECRET,
            { expiresIn: REFRESH_TOKEN_EXPIRATION }
        );

        await Prisma.user.update({
            where: {
                id: newUser.id
            },
            data: {
                refreshToken: refreshToken,
                accessToken: accessToken
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
                refreshToken: refreshToken,
                accessToken: accessToken
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