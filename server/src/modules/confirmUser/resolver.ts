import { confirmUserPrefix } from './../../constants/redisprefixes';
import { redis } from '../../redis';
import { Resolver, Mutation, Arg } from "type-graphql";
import { User } from "../../entity/User";



@Resolver()
export class ConfirmUser {
    @Mutation(() => Boolean)
    async confirmUser(
        @Arg("token") token: string,
    ): Promise<Boolean> {

        const userId = await redis.get(confirmUserPrefix + token);
        //check if user exist 

        if (!userId) return false


        await User.update({ id: parseInt(userId, 10) }, { confirmed: true });
        await redis.del(token)

        return true

    }
}