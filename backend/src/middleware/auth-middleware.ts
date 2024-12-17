import jwt from "jsonwebtoken";
import { ResponseToolkit, Lifecycle } from "@hapi/hapi";

const JWT_SECRET = process.env.JWT_SECRET!;

const authMiddleware = async (req: any, h: ResponseToolkit): Promise<Lifecycle.ReturnValue> => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return h
                .response({
                    message: "Missing or invalid Authorization header",
                })
                .code(401)
                .takeover();
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, JWT_SECRET) as any;

        // Attach decoded user info to the request object for further use
        req.auth = { userId: decoded.id };

        return h.continue;
    } catch (error: any) {
        return h
            .response({
                message: "Unauthorized access",
                error: error.message,
            })
            .code(401)
            .takeover();
    }
};

export default authMiddleware;
