import { IContext } from './../interfaces/IContext';
import { Resolver, Query, Ctx, UseMiddleware } from "type-graphql"

//bcrypt
import { isAuth } from '../auth/isAuth';


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


}