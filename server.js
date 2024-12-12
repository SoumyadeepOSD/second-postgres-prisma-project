const { PrismaClient } = require("@prisma/client");
const HapiSwagger = require("hapi-swagger");
const Vision = require("@hapi/vision");
const Inert = require("@hapi/inert");
const Hapi = require("@hapi/hapi");
const Joi = require("@hapi/joi");
require("dotenv").config();

const Prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

const init = async () => {
  const server = Hapi.server({
    port: PORT,
    host: "127.0.0.1",
    routes:{
        cors: true
    }
  });

  // Swagger Plugin Options
  const swaggerOptions = {
    info: {
      title: "User API Documentation",
      version: "1.0.0",
    },
    grouping: "tags",
    basePath: "/api/",
    documentationPath: "/api/documentation",
    jsonPath: "/api/swagger.json",
    swaggerUIPath: "/api/swagger/ui",
    schemes: ["http"],
    tags: [{ name: "users", description: "User management routes" }],
  };

  // Register Plugins
  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ]);

  // *GET: Fetch all users
  server.route({
    method: "GET",
    path: "/users",
    options: {
      tags: ["api", "users"], // Documentation tags
      description: "Get all users",
      notes: "Fetches all users from the database",
    },
    handler: async (request, h) => {
      try {
        const users = await Prisma.user.findMany();
        return h.response(users).code(200);
      } catch (error) {
        console.log(error);
        return h.response({
          error: "Failed to fetch user's data",
        }).code(500);
      }
    },
  });

  // ~POST: Create a new user
  server.route({
    method: "POST",
    path: "/users",
    options: {
      tags: ["api", "users"],
      description: "Create a new user",
      notes: "Creates a user with a name, email, and password",
      validate: {
        payload: Joi.object({
          name: Joi.string().required(),
          email: Joi.string().email().required(),
          password: Joi.string().length(8).required(),
        }),
      },
    },
    handler: async (request, h) => {
      const { name, email, password } = request.payload;
      try {
        const newUser = await Prisma.user.create({
          data: { name, email, password },
        });
        return h.response(newUser).code(201);
      } catch (error) {
        console.log(error);
        return h.response({
          error: "Failed to create user",
        }).code(500);
      }
    },
  },);

  // ^PUT: Update user details
  server.route({
    method: "PUT",
    path: "/users/{id}",
    options: {
      tags: ["api", "users"],
      description: "Update user details",
      notes: "Updates the name and email of a user",
      validate: {
        payload: Joi.object({
          name: Joi.string().required(),
          email: Joi.string().email().required(),
        }),
        params: Joi.object({
          id: Joi.number().integer().required(),
        }),
      },
    },
    handler: async (request, h) => {
      const { name, email } = request.payload;
      const { id } = request.params;
      try {
        const updatedUser = await Prisma.user.update({
          where: { id: Number(id) },
          data: { name, email },
        });
        return h.response(updatedUser).code(200);
      } catch (error) {
        console.log(error);
        return h.response({
          error: "Failed to update user",
        }).code(500);
      }
    },
  });

  // !DELETE: Delete a user
  server.route({
    method: "DELETE",
    path: "/users/{id}",
    options: {
      tags: ["api", "users"],
      description: "Delete a user",
      notes: "Deletes a user by ID",
      validate: {
        params: Joi.object({
          id: Joi.number().integer().required(),
        }),
      },
    },
    handler: async (request, h) => {
      const { id } = request.params;
      try {
        const deletedUser = await Prisma.user.delete({
          where: { id: Number(id) },
        });
        return h.response(deletedUser).code(200);
      } catch (error) {
        console.log(error);
        return h.response({
          error: "Failed to delete user",
        }).code(500);
      }
    },
  });

  await server.start();
  console.log(`Server running on: ${server.info.uri}`);
  console.log(`Swagger UI available at: ${server.info.uri}/documentation`);
};

// Graceful shutdown and Prisma disconnect
process.on("unhandledRejection", (err) => {
  console.log(err);
  Prisma.$disconnect();
  process.exit(1);
});

process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  await Prisma.$disconnect();
  process.exit(0);
});

init();
