import { ApolloServer } from '@apollo/server';

import { GQLSchema } from '../config';
import { resolvers } from '../resolvers';

export const createServer = () => new ApolloServer({ typeDefs: GQLSchema, resolvers });
