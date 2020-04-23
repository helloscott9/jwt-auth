import { Resolver, Mutation, Ctx } from "type-graphql";
import { IContext } from "../../interfaces/IContext";
import { sendRefreshToken } from "../../sendRefreshToken";

@Resolver()
export class Logout {
    //logout
    @Mutation(() => Boolean)
    async logout(
        @Ctx() { res, req }: IContext
    ): Promise<Boolean> {
        return new Promise((resolve, reject) => req.session!.destroy((err) => {
            if (err) {
                console.log('err:', err)
                reject(false)
            }
            sendRefreshToken(res, "");
            res.clearCookie
            resolve(true)
        }))
    }
}