import { isAuth } from './../../auth/isAuth';
import { IContext } from './../../interfaces/IContext';
import { Resolver, Mutation, Arg, UseMiddleware, Ctx, } from 'type-graphql';
import { GraphQLUpload, FileUpload } from "graphql-upload";
import { createWriteStream } from "fs";
import { verify } from 'jsonwebtoken';
import { User } from '../../entity/User';

@Resolver()
export class UploadResolver {
    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async singleUpload(
        @Arg('file', () => GraphQLUpload) file: FileUpload,
        @Ctx() context: IContext

    ) {

        const authorization = context.req.headers['authorization'];
        if (!authorization) {
            throw new Error("acces denied")
        }

        try {
            const token = authorization.split(" ")[1];
            const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);
            context.payload = payload as any;

            const user = await User.findOne(payload.userId)

            const { createReadStream, filename } = await file;

            let __filename = user!.id + "_" + filename

            const writableStream = createWriteStream(
                `${__dirname}/../../assets/images/${__filename}`,
                { autoClose: true }
            );
            return new Promise((res, rej) => {
                createReadStream()
                    .pipe(writableStream)
                    .on("finish", () => res(true))
                    .on("error", () => rej(false));
            });


        } catch (error) {
            console.log('error:', error)
            return null;

        }

    }
}





