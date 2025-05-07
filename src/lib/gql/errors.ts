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
