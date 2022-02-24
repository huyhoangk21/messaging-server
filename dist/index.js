"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie = __importStar(require("cookie"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const path = __importStar(require("path"));
const typedi_1 = require("typedi");
const graphql_1 = require("graphql");
const subscriptions_transport_ws_1 = require("subscriptions-transport-ws");
const database_1 = require("./utils/database");
const message_resolver_1 = require("./resolvers/message-resolver");
const user_resolver_1 = require("./resolvers/user-resolver");
const auth_checker_1 = require("./utils/auth-checker");
const typegoose_middleware_1 = require("./middlewares/typegoose-middleware");
const errors_handler_1 = require("./utils/errors-handler");
const user_1 = require("./entities/user");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const main = async () => {
    try {
        const app = (0, express_1.default)();
        const httpServer = http_1.default.createServer(app);
        app.use((0, cookie_parser_1.default)());
        app.use;
        (0, cors_1.default)({
            origin: process.env.CLIENT,
            credentials: true,
        });
        const db = new database_1.MongoDB(process.env.DB_USERNAME, process.env.DB_PASSWORD, process.env.DB_NAME);
        await db.connect();
        const schema = await (0, type_graphql_1.buildSchema)({
            resolvers: [message_resolver_1.MessageResolver, user_resolver_1.UserResolver],
            emitSchemaFile: path.resolve(__dirname, 'schema.gql'),
            globalMiddlewares: [typegoose_middleware_1.TypegooseMiddleware],
            container: typedi_1.Container,
            authChecker: auth_checker_1.authChecker,
            validate: false,
        });
        const context = async (ctx) => {
            try {
                var user;
                const token = ctx.req.cookies['token'];
                if (token) {
                    const { id } = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
                    user = await user_1.UserModel.findById(id);
                }
                return { ...ctx, user };
            }
            catch (err) {
                console.log(err);
                throw new Error('Internal server error');
            }
        };
        const subscriptionServer = subscriptions_transport_ws_1.SubscriptionServer.create({
            schema,
            execute: graphql_1.execute,
            subscribe: graphql_1.subscribe,
            onConnect: async (connectionParams, webSocket, ctx) => {
                try {
                    var user;
                    if (typeof webSocket.upgradeReq.headers.cookie === 'string') {
                        const cookies = cookie.parse(webSocket.upgradeReq.headers.cookie);
                        const token = cookies.token;
                        if (token) {
                            const { id } = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
                            user = await user_1.UserModel.findById(id);
                        }
                    }
                    return { ...ctx, user };
                }
                catch (err) {
                    console.log(err);
                    throw new Error('Internal server error');
                }
            },
            onDisconnect: () => { },
        }, {
            server: httpServer,
            path: '/graphql',
        });
        const apolloServer = new apollo_server_express_1.ApolloServer({
            schema,
            context,
            formatError: errors_handler_1.errorsHandler,
            plugins: [
                {
                    async serverWillStart() {
                        return {
                            async drainServer() {
                                subscriptionServer.close();
                            },
                        };
                    },
                },
            ],
        });
        await apolloServer.start();
        apolloServer.applyMiddleware({
            app,
            cors: {
                origin: process.env.CLIENT,
                credentials: true,
            },
        });
        httpServer.listen(process.env.PORT, () => {
            console.log('Server running');
        });
    }
    catch (err) {
        console.log(err);
    }
};
main();
//# sourceMappingURL=index.js.map