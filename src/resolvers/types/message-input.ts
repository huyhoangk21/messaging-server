import { Field, InputType } from 'type-graphql';
import { Channel } from '../../interfaces/channel';

@InputType()
export class MessageInput {
  @Field()
  text: string;

  @Field()
  channel: Channel;
}
