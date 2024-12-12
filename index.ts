const { PrismaClient } = require("@prisma/client");
import { authRoutes, todoRoutes } from "./src/routes/route";
import { httpMethods } from "./src/methods";
import { todoParamsValidators, todoPayloadValidators } from "./src/validations/todo";
import { headerValidators, userPayloadValidators } from "./src/validations/user";
import { fetchAllUsersHandler, userDeleteHandler, userForgotPasswordHandler, userLoginHandler, userSignupHandler } from "./src/handler/user";
import { todoCreateHandler, todoDeleteHandler, todoFetchAllHandler, todoReadHandler, todoUpdateHandler } from "./src/handler/todo";
const HapiSwagger = require("hapi-swagger");
const basicAuth = require("basic-auth");
const Vision = require("@hapi/vision");
const Inert = require("@hapi/inert");
const Hapi = require("@hapi/hapi");
const Joi = require("joi");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

const init = async () => {


    const server = Hapi.server({
        port: PORT,
        host: "localhost",
        routes: {
            cors: {
                origin: ['*'],
                credentials: true,
            }
        }
    });



    const swaggerOptions = {
        info: {
            title: "HAPIJS API DOCS",
            version: "1.0.0"
        },
        tags: [
            { name: "user", description: "User related operations" }
        ],
        documentationPath: "/documentation", // This ensures the docs are served at /documentation
    };



    // Register plugins
    await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ]);




    //*LOGIN REQUEST
    server.route({
        method: httpMethods.POST,
        path: authRoutes.LOGIN,
        options: {
            tags: ["api", "users"],
            validate: {
                headers: headerValidators.userLogin,
                payload: userPayloadValidators.userLogin,
            },
            handler: userLoginHandler
        }
    }),



    //*SIGNUP REQUEST
    server.route({
        method: httpMethods.POST,
        path: authRoutes.SIGNUP,
        options: {
            tags: ["api", "users"],
            validate: {
                payload: userPayloadValidators.userSignup
            },
            handler: userSignupHandler
        }
    });



    //* FORGOT PASSWORD REQUEST
    server.route({
        method: httpMethods.POST,
        path: authRoutes.FORGOTPASSWORD,
        options: {
            tags: ["api", "users"],
            validate: {
                payload: Joi.object({
                    email: Joi.string().required(),
                })
            },
            handler: userForgotPasswordHandler
        }
    });




    //* DELETE USER REQUEST
    server.route({
        method: httpMethods.DELETE,
        path: authRoutes.DELETEUSER,
        options: {
            tags: ["api", "users"],
            validate: {
                payload: userPayloadValidators.userDelete,
            },
            handler: userDeleteHandler
        }
    });



    // ~Get ALL USERS from DB
    server.route({
        method: httpMethods.GET,
        path: authRoutes.VIEWUSER,
        options: {
            tags: ["api", "users"],
            handler: fetchAllUsersHandler
        }
    });



    // *===================TODO SECTION========================
    //~ Create
    server.route({
        method: httpMethods.POST,
        path: todoRoutes.CREATE,
        options: {
            tags: ["api", "todos"],
            validate: {
                payload: todoPayloadValidators.todoCreate
            },
            handler: todoCreateHandler
        }
    });



    //~ GET
    server.route({
        method: httpMethods.GET,
        path: todoRoutes.VIEWTODO,
        options: {
            tags: ["api", "todos"],
            validate: {
                params: todoParamsValidators.allTodosFetch
            },
            handler: todoReadHandler
        }
    });


    //~ Update
    server.route({
        method: httpMethods.PATCH,
        path: todoRoutes.UPDATETODO,
        options: {
            tags: ["api", "todos"],
            validate: {
                params: todoParamsValidators.todoUpdate,
                payload: todoPayloadValidators.todoUpdate,
            },
            handler: todoUpdateHandler
        }
    });


    //~ Delete
    server.route({
        method: httpMethods.DELETE,
        path: todoRoutes.DELETETODO,
        options: {
            tags: ["api", "todos"],
            validate: {
                params: todoParamsValidators.todoDelete,
            },
            handler: todoDeleteHandler
        }
    });


    // !HACK TO GET ALL TODOS OF DB IRRECPECTIVE OF USERS
    server.route({
        method: httpMethods.GET,
        path: todoRoutes.VIEW_ALL,
        options: {
            tags: ["api", "todos"],
            handler: todoFetchAllHandler
        }
    });



    // Basic authentication middleware to protect Swagger docs
    server.ext('onRequest', (req: any, h: any) => {
        const route = req.url.pathname;
        if (route === "/documentation" || route === "/api/swagger.json") {
            const user = basicAuth(req);
            if (!user || user.name !== "username" || user.pass !== "password") {
                return h.response("Unauthorized").code(401)
                    .header("WWW-Authenticate", "Basic realm='Node'").takeover();
            }
        }
        return h.continue;
    });




    await server.start();
    console.log(`Server running on ${server.info.uri}`);
    console.log(`Docs running on ${server.info.uri}/documentation`);
};

init();




