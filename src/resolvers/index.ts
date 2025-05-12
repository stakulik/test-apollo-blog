import { GraphQLUUID, GraphQLDateTimeISO } from 'graphql-scalars';

import { Post } from './fields';
import * as Mutation from './mutations';
import * as Query from './queries';

export const resolvers = {
  UUID: GraphQLUUID,
  DateTime: GraphQLDateTimeISO,
  Query,
  Mutation,
  // Fields
  Post,
};
