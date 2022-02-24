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
exports.MessageModel = exports.Message = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const type_graphql_1 = require("type-graphql");
const channel_1 = require("../interfaces/channel");
const user_1 = require("./user");
let Message = class Message {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], Message.prototype, "_id", void 0);
__decorate([
    (0, type_graphql_1.Field)(type => user_1.User),
    (0, typegoose_1.prop)({ ref: () => user_1.User, required: true }),
    __metadata("design:type", Object)
], Message.prototype, "user", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], Message.prototype, "text", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typegoose_1.prop)({ enum: channel_1.Channel, required: true }),
    __metadata("design:type", String)
], Message.prototype, "channel", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typegoose_1.prop)({ default: false, required: true }),
    __metadata("design:type", Boolean)
], Message.prototype, "deleted", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typegoose_1.prop)({ default: Date.now(), required: true }),
    __metadata("design:type", Date)
], Message.prototype, "sentAt", void 0);
Message = __decorate([
    (0, type_graphql_1.ObjectType)()
], Message);
exports.Message = Message;
exports.MessageModel = (0, typegoose_1.getModelForClass)(Message);
//# sourceMappingURL=message.js.map