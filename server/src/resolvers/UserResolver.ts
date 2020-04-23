import { IContext } from './../interfaces/IContext';
import { verify } from 'jsonwebtoken';
import { createRefreshToken, createAccessToken } from '../auth/auth';
import { User } from '../entity/User';
import { Resolver, Query, Mutation, Arg, ObjectType, Field, Ctx, UseMiddleware, Int } from "type-graphql"

//bcrypt
import { hash, compare } from "bcryptjs"
import { isAuth } from '../auth/isAuth';
import { sendRefreshToken } from '../sendRefreshToken';
import { getConnection } from 'typeorm';

@ObjectType()
class LoginResponse {
    @Field()
    accessToken: string

    @Field(() => User)
    user: User
}

@Resolver()
export class UserResolver {
    @Query(() => String)
    hello() {
        return 'hi';
    }

    @Query(() => String)
    @UseMiddleware(isAuth)
    bye(
        @Ctx() { payload }: IContext
    ) {
        console.log('payload:', payload)
        return `your userId is ${payload!.userId}`;
    }

    //logout
    @Mutation(() => Boolean)
    async logout(
        @Ctx() { res }: IContext
    ) {
        sendRefreshToken(res, "");
        res.clearCookie
        return true
    }

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


    //get all users in the database
    @Query(() => [User])
    @UseMiddleware(isAuth)
    users() {
        return User.find();
    }

    @Mutation(() => LoginResponse)
    async login(
        @Arg("email") email: string,
        @Arg("password") password: string,
        @Ctx() { res }: IContext
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

        //login successful
        sendRefreshToken(res, await createRefreshToken(user))

        return {
            accessToken: createAccessToken(user),
            user
        }
    }


    @Mutation(() => Boolean)
    async register(
        @Arg("email") email: string,
        @Arg("password") password: string
    ) {

        const hashedPassword = await hash(password, 12)

        //check if user exist 
        const user = await User.findOne({ where: { email } });
        if (!user) {

            try {
                await User.insert({
                    email,
                    password: hashedPassword
                });

                return true
            } catch (error) {
                console.log('error:', error)
                return false
            }
        } else {
            throw new Error('email already exist');

        }
    }

}