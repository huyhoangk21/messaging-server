import { GraphQLError } from 'graphql';

const formatError = (e: GraphQLError) => {
  const formatted = new GraphQLError(e.message);
  formatted.extensions.code = e.extensions.code;
  return formatted;
};

export const errorsHandler = (e: GraphQLError) => {
  if (e.message.startsWith('Database Error')) {
    return formatError(new GraphQLError('Internal server error'));
  }

  return formatError(e);
};
