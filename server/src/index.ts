import { graphqlUploadExpress } from 'graphql-upload';
import 'dotenv/config'
import "reflect-metadata";

import { User } from './entity/User';
import { createConnection } from 'typeorm';

import session from "express-session";
import { RedisClient } from "redis";
import connectRedis from "connect-redis";

import { createSchema } from './utils/createSchema';
import { createRefreshToken, createAccessToken } from './auth/auth';
import { sendRefreshToken } from './sendRefreshToken';

import cors from "cors";
//express
import express from "express";
//consola
import consola from "consola";

//apollo server express
import { ApolloServer } from "apollo-server-express"

import cookieParser from "cookie-parser"
import { verify } from 'jsonwebtoken';
import { redis } from './redis';

import queryComplexity, {
    fieldConfigEstimator,
    simpleEstimator
} from "graphql-query-complexity";

(async () => {
    //initialise express
    const app = express();
    app.use(cookieParser())
    app.use(cors({
        origin: "http://localhost:3000",
        credentials: true
    }))
    app.get("/", (_req, res) => {
        res.send('hello')
    });

    app.post('/refresh_token', async (req, res) => {
        const token = req.cookies.jid
        console.log('token:', token)
        if (!token) {
            return res.send({ sucess: false, accessToken: '' })
        }
        let payload: any = null

        try {
            payload = verify(token, process.env.REFRESH_TOKEN_SECRET!)
            console.log('payload:', payload)
        } catch (error) {
            console.log('error:', error.message)
            return res.send({ sucess: false, err: error.message })
        }

        //token is valid we can send back an access
        const user = await User.findOne({ id: payload.userId })

        if (!user) {
            return res.send({ sucess: false, accessToken: '' })
        }

        if (user.tokenVersion !== payload.tokenVersion) {
            return res.send({ sucess: false, accessToken: '' })
        }

        //refresh token
        sendRefreshToken(res, await createRefreshToken(user))

        //create new acces token
        return res.send({
            sucess: true, accessToken: await createAccessToken(user)
        })


    });

    await createConnection();

    //express session
    const RedisStore = connectRedis(session); // connect node.req.session to redis backing store
    const sessionOption: session.SessionOptions = {
        store: new RedisStore({
            client: (redis as unknown) as RedisClient,
        }),
        name: "art",
        secret: process.env.SESSION_SECRET || "",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
        },
    };

    app.use(session(sessionOption));
    app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));


    //Instance apollo server
    const apolloServer = new ApolloServer({
        schema: await createSchema(),
        context: ({ req, res }) => ({ req, res }),
        uploads: false,
        validationRules: [
            queryComplexity({
                // The maximum allowed query complexity, queries above this threshold will be rejected
                maximumComplexity: 8,
                // The query variables. This is needed because the variables are not available
                // in the visitor of the graphql-js library
                variables: {},
                // Optional callback function to retrieve the determined query complexity
                // Will be invoked weather the query is rejected or not
                // This can be used for logging or to implement rate limiting
                onComplete: (complexity: number) => {
                    console.log("Query Complexity:", complexity);
                },
                estimators: [
                    // Using fieldConfigEstimator is mandatory to make it work with type-graphql
                    fieldConfigEstimator(),
                    // This will assign each field a complexity of 1 if no other estimator
                    // returned a value. We can define the default value for field not explicitly annotated
                    simpleEstimator({
                        defaultComplexity: 1
                    })
                ]
            }) as any
        ]
    })
    apolloServer.applyMiddleware({ app, cors: false })


    app.listen(process.env.APP_PORT, () => {
        consola.success({
            message: `express server started on http://localhost:${process.env.APP_PORT}/graphql`,
            badge: true
        })
    })

})()


// createConnection().then(async connection => {

//     console.log("Inserting a new user into the database...");
//     const user = new User();
//     user.firstName = "Timber";
//     user.lastName = "Saw";
//     user.age = 25;
//     await connection.manager.save(user);
//     console.log("Saved a new user with id: " + user.id);

//     console.log("Loading users from the database...");
//     const users = await connection.manager.find(User);
//     console.log("Loaded users: ", users);

//     console.log("Here you can setup and run express/koa/any other framework.");

// }).catch(error => console.log(error));
