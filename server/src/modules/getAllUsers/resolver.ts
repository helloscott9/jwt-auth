import { Resolver, Query, UseMiddleware } from "type-graphql";
import { User } from "../../entity/User";
import { isAuth } from "../../auth/isAuth";

@Resolver()
export class getAllUsers {

    //get all users in the database
    @Query(() => [User])
    @UseMiddleware(isAuth)
    users() {
        return User.find();
    }
}