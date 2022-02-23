import { getModelForClass, prop as Property } from '@typegoose/typegoose';
import { Authorized, Field, ObjectType } from 'type-graphql';
import { Role } from '../interfaces/role';

@ObjectType()
export class User {
  @Authorized(Role.ADMIN)
  @Field()
  readonly _id: string;

  @Field()
  @Property({ required: true, unique: true, trim: true })
  username: string;

  @Authorized(Role.ADMIN)
  @Field()
  @Property({ required: true })
  password: string;

  @Field()
  @Property({ enum: Role, required: true })
  role: Role;
}

export const UserModel = getModelForClass(User);
