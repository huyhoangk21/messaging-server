import 'reflect-metadata';
import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import * as cookie from 'cookie';
import cookieParser from 'cookie-parser';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import * as path from 'path';
import { Container } from 'typedi';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { MongoDB } from './utils/database';
import { MessageResolver } from './resolvers/message-resolver';
import { UserResolver } from './resolvers/user-resolver';
import { IContext } from './interfaces/context';
import { authChecker } from './utils/auth-checker';
import { TypegooseMiddleware } from './middlewares/typegoose-middleware';
import { errorsHandler } from './utils/errors-handler';
import { User, UserModel } from './entities/user';
import jwt from 'jsonwebtoken';
import { IToken } from './interfaces/token';

dotenv.config();

const main = async () => {
  try {
    const app = express();

    const httpServer = http.createServer(app);

    app.use(cookieParser());

    app.use;
    cors({
      origin: process.env.CLIENT,
      credentials: true,
    });

    const db = new MongoDB(
      process.env.DB_USERNAME,
      process.env.DB_PASSWORD,
      process.env.DB_NAME
    );

    await db.connect();

    const schema = await buildSchema({
      resolvers: [MessageResolver, UserResolver],
      emitSchemaFile: path.resolve(__dirname, 'schema.gql'),
      globalMiddlewares: [TypegooseMiddleware],
      container: Container,
      authChecker,
      validate: false,
    });

    const context = async (ctx: IContext) => {
      try {
        var user: User;
        const token = ctx.req.cookies['token'];
        if (token) {
          const { id } = jwt.verify(token, process.env.JWT_SECRET) as IToken;
          user = await UserModel.findById(id);
        }
        return { ...ctx, user };
      } catch (err) {
        console.log(err);
        throw new Error('Internal server error');
      }
    };

    const subscriptionServer = SubscriptionServer.create(
      {
        schema,
        execute,
        subscribe,
        onConnect: async (connectionParams, webSocket, ctx) => {
          try {
            var user: User;
            if (typeof webSocket.upgradeReq.headers.cookie === 'string') {
              const cookies = cookie.parse(webSocket.upgradeReq.headers.cookie);
              const token = cookies.token;
              if (token) {
                const { id } = jwt.verify(
                  token,
                  process.env.JWT_SECRET
                ) as IToken;
                user = await UserModel.findById(id);
              }
            }
            return { ...ctx, user };
          } catch (err) {
            console.log(err);
            throw new Error('Internal server error');
          }
        },
        onDisconnect: () => {},
      },
      {
        server: httpServer,
        path: '/graphql',
      }
    );

    const apolloServer = new ApolloServer({
      schema,
      context,
      formatError: errorsHandler,
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
      console.log(
        `Server running on ${process.env.CLIENT}${apolloServer.graphqlPath}`
      );
    });
  } catch (err) {
    console.log(err);
  }
};

main();
