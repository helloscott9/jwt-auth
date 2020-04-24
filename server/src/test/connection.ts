import { createConnection } from 'typeorm';

export const testConnection = (drop: boolean = false) => {
    return createConnection({
        type: "postgres",
        host: "localhost",
        port: 5432,
        username: "artkodes",
        password: "artkodes",
        database: "jwt-auth-test",
        synchronize: drop,
        dropSchema: drop,
        entities: [
            __dirname + "/../entity/**/*.ts"
        ]
    });
};