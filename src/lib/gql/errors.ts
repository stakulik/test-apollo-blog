import { ApolloServerErrorCode } from '@apollo/server/errors';
import { GraphQLError } from 'graphql';

export function throwAuthenticationError() {
  throw new GraphQLError(
    'You must authenticate',
    {
      extensions: {
        code: 'UNAUTHENTICATED',
      },
    },
  );
}

export function throwUserInputError(
  message: string,
  argumentName?: string,
): never {
  throw new GraphQLError(
    message,
    {
      extensions: {
        code: ApolloServerErrorCode.BAD_USER_INPUT,
        argumentName,
      },
    },
  );
}
