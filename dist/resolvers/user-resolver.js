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
exports.UserResolver = void 0;
const type_graphql_1 = require("type-graphql");
const typedi_1 = require("typedi");
const user_1 = require("../entities/user");
const user_service_1 = require("../services/user-service");
const user_input_1 = require("./types/user-input");
const role_1 = require("../interfaces/role");
let UserResolver = class UserResolver {
    constructor(userService) {
        this.userService = userService;
    }
    async getMe(ctx) {
        return await this.userService.getMe(ctx);
    }
    async signupUser(userInput, ctx) {
        return await this.userService.signupUser(userInput, role_1.Role.PUBLIC, ctx);
    }
    async signinUser(userInput, ctx) {
        return await this.userService.signinUser(ctx, userInput);
    }
    signoutUser(ctx) {
        return this.userService.signoutUser(ctx);
    }
    async upgradeUser(code, ctx) {
        return await this.userService.upgradeUser(code, ctx);
    }
};
__decorate([
    (0, type_graphql_1.Query)(returns => user_1.User, { nullable: true }),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getMe", null);
__decorate([
    (0, type_graphql_1.Mutation)(returns => user_1.User),
    __param(0, (0, type_graphql_1.Arg)('userInput')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_input_1.UserInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "signupUser", null);
__decorate([
    (0, type_graphql_1.Mutation)(returns => user_1.User),
    __param(0, (0, type_graphql_1.Arg)('userInput')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_input_1.UserInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "signinUser", null);
__decorate([
    (0, type_graphql_1.Authorized)(),
    (0, type_graphql_1.Mutation)(returns => String),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "signoutUser", null);
__decorate([
    (0, type_graphql_1.Authorized)(),
    (0, type_graphql_1.Mutation)(returns => String),
    __param(0, (0, type_graphql_1.Arg)('code')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "upgradeUser", null);
UserResolver = __decorate([
    (0, typedi_1.Service)(),
    (0, type_graphql_1.Resolver)(of => user_1.User),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user-resolver.js.map