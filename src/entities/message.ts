import { getModelForClass, prop as Property, Ref } from '@typegoose/typegoose';
import { Field, ObjectType } from 'type-graphql';
import { Channel } from '../interfaces/channel';
import { User } from './user';

@ObjectType()
export class Message {
  @Field()
  readonly _id: string;

  @Field(type => User)
  @Property({ ref: () => User, required: true })
  user: Ref<User>;

  @Field()
  @Property({ required: true })
  text: string;

  @Field()
  @Property({ enum: Channel, required: true })
  channel: Channel;

  @Field()
  @Property({ default: false, required: true })
  deleted: boolean;

  @Field()
  @Property({ default: Date.now(), required: true })
  sentAt: Date;
}

export const MessageModel = getModelForClass(Message);
