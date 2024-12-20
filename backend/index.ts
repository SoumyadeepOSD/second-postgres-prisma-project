import { authRoutes, labelRoutes, todoRoutes } from "./src/routes/route";
import { httpMethods } from "./src/methods";
import { todoHeaderValidators, todoParamsValidators, todoPayloadValidators } from "./src/validations/todo";
import { headerValidators, userParamValidators, userPayloadValidators } from "./src/validations/user";
import { fetchAllUsersHandler, tokenValidHandler, userDeleteHandler, userForgotPasswordHandler, userLoginHandler, userSignupHandler } from "./src/handler/user";
import { todoCreateHandler, todoDeleteHandler, todoFetchAllHandler, todoReadHandler, todoUpdateHandler } from "./src/handler/todo";
import authMiddleware from "./src/middleware/auth-middleware";
import { labelHeaderValidators, labelParamsValidators, labelPayloadValidators } from "./src/validations/label";
import { labelCreateHandler, labelDeleteHandler, labelReadHandler, labelUpdateHandler } from "./src/handler/label";

const HapiSwagger = require("hapi-swagger");
const basicAuth = require("basic-auth");
const Vision = require("@hapi/vision");
const Inert = require("@hapi/inert");
const Hapi = require("@hapi/hapi");
const Joi = require("joi");
require("dotenv").config();

const PORT = process.env.PORT;

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


    server.route({
        method: httpMethods.POST,
        path: authRoutes.VALIDITY,
        options: {
            tags: ["api", "users"],
            validate: {
                headers: headerValidators.userValid,
                params: userParamValidators.userValid
            },
            handler: tokenValidHandler
        }
    }),




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

    // *===================LABEL SECTION========================
    // //~ Create
    server.route({
        method: httpMethods.POST,
        path: labelRoutes.CREATE,
        options: {
            tags: ["api", "labels"],
            pre: [{ method: authMiddleware }],
            validate: {
                headers: labelHeaderValidators.userValid,
                payload: labelPayloadValidators.labelCreate,
            },
            handler: labelCreateHandler
        }
    });


    //~ GET
    server.route({
        method: httpMethods.GET,
        path: labelRoutes.VIEWLABEL,
        options: {
            tags: ["api", "todos"],
            pre: [{ method: authMiddleware }],
            validate: {
                headers: labelHeaderValidators.userValid,
            },
            handler: labelReadHandler
        }
    });


    //~ Update
    server.route({
        method: httpMethods.PATCH,
        path: labelRoutes.UPDATELABEL,
        options: {
            tags: ["api", "labels"],
            pre: [{ method: authMiddleware }],
            validate: {
                headers: labelHeaderValidators.userValid,
                params: labelParamsValidators.labelUpdate,
                payload: labelPayloadValidators.labelUpdate,
            },
            handler: labelUpdateHandler
        }
    });

    //~ Delete
    server.route({
        method: httpMethods.DELETE,
        path: labelRoutes.DELETELABEL,
        options: {
            tags: ["api", "todos"],
            pre: [{ method: authMiddleware }],
            validate: {
                headers: labelHeaderValidators.userValid,
                params: labelParamsValidators.labelDelete,
            },
            handler: labelDeleteHandler
        }
    });



    // *===================TODO SECTION========================
    //~ Create
    server.route({
        method: httpMethods.POST,
        path: todoRoutes.CREATE,
        options: {
            tags: ["api", "todos"],
            pre: [{ method: authMiddleware }],
            validate: {
                headers: todoHeaderValidators.userValid,
                payload: todoPayloadValidators.todoCreate,
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
            pre: [{ method: authMiddleware }],
            validate: {
                headers: todoHeaderValidators.userValid,
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
            pre: [{ method: authMiddleware }],
            validate: {
                headers: todoHeaderValidators.userValid,
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
            pre: [{ method: authMiddleware }],
            validate: {
                headers: todoHeaderValidators.userValid,
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




