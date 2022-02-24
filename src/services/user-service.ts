import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserInput } from '../resolvers/types/user-input';
import { User, UserModel } from '../entities/user';
import { Service } from 'typedi';
import {
  ApolloError,
  AuthenticationError,
  ForbiddenError,
  ValidationError,
} from 'apollo-server-express';
import { IContext } from '../interfaces/context';
import { Role } from '../interfaces/role';

@Service()
export class UserService {
  constructor() {}

  public getMe = async ({ user }: IContext): Promise<User> => {
    try {
      return user;
    } catch (err) {
      console.log(err);
      throw new ApolloError('Internal server error');
    }
  };

  public signupUser = async (
    { username, password, confirmPassword }: UserInput,
    role: Role,
    ctx: IContext
  ): Promise<User> => {
    try {
      username = username.trim();
      password = password.trim();
      confirmPassword = confirmPassword.trim();

      if (!username || username.length < 4 || username.length > 10) {
        throw new ValidationError('Username must be between 4-10 characters');
      }

      if (!password || password.length < 6) {
        throw new ValidationError('Password must be at least 6 characters');
      }

      if (password !== confirmPassword) {
        throw new ValidationError('Passwords do not match');
      }

      const existed = await UserModel.findOne({ username });

      if (existed) {
        throw new ValidationError('Username is already taken');
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = new UserModel({
        username,
        password: hashedPassword,
        role,
      });
      await user.save();

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '3h',
      });

      ctx.res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        expires: new Date(Date.now() + 3 * 60 * 60 * 1000),
      });

      return user;
    } catch (err) {
      throw err;
    }
  };

  public signinUser = async (
    ctx: IContext,
    { username, password }: UserInput
  ): Promise<User> => {
    try {
      const user = await UserModel.findOne({ username });

      if (!user) {
        throw new AuthenticationError('Username or password is incorrect');
      }

      const matched = await bcrypt.compare(password, user.password);

      if (!matched) {
        throw new AuthenticationError('Username or password is incorrect');
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '3h',
      });

      ctx.res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        expires: new Date(Date.now() + 3 * 60 * 60 * 1000),
      });

      return user;
    } catch (err) {
      throw err;
    }
  };

  public signoutUser = ({ res }: IContext) => {
    res.clearCookie('token');
    return `User logged out successfully`;
  };

  public upgradeUser = async (code: string, { user }: IContext) => {
    try {
      const userDB = await UserModel.findOne({ username: user.username });

      if (code !== process.env.PRIVATE_ACCESS_CODE) {
        throw new ForbiddenError('The access code is incorrect.');
      }

      userDB.role = Role.PRIVATE;
      await userDB.save();

      return `User ${userDB._id} gained access to the required resource succesfully`;
    } catch (err) {
      throw err;
    }
  };
}
