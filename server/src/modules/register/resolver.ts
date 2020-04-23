import { sendEmail } from '../../utils/sendEmail';
import { createConfirmationUrl } from './../../utils/createConfirmationUrl';
import { Resolver, Mutation, Arg, Query } from "type-graphql";
import { hash } from "bcryptjs";
import { User } from "../../entity/User";
import { RegisterInput } from "../validator/RegisterInput";

@Resolver()
export class RegisterResolver {

    @Query(() => String)
    hello() {
        return 'hi';
    }


    @Mutation(() => User)
    async register(
        @Arg("data") { email, password, lastname, firstname }: RegisterInput,
    ): Promise<User> {

        const hashedPassword = await hash(password, 12)


        const user = await User.create({
            email,
            password: hashedPassword,
            lastname,
            firstname
        }).save()

        await sendEmail(email, await createConfirmationUrl(user.id))

        return user

    }
}


