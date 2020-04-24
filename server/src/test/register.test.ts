import { User } from './../entity/User';
import { gCall } from './gCall';
import { testConnection } from './connection';
import { Connection } from 'typeorm';
import faker from "faker"
let conn: Connection;

beforeAll(async () => {
    await testConnection().then(async (connection) => {
        conn = connection
    });
})

afterAll(async () => {
    await conn.close()
})

const registerMutation = `
    mutation Register($data: RegisterInput!) {
        register(
            data: $data
        ) {
            id
            firstname
            lastname
            email
            name
        }
    }
`;

describe('Register', () => {

    it("create user", async () => {

        const user = {
            firstname: faker.name.firstName(),
            lastname: faker.name.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password()
        };


        const response = await gCall({
            source: registerMutation,
            variableValues: {
                data: user
            }
        });

        expect(response).toMatchObject({
            data: {
                register: {
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email
                }
            }
        });

        const dbUser = await User.findOne({ where: { email: user.email } });
        expect(dbUser).toBeDefined()
        expect(dbUser!.confirmed).toBeFalsy()
        expect(dbUser!.firstname).toBe(user.firstname)
    });
});