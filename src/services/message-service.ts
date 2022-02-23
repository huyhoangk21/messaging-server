import { ApolloError, ForbiddenError } from 'apollo-server-express';
import { PubSubEngine } from 'type-graphql';
import { Service } from 'typedi';
import { Message, MessageModel } from '../entities/message';
import { User, UserModel } from '../entities/user';
import { Channel } from '../interfaces/channel';
import { Role } from '../interfaces/role';
import { MessageFeed } from '../resolvers/types/message-feed';
import { MessageInput } from '../resolvers/types/message-input';
import { convertDocument } from '../utils/convert-document';

@Service()
export class MessageService {
  constructor() {}

  public getMessagesByChannel = async (
    channel: Channel,
    cursor: string,
    user: User
  ): Promise<MessageFeed> => {
    try {
      if (channel === Channel.PRIVATE && user.role === Role.PUBLIC) {
        throw new ForbiddenError(
          `User ${user._id} is not authorized to access the required data source.`
        );
      }

      const messages = await MessageModel.find({ channel }).sort({
        sentAt: 'asc',
      });

      if (messages.length === 0) {
        return {
          hasMore: false,
          cursor,
          messages,
        };
      }

      var toMessageIndex: number;
      if (!cursor) {
        cursor = messages[messages.length - 1].id;
        toMessageIndex = messages.length;
      } else {
        toMessageIndex = messages.findIndex(message => message.id === cursor);
      }

      const limit = 20;

      const fromMessageIndex =
        toMessageIndex - limit < 0 ? 0 : toMessageIndex - limit;

      const newCursor = messages[fromMessageIndex].id;

      const hasMore = fromMessageIndex !== 0;

      const messageFeed: MessageFeed = {
        hasMore,
        cursor: newCursor,
        messages: messages.slice(fromMessageIndex, toMessageIndex),
      };

      return messageFeed;
    } catch (err) {
      throw err;
    }
  };

  public sendMessageToChannel = async (
    user: User,
    { text, channel }: MessageInput,
    pubSub: PubSubEngine
  ): Promise<String> => {
    try {
      if (channel === Channel.PRIVATE && user.role === Role.PUBLIC) {
        throw new ForbiddenError(
          `User ${user._id} is not authorized to access the required data source.`
        );
      }

      text = text.trim();
      const message = new MessageModel({
        user: user._id,
        text,
        channel,
        sentAt: Date.now(),
      });
      await message.save();
      pubSub.publish(channel, convertDocument(message));
      return `Message ${message._id} sent to ${channel} successfully.`;
    } catch (err) {
      throw err;
    }
  };

  public deleteMessageById = async (
    messageId: string,
    pubSub: PubSubEngine
  ): Promise<String> => {
    try {
      const message = await MessageModel.findById(messageId);
      if (!message) {
        throw new ApolloError(`Cannot find message with id ${messageId}`);
      }
      message.deleted = true;
      await message.save();
      pubSub.publish('DELETED ' + message.channel, convertDocument(message));
      return `Message ${messageId} deleted successfully.`;
    } catch (err) {
      throw err;
    }
  };

  public resolveUserFromMessage = async (message: Message): Promise<User> => {
    try {
      return await UserModel.findById(message.user);
    } catch (err) {
      throw err;
    }
  };
}
