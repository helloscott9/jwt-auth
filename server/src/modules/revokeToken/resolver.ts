import { Resolver, Mutation, Arg, Int } from "type-graphql";
import { getConnection } from "typeorm";
import { User } from "../../entity/User";

@Resolver()
export class RevokeRefreshToken {
    //revoke access token
    @Mutation(() => Boolean)
    async revokeRefreshTokenForUser(
        @Arg("userId", () => Int) userId: number
    ) {
        await getConnection()
            .getRepository(User)
            .increment({ id: userId }, 'tokenVersion', 1);

        return true
    }
}