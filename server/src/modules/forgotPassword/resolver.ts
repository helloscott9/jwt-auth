import { forgotPasswordPrefix } from './../../constants/redisprefixes';
import { redis } from './../../redis';
import { Resolver, Mutation, Arg } from "type-graphql";
import { sendEmail } from '../../utils/sendEmail';
import { v4 } from "uuid"
import { User } from "../../entity/User";


@Resolver()
export class ForgotPassword {
    @Mutation(() => Boolean)
    async forgotPassword(
        @Arg("email") email: string,
    ): Promise<Boolean> {

        const user = await User.findOne({ where: { email } });

        if (!user) return true;

        const token = v4();
        await redis.set(forgotPasswordPrefix + token, user.id, "ex", 60 * 60 * 24); // 1 day expiration

        await sendEmail(email, `http://localhost:3000/user/forgot-password/${token}`);
        return true;

    }
}