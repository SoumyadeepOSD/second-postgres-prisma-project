import authRoutes from "./src/routes/auth";
import labelsRoutes from "./src/routes/label";
import todosRoutes from "./src/routes/todo";
import swaggerOptions from "./src/config/swagger";
const HapiSwagger = require("hapi-swagger");
const basicAuth = require("basic-auth");
const Vision = require("@hapi/vision");
const Inert = require("@hapi/inert");
const Hapi = require("@hapi/hapi");
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
    
    // Register plugins
    await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ]);

    server.route([...authRoutes, ...labelsRoutes, ...todosRoutes]);

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




