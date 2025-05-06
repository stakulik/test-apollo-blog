import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import { appConfig, GQLSchema } from '../config';
import { resolvers } from '../resolvers';

export async function startServer() {
  const server = new ApolloServer({
    typeDefs: GQLSchema,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: appConfig.server.port },
  });

  console.log(`🚀  Server ready at: ${url}`);
}
