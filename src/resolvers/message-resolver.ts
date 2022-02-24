import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  Mutation,
  PubSub,
  PubSubEngine,
  Query,
  Resolver,
  Root,
  Subscription,
} from 'type-graphql';
import { Service } from 'typedi';
import { Message } from '../entities/message';
import { MessageService } from '../services/message-service';
import { MessageInput } from './types/message-input';
import { IContext } from '../interfaces/context';
import { Channel } from '../interfaces/channel';
import { Role } from '../interfaces/role';
import { MessageFeed } from './types/message-feed';

@Service()
@Resolver(of => Message)
export class MessageResolver {
  constructor(private readonly messageService: MessageService) {}

  @Authorized()
  @Query(returns => MessageFeed)
  async getMessagesByChannel(
    @Arg('channel') channel: Channel,
    @Arg('cursor') cursor: string,
    @Ctx() { user }: IContext
  ) {
    return await this.messageService.getMessagesByChannel(
      channel,
      cursor,
      user
    );
  }

  @Authorized()
  @Mutation(returns => String)
  async sendMessageToChannel(
    @PubSub() pubSub: PubSubEngine,
    @Arg('messageInput') messageInput: MessageInput,
    @Ctx() { user }: IContext
  ) {
    return await this.messageService.sendMessageToChannel(
      user,
      messageInput,
      pubSub
    );
  }

  @Authorized(Role.ADMIN)
  @Mutation(returns => String)
  async deleteMessageById(
    @Arg('messageId') messageId: string,
    @PubSub() pubSub: PubSubEngine
  ) {
    return await this.messageService.deleteMessageById(messageId, pubSub);
  }

  @Subscription({ topics: ({ args }) => args.channel })
  messageSentToChannel(
    @Arg('channel') channel: Channel,
    @Root() message: Message
  ): Message {
    return message;
  }

  @Subscription({ topics: ({ args }) => 'DELETED ' + args.channel })
  messageDeletedById(
    @Arg('channel') channel: Channel,
    @Root() message: Message
  ): Message {
    return message;
  }

  @FieldResolver()
  async user(@Root() message: Message) {
    return await this.messageService.resolveUserFromMessage(message);
  }
}
