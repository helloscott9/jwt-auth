import { Resolver, Query, Ctx } from "type-graphql";
import { User } from "../../entity/User";
import { IContext } from "../../interfaces/IContext";
import { verify } from "jsonwebtoken";

@Resolver()
export class Me {
    @Query(() => User, { nullable: true })
    me(
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
            return User.findOne(payload.userId)
        } catch (error) {
            console.log('error:', error)
            return null;

        }

    }
} 