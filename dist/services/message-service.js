"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageService = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const typedi_1 = require("typedi");
const message_1 = require("../entities/message");
const user_1 = require("../entities/user");
const channel_1 = require("../interfaces/channel");
const role_1 = require("../interfaces/role");
const convert_document_1 = require("../utils/convert-document");
let MessageService = class MessageService {
    constructor() {
        this.getMessagesByChannel = async (channel, cursor, user) => {
            try {
                if (channel === channel_1.Channel.PRIVATE && user.role === role_1.Role.PUBLIC) {
                    throw new apollo_server_express_1.ForbiddenError(`User ${user._id} is not authorized to access the required data source.`);
                }
                const messages = await message_1.MessageModel.find({ channel }).sort({
                    sentAt: 'asc',
                });
                if (messages.length === 0) {
                    return {
                        hasMore: false,
                        cursor,
                        messages,
                    };
                }
                var toMessageIndex;
                if (!cursor) {
                    cursor = messages[messages.length - 1].id;
                    toMessageIndex = messages.length;
                }
                else {
                    toMessageIndex = messages.findIndex(message => message.id === cursor);
                }
                const limit = 20;
                const fromMessageIndex = toMessageIndex - limit < 0 ? 0 : toMessageIndex - limit;
                const newCursor = messages[fromMessageIndex].id;
                const hasMore = fromMessageIndex !== 0;
                const messageFeed = {
                    hasMore,
                    cursor: newCursor,
                    messages: messages.slice(fromMessageIndex, toMessageIndex),
                };
                return messageFeed;
            }
            catch (err) {
                throw err;
            }
        };
        this.sendMessageToChannel = async (user, { text, channel }, pubSub) => {
            try {
                if (channel === channel_1.Channel.PRIVATE && user.role === role_1.Role.PUBLIC) {
                    throw new apollo_server_express_1.ForbiddenError(`User ${user._id} is not authorized to access the required data source.`);
                }
                text = text.trim();
                const message = new message_1.MessageModel({
                    user: user._id,
                    text,
                    channel,
                    sentAt: Date.now(),
                });
                await message.save();
                pubSub.publish(channel, (0, convert_document_1.convertDocument)(message));
                return `Message ${message._id} sent to ${channel} successfully.`;
            }
            catch (err) {
                throw err;
            }
        };
        this.deleteMessageById = async (messageId, pubSub) => {
            try {
                const message = await message_1.MessageModel.findById(messageId);
                if (!message) {
                    throw new apollo_server_express_1.ApolloError(`Cannot find message with id ${messageId}`);
                }
                message.deleted = true;
                await message.save();
                pubSub.publish('DELETED ' + message.channel, (0, convert_document_1.convertDocument)(message));
                return `Message ${messageId} deleted successfully.`;
            }
            catch (err) {
                throw err;
            }
        };
        this.resolveUserFromMessage = async (message) => {
            try {
                return await user_1.UserModel.findById(message.user);
            }
            catch (err) {
                throw err;
            }
        };
    }
};
MessageService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], MessageService);
exports.MessageService = MessageService;
//# sourceMappingURL=message-service.js.map