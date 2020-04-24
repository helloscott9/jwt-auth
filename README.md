# Jwt Authentication

Learn how to add **JWT authentication** to your project with this fullstack tutorial using **Node.js, Typescript, GraphQL, React, and PostgreSQL**.

>Make sure to setup PostgreSQL for the GraphQL server

1. Install PostgreSQL on your computer
2. Create database called  `jwt-auth`
3. [Add a user](https://medium.com/coding-blocks/creating-user-database-and-adding-access-on-postgresql-8bfcd2f4a91e)  with the username  `postgres`  and and no password. (You can change what these values are in the  [ormconfig.json](https://github.com/benawad/graphql-ts-server-boilerplate/blob/master/ormconfig.json))

## Technologies

- Typescript
- GraphQL
- TypeGraphQL
- TypeORM
- PostgreSQL
- React
- Apollo

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

To  learn `jest` for french peoples, you can see this [video]([https://www.youtube.com/watch?v=_9JTTGI9-K0](https://www.youtube.com/watch?v=_9JTTGI9-K0)) .
