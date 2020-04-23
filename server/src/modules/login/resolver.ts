import { Resolver, Mutation, Arg, Ctx, ObjectType, Field } from "type-graphql";
import { IContext } from "../../interfaces/IContext";
import { User } from "../../entity/User";
import { compare } from "bcryptjs";
import { sendRefreshToken } from "../../sendRefreshToken";
import { createRefreshToken, createAccessToken } from "../../auth/auth";



@ObjectType()
class LoginResponse {
    @Field()
    accessToken: string

    @Field(() => User)
    user: User
}
@Resolver()
export class Login {
    @Mutation(() => LoginResponse)
    async login(
        @Arg("email") email: string,
        @Arg("password") password: string,
        @Ctx() { res, req }: IContext
    ): Promise<LoginResponse | any> {

        //check if user exist 
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new Error('could not find user');
        }

        //comapre password
        const valid = await compare(password, user.password);
        if (!valid) {
            throw new Error("bad password")
        }

        //check if confirm email
        if (!user.confirmed) {
            throw new Error("Please confirm your email")
        }

        req.session!.userId = user.id

        //login successful
        sendRefreshToken(res, await createRefreshToken(user))

        return {
            accessToken: createAccessToken(user),
            user
        }
    }
}