import { startStandaloneServer } from '@apollo/server/standalone';

import { appConfig } from '../config';
import { Auth } from '../auth';

import { createServer } from './create-server';

export const startServer = async () => {
  const server = createServer();

  const { url } = await startStandaloneServer(server, {
    listen: { port: appConfig.server.port },
    context: async ({ req }) => {
      const userData = await new Auth(req).getAuthData();

      return {
        userData,
        req,
      };
    },
  });

  console.log(`🚀  Server ready at: ${url}`);
};
