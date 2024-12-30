import { todoRoutes } from "../constant/route";
import { todoCreateHandler, todoReadHandler, todoUpdateHandler, todoDeleteHandler, todoFetchAllHandler } from "../handler/todo";
import { todoHeaderValidators, todoPayloadValidators, todoParamsValidators } from "../validations/todo";
import { httpMethods } from "../methods";

const todosRoutes = [
    {
        method: httpMethods.POST,
        path: todoRoutes.CREATE,
        options: {
            tags: ["api", "TODO"],
            validate: {
                headers: todoHeaderValidators.userValid,
                payload: todoPayloadValidators.todoCreate,
            },
            handler: todoCreateHandler,
        }
    },
    {
        method: httpMethods.GET,
        path: todoRoutes.VIEWTODO,
        options: {
            tags: ["api", "TODO"],
            validate: {
                headers: todoHeaderValidators.userValid,
            },
            handler: todoReadHandler
        }
    },
    {
        method: httpMethods.PATCH,
        path: todoRoutes.UPDATETODO,
        options: {
            tags: ["api", "TODO"],
            validate: {
                headers: todoHeaderValidators.userValid,
                params: todoParamsValidators.todoUpdate,
                payload: todoPayloadValidators.todoUpdate,
            },
            handler: todoUpdateHandler
        }
    },
    {
        method: httpMethods.DELETE,
        path: todoRoutes.DELETETODO,
        options: {
            tags: ["api", "TODO"],
            validate: {
                headers: todoHeaderValidators.userValid,
                params: todoParamsValidators.todoDelete,
            },
            handler: todoDeleteHandler
        }
    },
    {
        method: httpMethods.GET,
        path: todoRoutes.VIEW_ALL,
        options: {
            tags: ["api", "TODO"],
            handler: todoFetchAllHandler
        }
    },
];

export default todosRoutes;