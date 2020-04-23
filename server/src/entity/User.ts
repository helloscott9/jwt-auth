import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { ObjectType, Field, ID, Root } from "type-graphql";

@ObjectType()
@Entity("users")
export class User extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column('text')
    lastname: string;

    @Field()
    @Column('text')
    firstname: string;

    @Field()
    name(@Root() parent: User): string {
        return `${parent.firstname} ${parent.lastname}`;
    }

    @Field()
    @Column('text', { unique: true })
    email: string;

    @Column('text')
    password: string;

    @Column('bool', { default: false })
    confirmed: boolean;

    @Column('int', { default: 0 })
    tokenVersion: number;
}
