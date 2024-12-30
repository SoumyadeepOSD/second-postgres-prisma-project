import { httpMethods } from "../methods";
import { authUserRoutes } from "../constant/route";
import { headerValidators, userParamValidators, userPayloadValidators } from "../validations/user";
import { fetchAllUsersHandler, tokenValidHandler, userDeleteHandler, userForgotPasswordHandler, userLoginHandler, userSignupHandler } from "../handler/user";

const authRoutes = [
    {
        method: httpMethods.POST,
        path: authUserRoutes.VALIDITY,
        options: {
            tags: ["api", "USER"],
            validate: {
                headers: headerValidators.userValid,
                params: userParamValidators.userValid
            },
            handler: tokenValidHandler,
            auth:false
        }
    },
    {
        method: httpMethods.POST,
        path: authUserRoutes.LOGIN,
        options: {
            tags: ["api", "USER"],
            validate: {
                payload: userPayloadValidators.userLogin,
            },
            handler: userLoginHandler,
            auth:false
        }
    },
    {
        method: httpMethods.POST,
        path: authUserRoutes.SIGNUP,
        options: {
            tags: ["api", "USER"],
            validate: {
                payload: userPayloadValidators.userSignup
            },
            handler: userSignupHandler,
            auth:false
        }
    },
    {
        method: httpMethods.POST,
        path: authUserRoutes.FORGOTPASSWORD,
        options: {
            tags: ["api", "USER"],
            handler: userForgotPasswordHandler,
            auth:false
        }
    },
    {
        method: httpMethods.DELETE,
        path: authUserRoutes.DELETEUSER,
        options: {
            tags: ["api", "USER"],
            validate: {
                payload: userPayloadValidators.userDelete,
            },
            handler: userDeleteHandler
        }
    },
    {
        method: httpMethods.GET,
        path: authUserRoutes.VIEWUSER,
        options: {
            tags: ["api", "USER"],
            handler: fetchAllUsersHandler,
            auth:false
        }
    }
];


export default authRoutes;