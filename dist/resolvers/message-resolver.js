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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageResolver = void 0;
const type_graphql_1 = require("type-graphql");
const typedi_1 = require("typedi");
const message_1 = require("../entities/message");
const message_service_1 = require("../services/message-service");
const message_input_1 = require("./types/message-input");
const channel_1 = require("../interfaces/channel");
const role_1 = require("../interfaces/role");
const message_feed_1 = require("./types/message-feed");
let MessageResolver = class MessageResolver {
    constructor(messageService) {
        this.messageService = messageService;
    }
    async getMessagesByChannel(channel, cursor, { user }) {
        return await this.messageService.getMessagesByChannel(channel, cursor, user);
    }
    async sendMessageToChannel(pubSub, messageInput, { user }) {
        return await this.messageService.sendMessageToChannel(user, messageInput, pubSub);
    }
    async deleteMessageById(messageId, pubSub) {
        return await this.messageService.deleteMessageById(messageId, pubSub);
    }
    messageSentToChannel(channel, message) {
        return message;
    }
    messageDeletedById(channel, message) {
        return message;
    }
    async user(message) {
        return await this.messageService.resolveUserFromMessage(message);
    }
};
__decorate([
    (0, type_graphql_1.Authorized)(),
    (0, type_graphql_1.Query)(returns => message_feed_1.MessageFeed),
    __param(0, (0, type_graphql_1.Arg)('channel')),
    __param(1, (0, type_graphql_1.Arg)('cursor')),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], MessageResolver.prototype, "getMessagesByChannel", null);
__decorate([
    (0, type_graphql_1.Authorized)(),
    (0, type_graphql_1.Mutation)(returns => String),
    __param(0, (0, type_graphql_1.PubSub)()),
    __param(1, (0, type_graphql_1.Arg)('messageInput')),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [type_graphql_1.PubSubEngine,
        message_input_1.MessageInput, Object]),
    __metadata("design:returntype", Promise)
], MessageResolver.prototype, "sendMessageToChannel", null);
__decorate([
    (0, type_graphql_1.Authorized)(role_1.Role.ADMIN),
    (0, type_graphql_1.Mutation)(returns => String),
    __param(0, (0, type_graphql_1.Arg)('messageId')),
    __param(1, (0, type_graphql_1.PubSub)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, type_graphql_1.PubSubEngine]),
    __metadata("design:returntype", Promise)
], MessageResolver.prototype, "deleteMessageById", null);
__decorate([
    (0, type_graphql_1.Subscription)({ topics: ({ args }) => args.channel }),
    __param(0, (0, type_graphql_1.Arg)('channel')),
    __param(1, (0, type_graphql_1.Root)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, message_1.Message]),
    __metadata("design:returntype", message_1.Message)
], MessageResolver.prototype, "messageSentToChannel", null);
__decorate([
    (0, type_graphql_1.Subscription)({ topics: ({ args }) => 'DELETED ' + args.channel }),
    __param(0, (0, type_graphql_1.Arg)('channel')),
    __param(1, (0, type_graphql_1.Root)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, message_1.Message]),
    __metadata("design:returntype", message_1.Message)
], MessageResolver.prototype, "messageDeletedById", null);
__decorate([
    (0, type_graphql_1.FieldResolver)(),
    __param(0, (0, type_graphql_1.Root)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [message_1.Message]),
    __metadata("design:returntype", Promise)
], MessageResolver.prototype, "user", null);
MessageResolver = __decorate([
    (0, typedi_1.Service)(),
    (0, type_graphql_1.Resolver)(of => message_1.Message),
    __metadata("design:paramtypes", [message_service_1.MessageService])
], MessageResolver);
exports.MessageResolver = MessageResolver;
//# sourceMappingURL=message-resolver.js.map