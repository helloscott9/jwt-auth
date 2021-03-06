import { RegisterInput } from '../validator/RegisterInput';
import { Resolver, Mutation, Arg, UseMiddleware, ClassType, InputType, Field } from "type-graphql";
import { Middleware } from 'type-graphql/dist/interfaces/Middleware';
import { Product } from './../../entity/Produc';
import { User } from '../../entity/User';

function createResolver<T extends ClassType, X extends ClassType>(
    suffix: string,
    returnType: T,
    inputType: X,
    entity: any,
    middleware?: Middleware<any>[]
) {
    @Resolver()
    class BaseResolver {
        @Mutation(() => returnType, { name: `create${suffix}` })
        @UseMiddleware(...(middleware || []))
        async create(@Arg("data", () => inputType) data: any) {
            return entity.create(data).save();
        }
    }
    return BaseResolver;
}


@InputType()
class ProductInput {
    @Field()
    name: string;
}

export const CreateUserResolver = createResolver(
    "User",
    User,
    RegisterInput,
    User
);
export const CreateProductResolver = createResolver(
    "Product",
    Product,
    ProductInput,
    Product
);