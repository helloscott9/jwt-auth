import { isAuth } from './../../auth/isAuth';
import { Resolver, Query, Ctx, UseMiddleware } from "type-graphql";
import { User } from "../../entity/User";
import { IContext } from "../../interfaces/IContext";
import { verify } from "jsonwebtoken";

@Resolver()
export class DeleteUSer {
    @Query(() => Boolean)
    @UseMiddleware(isAuth)
    async deleteUser(
        @Ctx() context: IContext
    ) {
        const authorization = context.req.headers['authorization'];

        if (!authorization) {
            return null;
        }

        try {
            const token = authorization.split(" ")[1];
            const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);
            context.payload = payload as any;
            const user = await User.findOne(payload.userId)

            if (user!.id = payload.userId) {
                await User.delete({ id: payload.userID })
            } else {
                throw new Error("action denied")
            }

            return true

        } catch (error) {
            console.log('error:', error)
            return false;

        }

    }
} 