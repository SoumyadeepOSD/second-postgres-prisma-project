import { httpMethods } from "../methods";
import { labelRoutes } from "../constant/route";
import {
    labelCreateHandler,
    labelReadHandler,
    labelUpdateHandler,
    labelDeleteHandler
} from "../handler/label";
import {
    labelHeaderValidators,
    labelPayloadValidators,
    labelParamsValidators,
} from "../validations/label";

const labelsRoutes = [
    {
        method: httpMethods.POST,
        path: labelRoutes.CREATE,
        options: {
            tags: ["api", "LABEL"],
            validate: {
                headers: labelHeaderValidators.userValid,
                payload: labelPayloadValidators.labelCreate,
            },
            handler: labelCreateHandler,
            auth: false
        }
    },
    {
        method: httpMethods.GET,
        path: labelRoutes.VIEWLABEL,
        options: {
            tags: ["api", "LABEL"],
            validate: {
                headers: labelHeaderValidators.userValid,
            },
            handler: labelReadHandler,
            auth: false
        }
    },
    {
        method: httpMethods.PATCH,
        path: labelRoutes.UPDATELABEL,
        options: {
            tags: ["api", "LABEL"],
            validate: {
                headers: labelHeaderValidators.userValid,
                params: labelParamsValidators.labelUpdate,
                payload: labelPayloadValidators.labelUpdate,
            },
            handler: labelUpdateHandler,
            auth: false
        }
    },
    {
        method: httpMethods.DELETE,
        path: labelRoutes.DELETELABEL,
        options: {
            tags: ["api", "LABEL"],
            validate: {
                headers: labelHeaderValidators.userValid,
                params: labelParamsValidators.labelDelete,
            },
            handler: labelDeleteHandler,
            auth: false
        }
    }
];

export default labelsRoutes;
