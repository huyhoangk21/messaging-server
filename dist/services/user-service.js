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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../entities/user");
const typedi_1 = require("typedi");
const apollo_server_express_1 = require("apollo-server-express");
const role_1 = require("../interfaces/role");
let UserService = class UserService {
    constructor() {
        this.getMe = async ({ user }) => {
            try {
                return user;
            }
            catch (err) {
                console.log(err);
                throw new apollo_server_express_1.ApolloError('Internal server error');
            }
        };
        this.signupUser = async ({ username, password, confirmPassword }, role, ctx) => {
            try {
                username = username.trim();
                password = password.trim();
                confirmPassword = confirmPassword.trim();
                if (!username || username.length < 4 || username.length > 10) {
                    throw new apollo_server_express_1.ValidationError('Username must be between 4-10 characters');
                }
                if (!password || password.length < 6) {
                    throw new apollo_server_express_1.ValidationError('Password must be at least 6 characters');
                }
                if (password !== confirmPassword) {
                    throw new apollo_server_express_1.ValidationError('Passwords do not match');
                }
                const existed = await user_1.UserModel.findOne({ username });
                if (existed) {
                    throw new apollo_server_express_1.ValidationError('Username is already taken');
                }
                const salt = await bcryptjs_1.default.genSalt(10);
                const hashedPassword = await bcryptjs_1.default.hash(password, salt);
                const user = new user_1.UserModel({
                    username,
                    password: hashedPassword,
                    role,
                });
                await user.save();
                const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, {
                    expiresIn: '3h',
                });
                ctx.res.cookie('token', token, {
                    httpOnly: true,
                    expires: new Date(Date.now() + 3 * 60 * 60 * 1000),
                });
                return user;
            }
            catch (err) {
                throw err;
            }
        };
        this.signinUser = async (ctx, { username, password }) => {
            try {
                const user = await user_1.UserModel.findOne({ username });
                if (!user) {
                    throw new apollo_server_express_1.AuthenticationError('Username or password is incorrect');
                }
                const matched = await bcryptjs_1.default.compare(password, user.password);
                if (!matched) {
                    throw new apollo_server_express_1.AuthenticationError('Username or password is incorrect');
                }
                const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, {
                    expiresIn: '3h',
                });
                ctx.res.cookie('token', token, {
                    httpOnly: true,
                    expires: new Date(Date.now() + 3 * 60 * 60 * 1000),
                });
                return user;
            }
            catch (err) {
                throw err;
            }
        };
        this.signoutUser = ({ res }) => {
            res.clearCookie('token');
            return `User logged out successfully`;
        };
        this.upgradeUser = async (code, { user }) => {
            try {
                const userDB = await user_1.UserModel.findOne({ username: user.username });
                if (code !== process.env.PRIVATE_ACCESS_CODE) {
                    throw new apollo_server_express_1.ForbiddenError('The access code is incorrect.');
                }
                userDB.role = role_1.Role.PRIVATE;
                await userDB.save();
                return `User ${userDB._id} gained access to the required resource succesfully`;
            }
            catch (err) {
                throw err;
            }
        };
    }
};
UserService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user-service.js.map