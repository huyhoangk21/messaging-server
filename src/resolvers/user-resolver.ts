import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { User } from '../entities/user';
import { UserService } from '../services/user-service';
import { UserInput } from './types/user-input';
import { IContext } from '../interfaces/context';
import { Role } from '../interfaces/role';

@Service()
@Resolver(of => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(returns => User, { nullable: true })
  async getMe(@Ctx() ctx: IContext) {
    return await this.userService.getMe(ctx);
  }

  @Mutation(returns => User)
  async signupUser(
    @Arg('userInput') userInput: UserInput,
    @Ctx() ctx: IContext
  ) {
    return await this.userService.signupUser(userInput, Role.PUBLIC, ctx);
  }

  @Mutation(returns => User)
  async signinUser(
    @Arg('userInput') userInput: UserInput,
    @Ctx() ctx: IContext
  ) {
    return await this.userService.signinUser(ctx, userInput);
  }

  @Authorized()
  @Mutation(returns => String)
  signoutUser(@Ctx() ctx: IContext) {
    return this.userService.signoutUser(ctx);
  }

  @Authorized()
  @Mutation(returns => String)
  async upgradeUser(@Arg('code') code: string, @Ctx() ctx: IContext) {
    return await this.userService.upgradeUser(code, ctx);
  }
}
