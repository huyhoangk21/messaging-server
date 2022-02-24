import { AuthenticationError } from 'apollo-server-express';
import { AuthChecker } from 'type-graphql';
import { IContext } from '../interfaces/context';

export const authChecker: AuthChecker<IContext> = async (
  { root, args, context, info },
  roles
) => {
  try {
    const { user } = context;
    if (roles.length === 0) return user !== undefined;
    if (roles.includes(user.role)) return true;
    return false;
  } catch (error) {
    throw new AuthenticationError('Cannot authenticate user');
  }
};
