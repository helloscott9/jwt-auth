import { createRefreshToken, createAccessToken } from './auth/auth';
import { sendRefreshToken } from './sendRefreshToken';
import { User } from './entity/User';
import 'dotenv/config'
import "reflect-metadata";
import { createConnection } from 'typeorm';
import { UserResolver } from './UserResolver';

import cors from "cors";
//express
import express from "express";
//consola
import consola from "consola";

//apollo server express
import { ApolloServer } from "apollo-server-express"
import { buildSchema } from "type-graphql";

import cookieParser from "cookie-parser"
import { verify } from 'jsonwebtoken';

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

    //Instance apollo server
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [UserResolver]
        }),
        context: ({ req, res }) => ({ req, res })
    })
    apolloServer.applyMiddleware({ app, cors: false })


    app.listen("4000", () => {
        consola.success({
            message: "express server started",
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
