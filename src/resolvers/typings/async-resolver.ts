import type { GraphQLResolveInfo } from 'graphql';

export type AsyncResolver = (
  parent: unknown,
  params: any,
  context: any,
  info: GraphQLResolveInfo
) => Promise<unknown>;
