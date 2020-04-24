import { createSchema } from './../utils/createSchema';
import { graphql, GraphQLSchema } from "graphql"
import Maybe from 'graphql/tsutils/Maybe';

interface Options {
    source: string;
    variableValues?: Maybe<{
        [key: string]: any;
    }>;
    token?: string;
}

let schema: GraphQLSchema;


export const gCall = async ({ source, variableValues, token }: Options) => {

    if (!schema) {
        schema = await createSchema();
    }

    return graphql({
        schema,
        source,
        variableValues,
        contextValue: {
            req: {
                headers: {
                    authorization: `beaer ${token}`
                }
            },
            res: {
                clearCookie: jest.fn()
            }
        }
    })
} 