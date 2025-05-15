import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import { IncomingRequestContext } from '../lib/shared';
import { appConfig, GQLSchema } from '../config';
import { resolvers } from '../resolvers';
import { Auth } from '../auth';

export async function startServer() {
  const server = new ApolloServer({
    typeDefs: GQLSchema,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: appConfig.server.port },
    context: async ({ req }): Promise<IncomingRequestContext> => {
      const userData = await new Auth(req).getAuthData();

      return {
        userData,
        req,
      };
    },
  });

  console.log(`🚀  Server ready at: ${url}`);
}
