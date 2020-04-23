import { createRefreshToken } from './../../auth/auth';
import { sendRefreshToken } from './../../sendRefreshToken';
import { ChangePasswordInput } from './changePasswordInput';
import { forgotPasswordPrefix } from './../../constants/redisprefixes';
import { IContext } from './../../interfaces/IContext';
import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import bcrypt from "bcryptjs";

import { User } from "../../entity/User";
import { redis } from "../../redis";

@Resolver()
export class ChangePasswordResolver {
    @Mutation(() => User, { nullable: true })
    async changePassword(
        @Arg("data")
        { token, password }: ChangePasswordInput,
        @Ctx() ctx: IContext
    ): Promise<User | null> {
        const userId = await redis.get(forgotPasswordPrefix + token);

        if (!userId) {
            return null;
        }

        const user = await User.findOne(userId);

        if (!user) {
            return null;
        }

        await redis.del(forgotPasswordPrefix + token);

        user.password = await bcrypt.hash(password, 12);

        await user.save();


        sendRefreshToken(ctx.res, await createRefreshToken(user))
        ctx.req.session!.userId = user.id;

        return user;
    }
}