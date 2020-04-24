# Jwt Authentication

Learn how to add **JWT authentication** to your project with this fullstack tutorial using **Node.js, Typescript, GraphQL, React, and PostgreSQL**.

## Installing

>Make sure to setup PostgreSQL for the GraphQL server

1. Install PostgreSQL on your computer

* Mac: https://www.codementor.io/engineerapart/getting-started-with-postgresql-on-mac-osx-are8jcopb

* Windows: https://www.guru99.com/download-install-postgresql.html

* Docker: https://www.youtube.com/watch?v=G3gnMSyX-XM

* Linux: you know what you're doing

* How to create a user: https://medium.com/coding-blocks/creating-user-database-and-adding-access-on-postgresql-8bfcd2f4a91e

3.Create database called  `jwt-auth`

4. [Add a user](https://medium.com/coding-blocks/creating-user-database-and-adding-access-on-postgresql-8bfcd2f4a91e)  with the username  `artkodes`  and and  password `artkodes`. (You can change what these values are in the  [ormconfig.json](https://github.com/benawad/graphql-ts-server-boilerplate/blob/master/ormconfig.json))
5. Clone and install dependecies

```
git clone https://github.com/helloscott9/jwt-auth.git
intall dependecies in server and client folder
yarn or npm i 
```

6. Go to your **Redis** folder and run `src/redis-server`

> if you don't have **Redis** on your computer, click [here](https://www.youtube.com/watch?v=4dzu1A1MW2A)

7. Start the all server
`yarn start`

To verified it worked, you can go to [http://localhost:4000](http://localhost:4000/)

## Technologies

- Typescript
- GraphQL
- TypeGraphQL
- TypeORM
- PostgreSQL
- React
- Apollo
- Redis

## Backend

 1. Setup GraphQL Server using TypeGraphQL and TypeORM
 2. Register user
 3. Login and create access and refresh tokens
 4. Authenticated mutations/queries
 5. Refresh the token
 6. Revoke tokens for users
 7. Redis
 8. Graphql-upload

## Frontend

 1. Setup Apollo and GraphQL Code Generator
 2. React Router
 3. Register/Login
 4. Persisting session on refresh
 5. Handling expired tokens
 6. Fetching current user in header, etc..

## Setting up a Test Environment TypeGraphQL

[**`ts-jest`**]([https://github.com/kulshekhar/ts-jest](https://github.com/kulshekhar/ts-jest)) is a TypeScript preprocessor with source map support for Jest that lets you use Jest to test projects written in TypeScript.

>Create database called `jwt-auth-test`

To  learn `jest` for french peoples, you can see this [video](https://www.youtube.com/watch?v=_9JTTGI9-K0).
