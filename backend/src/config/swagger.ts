const swaggerOptions = {
    info: {
        title: "HAPIJS API DOCS",
        version: "1.0.0",
    },
    tags: [
        { name: "USER", description: "APIs related to user operations" },
        { name: "TODO", description: "APIs related to todo operations" },
        { name: "LABEL", description: "APIs related to label operations" },
    ],
    documentationPath: "/documentation",
};

export default swaggerOptions;
