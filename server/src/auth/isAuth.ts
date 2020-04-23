import { MiddlewareFn } from "type-graphql"
import { IMyContext } from "src/MyContext"
import { verify } from "jsonwebtoken";

export const isAuth: MiddlewareFn<IMyContext> = ({ context }, next) => {
    const authorization = context.req.headers['authorization'];

    if (!authorization) {
        throw new Error("not authenticated")
    }

    try {
        const token = authorization.split(" ")[1];
        const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
        context.payload = payload as any;
    } catch (error) {
        console.log('error:', error)
        throw new Error("not authenticated");

    }
    return next();
}