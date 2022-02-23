import { Field, ObjectType } from 'type-graphql';
import { Message } from '../../entities/message';

@ObjectType()
export class MessageFeed {
  @Field()
  cursor: string;

  @Field()
  hasMore: boolean;

  @Field(returns => [Message])
  messages: Message[];
}
