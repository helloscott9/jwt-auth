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

const meQuery = `
     {
        me{
            id
            firstname
            lastname
            email
            name
        }
    }
`;

describe('Me', () => {

    it("get user", async () => {

        //const user = 
        await User.create({
            firstname: faker.name.firstName(),
            lastname: faker.name.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password() // you can hash password if you want
        }).save()

        const response = await gCall({
            source: meQuery,
            token: "okokoko.sozo.skozk"
        });

        console.log(response);

        //if token is valid

        // expect(response).toMatchObject({
        //     data: {
        //         me: {
        //             id: `${response.data!.id}`,
        //             firstname: response.data!.firstname,
        //             lastname: response.data!.lastname,
        //             email: response.data!.email,
        //             name: response.data!.name
        //         }
        //     }
        // })


    });
});